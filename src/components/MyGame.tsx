import { Board } from "./Board";
import { GameContainer } from "../styled/game.styled";
import HandDetect from "./HandDetect";
import { TableProps, GameProps } from "../types/table";
import { memo } from "react";

function MyGame({ turn, id, row, column }: TableProps) {
  //console.log("my game rendered");

  return (
    <GameContainer>
      <HandDetect />
      {turn == id && <Board turn={turn} id={id} row={row} column={column} />}
    </GameContainer>
  );
}

export default memo(MyGame);
