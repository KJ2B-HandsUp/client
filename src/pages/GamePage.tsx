import Game from "../components/Game";
import HandDetect from "../components/HandDetect";
import React, { useState } from "react";

type CountContextType =
  | {
      moveType: string;
      setMoveType: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined;

export const MoveContext = React.createContext<CountContextType>(undefined);

export default function GamePage() {
  const [moveType, setMoveType] = useState("null");

  return (
    <div className="game-container">
      <MoveContext.Provider value={{ moveType, setMoveType }}>
        <HandDetect />
        <Game />
      </MoveContext.Provider>
    </div>
  );
}
