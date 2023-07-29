import Game from "../components/Game";
import HandDetect from "../components/HandDetect";
import { useState, useRef, useEffect, createContext, useCallback } from "react";
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
  console.log("gamepage rendered");
  const playersVideoRef = useRef<HTMLVideoElement>(null);

  const { roomId } = useParams();

  const handleBeforeUnload = useCallback(() => {
    socket.emit("disconnect");
  }, []);

  useEffect(() => {
    if (socket != undefined) {
      socket = io("https://choijungle.shop/mediasoup");

      window.addEventListener("beforeunload", handleBeforeUnload);

      socket.on("connection-success", ({ socketId }: { socketId: string }) => {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: true,
          })
          .then(async (stream) => {
            if (roomId !== undefined) {
              await streamSuccess(stream, socket, roomId).then(
                (mediaStreamList) => {
                  if (playersVideoRef.current && mediaStreamList[0]) {
                    playersVideoRef.current.srcObject = mediaStreamList[0];
                  }
                },
              );
            }
          })
          .catch((error: Error) => {
            console.error(error.message);
          });
      });

      socket.on(
        "new-producer",
        async ({ producerId }: { producerId: string }) => {
          try {
            const player1Stream = await signalNewConsumerTransport(
              producerId,
              socket,
            );
            if (playersVideoRef.current && player1Stream) {
              playersVideoRef.current.srcObject = player1Stream;
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
          {playersVideoRef.current && <video ref={playersVideoRef}></video>}
        </Col>
      </Row>
    </Container>
  );
}
