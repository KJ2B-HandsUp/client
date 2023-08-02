import { Board } from "./Board";
import { GameContainer, PlayerIdContainer } from "../styled/game.styled";
import HandDetect from "./HandDetect";
import { TableProps } from "../types/table";
import { memo } from "react";

function MyGame({ turn, id, row, column }: TableProps) {
  return (
    <GameContainer>
      {<HandDetect />}
      {turn == id && <Board turn={turn} id={id} row={row} column={column} />}
      <PlayerIdContainer>Player ID: {id}</PlayerIdContainer>
      {turn == id && <h3 color="red">Your Turn!</h3>}
    </GameContainer>
  );
}

export default memo(MyGame);
