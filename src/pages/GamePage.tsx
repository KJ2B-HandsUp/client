import Game from "../components/Game";
import HandDetect from "../components/HandDetect";
import { useState, useRef, useEffect, useMemo, createContext } from "react";
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

  const { roomId } = useParams();

  useMemo(() => {
    if (socket == null) {
      socket = io("https://choijungle.shop/mediasoup");

      const handleBeforeUnload = (event) => {
        socket.emit("disconnect");
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      socket.on("connection-success", ({ socketId }: { socketId: string }) => {
        console.log("Connection success!");

        navigator.mediaDevices
          .getDisplayMedia({
            audio: false,
            video: true,
          })
          .then((stream) => {
            if (roomId !== undefined) {
              streamSuccess(stream, socket, roomId);
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
        </Col>
        <Col>
          <video
            ref={player1VideoRef}
            width="500px"
            height="500px"
            autoPlay
            playsInline
            muted
          />
        </Col>
      </Row>
    </Container>
  );
}
