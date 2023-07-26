import { Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import {
  DtlsParameters,
  RtpCapabilities,
  RtpParameters,
  Transport,
} from "mediasoup/node/lib/types";
import { Device } from "mediasoup-client";

let device: Device;
let rtpCapabilities: RtpCapabilities;

let producerTransport;
let consumerTransports: Transport[] = [];
let videoProducer;

const params = {
  encodings: [
    {
      rid: "r0",
      maxBitrate: 100000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r1",
      maxBitrate: 300000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r2",
      maxBitrate: 900000,
      scalabilityMode: "S1T3",
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

let videoParams: mediasoupClient.types.ProducerOptions;

export const streamSuccess = (
  stream: MediaStream,
  socket: Socket,
  roomName: string,
): void => {
  videoParams = { track: stream.getVideoTracks()[0], ...params };
  joinRoom(socket, roomName);
};

interface JoinRoomData {
  rtpCapabilities: RtpCapabilities;
}

const joinRoom = (socket: Socket, roomName: string): void => {
  socket.emit("joinRoom", { roomName }, (data: JoinRoomData) => {
    console.log("Router RTP Capabilities...");
    console.log(data.rtpCapabilities);
    rtpCapabilities = data.rtpCapabilities;
    createDevice(socket);
  });
};

const createDevice = async (socket: Socket): Promise<void> => {
  try {
    device = new mediasoupClient.Device();

    await device.load({
      routerRtpCapabilities: rtpCapabilities,
    });

    console.log("Device RTP Capabilities", device.rtpCapabilities);

    createSendTransport(socket);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      if (error.name === "UnsupportedError")
        console.warn("browser not supported");
    } else {
      console.log("An error occurred: ", error);
    }
  }
};

const createSendTransport = async (socket: Socket) => {
  let params;
  try {
    params = await new Promise((resolve, reject) => {
      socket.emit("createWebRtcTransport", { consumer: false }, (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
    console.log(params.params);
    producerTransport = device.createSendTransport(params.params);
    console.log("here??????");
    producerTransport.on(
      "connect",
      (
        { dtlsParameters }: { dtlsParameters: DtlsParameters },
        callback: () => void,
        errback: (error: Error) => void,
      ) => {
        try {
          socket.emit("transport-connect", {
            dtlsParameters,
          });

          callback();
        } catch (error: unknown) {
          if (error instanceof Error) {
            errback(error);
          }
        }
      },
    );

    producerTransport.on(
      "produce",
      (
        parameters: {
          kind: string;
          rtpParameters: RtpParameters;
          appData: any;
        },
        callback: (arg0: { id: string }) => void,
        errback: (error: Error) => void,
      ) => {
        console.log(parameters);

        try {
          socket.emit(
            "transport-produce",
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
            },
            ({
              id,
              producersExist,
            }: {
              id: string;
              producersExist: boolean;
            }) => {
              callback({ id });

              if (producersExist) {
                getProducers(socket);
              }
            },
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            errback(error);
          }
        }
      },
    );

    connectSendTransport();
  } catch (error) {
    console.error(error);
  }
};

const connectSendTransport = async (): Promise<void> => {
  try {
    if (producerTransport) {
      videoProducer = await producerTransport.produce(videoParams);

      videoProducer?.on("trackended", () => {
        console.log("video track ended");
      });

      videoProducer?.on("transportclose", () => {
        console.log("video transport ended");
      });
    }
  } catch (error: any) {
    console.log(error);
  }
};

interface ParamsResponse {
  error?: string;
  id: string;
}

const getProducers = (socket: Socket): void => {
  socket.emit("getProducers", (producerIds: string[]) => {
    console.log(producerIds);
    producerIds.forEach((id) => {
      signalNewConsumerTransport(id, socket);
    });
  });
};

const consumingTransports: string[] = [];

export const signalNewConsumerTransport = (
  remoteProducerId: string,
  socket: Socket,
): Promise<MediaStream | undefined> => {
  return new Promise((resolve, reject) => {
    if (consumingTransports.includes(remoteProducerId)) {
      return;
    }
    consumingTransports.push(remoteProducerId);

    socket.emit("createWebRtcTransport", { consumer: true }, ({ params }) => {
      console.log("PARAMS...");
      console.log(params);

      let consumerTransport: mediasoupClient.types.Transport;
      try {
        consumerTransport = device.createRecvTransport(params);
      } catch (error) {
        console.log(error);
        return;
      }

      consumerTransport.on(
        "connect",
        (
          {
            dtlsParameters,
          }: { dtlsParameters: mediasoupClient.types.DtlsParameters },
          callback,
          errback,
        ) => {
          try {
            socket.emit("transport-recv-connect", {
              dtlsParameters,
              serverConsumerTransportId: params.id,
            });
            callback();
          } catch (error: unknown) {
            if (error instanceof Error) {
              errback(error);
            }
          }
        },
      );

      connectRecvTransport(
        consumerTransport,
        remoteProducerId,
        params.id,
        socket,
      )
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

const getStream = (
  consumerTransport: Transport<mediasoupClient.types.AppData>,
  remoteProducerId: string,
  serverConsumerTransportId: string,
  socket: Socket,
): Promise<MediaStream> => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }) => {
        console.log(`Consumer Params`);
        console.log(params);
        const consumer = await consumerTransport.consume(params);

        consumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];

        socket.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
        console.log("here 1?");
        try {
          const { track } = consumer;
          const mediaStream = new MediaStream([track]);
          resolve(mediaStream);
        } catch (error) {
          reject(error);
        }
      },
    );
  });
};

const connectRecvTransport = async (
  consumerTransport: Transport<mediasoupClient.types.AppData>,
  remoteProducerId: string,
  serverConsumerTransportId: string,
  socket: Socket,
): Promise<MediaStream | undefined> => {
  try {
    const mediaStream = await getStream(
      consumerTransport,
      remoteProducerId,
      serverConsumerTransportId,
      socket,
    );
    return mediaStream;
  } catch (error) {
    console.error("Failed to get the media stream:", error);
  }
};

// socket.on("producer-closed")
export const closeProducer = (remoteProducerId: string) => {
  const producerToClose = consumerTransports.find(
    (transportData) => transportData.appData.producerId === remoteProducerId,
  );

  if (!producerToClose) {
    console.log(`Cannot find producer with id ${remoteProducerId}`);
    return;
  }

  producerToClose.close();

  consumerTransports = consumerTransports.filter(
    (transportData) => transportData.appData.producerId !== remoteProducerId,
  );

  // todo: remove video
};
