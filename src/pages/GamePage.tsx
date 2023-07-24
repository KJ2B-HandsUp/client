import Game from "../components/Game";
import HandDetect from "../components/HandDetect";
import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";

type CountContextType =
  | {
      moveType: string;
      setMoveType: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined;

export const MoveContext = React.createContext<CountContextType>(undefined);

export default function GamePage() {
  const [moveType, setMoveType] = useState("null");
  const videoElement = useRef<HTMLVideoElement>(null);

  const getMedia = async () => {
    if (videoElement.current) {
      console.log("done!");
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        videoElement.current.srcObject = stream;
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="game-container">
      <MoveContext.Provider value={{ moveType, setMoveType }}>
        <HandDetect />
        <Game />
      </MoveContext.Provider>
      <Button onClick={getMedia}>Get Media</Button>
      <video
        ref={videoElement}
        width="500px"
        height="500px"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
}
