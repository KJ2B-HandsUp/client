import Game from "../components/Game";
import HandDetect from "../components/HandDetect";
import { useState, useRef, useEffect, createContext } from "react";
import {
  signalNewConsumerTransport,
  closeProducer,
  streamSuccess,
} from "../utils/socketio";
import { io, Socket } from "socket.io-client";
import { GameContainer } from "../styled/game.styled";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";

type CountContextType =
  | {
      moveType: string;
      setMoveType: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined;

export const MoveContext = createContext<CountContextType>(undefined);

let socket: Socket;

export default function GamePage() {
  const [moveType, setMoveType] = useState("null");
  const player1VideoRef = useRef<HTMLVideoElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { roomId } = useParams();
  const handleBeforeUnload = () => {
    socket.emit("disconnect");
  };

  useEffect(() => {
    if (socket == null) {
      socket = io("https://choijungle.shop/mediasoup");

      window.addEventListener("beforeunload", handleBeforeUnload);

      socket.on("connection-success", ({ socketId }: { socketId: string }) => {
        navigator.mediaDevices
          .getDisplayMedia({
            audio: false,
            video: {
              width: { max: 640 },
              height: { max: 480 },
            },
          })
          .then(async (stream) => {
            if (videoRef.current && canvasRef.current) {
              videoRef.current.srcObject = stream;
              await videoRef.current.play();
              // 캔버스에 0, 0에서 500, 500 사이의 영역만 그림
              const ctx = canvasRef.current.getContext("2d");
              const draw = () => {
                ctx!.drawImage(
                  videoRef.current,
                  0,
                  0,
                  400,
                  700,
                  0,
                  0,
                  canvasRef.current!.width,
                  canvasRef.current!.height,
                );
                requestAnimationFrame(draw);
              };
              draw();

              // 결과를 새 비디오 스트림으로 만듬
              const outputStream = canvasRef.current.captureStream();
              if (roomId !== undefined) {
                await streamSuccess(outputStream, socket, roomId).then(
                  (mediaStreamList) => {
                    if (player1VideoRef.current && mediaStreamList[0]) {
                      player1VideoRef.current.srcObject = mediaStreamList[0];
                    }
                  },
                );
              }
            }
          })
          .catch((error: Error) => {
            console.error(error.message);
          });
      });

      socket.on(
        "new-producer",
        async ({ producerId }: { producerId: string }) => {
          console.log(producerId);
          try {
            const player1Stream = await signalNewConsumerTransport(
              producerId,
              socket,
            );
            console.log(player1Stream);
            if (player1VideoRef.current && player1Stream) {
              console.log("done");
              player1VideoRef.current.srcObject = player1Stream;
            }
          } catch (error) {
            console.error("Failed to signal new consumer transport:", error);
          }
        },
      );

      socket.on(
        "producer-closed",
        ({ remoteProducerId }: { remoteProducerId: string }): void => {
          closeProducer(remoteProducerId);
        },
      );
    }

    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <GameContainer>
            <MoveContext.Provider value={{ moveType, setMoveType }}>
              <HandDetect />
              <Game />
            </MoveContext.Provider>
          </GameContainer>
          <video ref={videoRef} style={{ display: "none" }}></video>
          <canvas ref={canvasRef} width={400} height={700}></canvas>
        </Col>
        <Col>
          <video
            ref={player1VideoRef}
            width="400"
            height="700px"
            autoPlay
            playsInline
            muted
          />
        </Col>
      </Row>
    </Container>
  );
}
