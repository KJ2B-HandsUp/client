import { SoloGameBoard } from "./SoloGameBoard";
import { GameContainer, PlayerIdContainer } from "../../styled/game.styled";
import HandDetect from "../HandDetect";
import { TableProps } from "../../types/table";
import { memo } from "react";

function SoloMyGame({ turn, id, row, column }: TableProps) {
  return (
    <GameContainer>
      {<HandDetect />}
      {turn == id && (
        <SoloGameBoard turn={turn} id={id} row={row} column={column} />
      )}
      <PlayerIdContainer>Player ID: {id}</PlayerIdContainer>
      {turn == id && <h3 color="red">Your Turn!</h3>}
    </GameContainer>
  );
}

export default memo(SoloMyGame);
