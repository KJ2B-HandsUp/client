import { io, Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import {
  DtlsParameters,
  RtpCapabilities,
  RtpParameters,
  Transport,
  TransportListenIp,
  TransportTuple,
  ProducerOptions,
} from "mediasoup/node/lib/types";

const roomName = window.location.pathname.split("/")[2];

let device: mediasoupClient.Device;
let rtpCapabilities: RtpCapabilities;

let producerTransport: mediasoupClient.types.Transport<mediasoupClient.types.AppData>;
let consumerTransports: Transport[] = [];
let audioProducer;
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

export const getLocalStream = (): void => {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        },
      },
    })
    .then((stream) => {
      console.log("asdfa");
      streamSuccess(stream);
    })
    .catch((error: Error) => {
      console.log("error boom!");
      console.log(error.message);
    });
};

let localVideo: HTMLVideoElement;
let videoParams: mediasoupClient.types.ProducerOptions;

const streamSuccess = (stream: MediaStream): void => {
  localVideo.srcObject = stream;
  console.log("here? streamSuccess");
  videoParams = { track: stream.getVideoTracks()[0], ...params };
  joinRoom();
};

interface JoinRoomData {
  rtpCapabilities: RtpCapabilities;
}

const joinRoom = (): void => {
  console.log("here? streamSuccess After");
  socket.emit("joinRoom", { roomName }, (data: JoinRoomData) => {
    console.log("Router RTP Capabilities...");
    console.log(data.rtpCapabilities);
    rtpCapabilities = data.rtpCapabilities;
    createDevice();
  });
  console.log("here? joinRoom Afeter");
};

const createDevice = async (): Promise<void> => {
  try {
    const device = new mediasoupClient.Device();

    await device.load({
      routerRtpCapabilities: rtpCapabilities,
    });

    console.log("Device RTP Capabilities", device.rtpCapabilities);

    createSendTransport();
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

interface Params {
  error?: string;
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
  sctpParameters?: SctpParameters;
  io: Socket;
  producer: boolean;
}

interface IceParameters {
  usernameFragment: string;
  password: string;
  iceLite?: boolean;
}

interface IceCandidate {
  foundation: string;
  priority: number;
  ip: string;
  protocol: "udp" | "tcp";
  port: number;
  type: "host" | "srflx" | "prflx" | "relay";
  tcpType?: "active" | "passive" | "so";
  relatedAddress?: string;
  relatedPort?: number;
}

interface SctpParameters {
  port: number;
  OS: number;
  MIS: number;
  maxMessageSize: number;
}

const createSendTransport = () => {
  socket.emit(
    "createWebRtcTransport",
    { consumer: false },
    (params: Params) => {
      if (params.error) {
        console.log(params.error);
        return;
      }

      console.log(params);

      producerTransport = device.createSendTransport(params);
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
                  getProducers();
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
    },
  );
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

const consumingTransports: string[] = [];

export const signalNewConsumerTransport = (remoteProducerId: string) => {
  if (consumingTransports.includes(remoteProducerId)) {
    return;
  }
  consumingTransports.push(remoteProducerId);

  socket.emit(
    "createWebRtcTransport",
    { consumer: true },
    ({ params }: { params }) => {
      if (params.error) {
        console.log(params.error);
        return;
      }
      1;
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

      connectRecvTransport(consumerTransport, remoteProducerId, params.id);
    },
  );
};

const getProducers = (): void => {
  socket.emit("getProducers", (producerIds: string[]) => {
    console.log(producerIds);
    producerIds.forEach(signalNewConsumerTransport);
  });
};

const connectRecvTransport = (
  consumerTransport: Transport<mediasoupClient.types.AppData>,
  remoteProducerId: string,
  serverConsumerTransportId: string,
) => {
  socket.emit(
    "consume",
    {
      rtpCapabilities: device.rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    },
    async ({ params }: { params }) => {
      // replace 'any' with the actual type
      if (params.error) {
        console.log("Cannot Consume");
        return;
      }

      console.log(`Consumer Params`);
      console.log(params);
      const consumer = await consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
      });

      consumerTransports = [
        ...consumerTransports,
        {
          consumerTransport,
          serverConsumerTransportId: params.id,
          producerId: remoteProducerId,
          consumer,
        },
      ];

      const newElem = document.createElement("div");
      newElem.setAttribute("id", `td-${remoteProducerId}`);

      newElem.setAttribute("class", "remoteVideo");
      newElem.innerHTML =
        '<video id="' + remoteProducerId + '" autoplay class="video" ></video>';

      videoContainer.appendChild(newElem);
      const { track } = consumer;

      (
        document.getElementById(remoteProducerId) as HTMLMediaElement
      ).srcObject = new MediaStream([track]);

      socket.emit("consumer-resume", {
        serverConsumerId: params.serverConsumerId,
      });
    },
  );
};

export const closeProducer = (remoteProducerId: string) => {
  const producerToClose = consumerTransports.find(
    (transportData) => transportData.producerId === remoteProducerId,
  );

  if (!producerToClose) {
    console.log(`Cannot find producer with id ${remoteProducerId}`);
    return;
  }

  producerToClose.consumerTransport.close();
  producerToClose.consumer.close();

  consumerTransports = consumerTransports.filter(
    (transportData) => transportData.producerId !== remoteProducerId,
  );

  const elementToRemove = document.getElementById(`td-${remoteProducerId}`);

  if (elementToRemove) {
    videoContainer.removeChild(elementToRemove);
  } else {
    console.log(`Cannot find element with id td-${remoteProducerId}`);
  }
};
