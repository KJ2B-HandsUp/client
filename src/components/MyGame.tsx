import { Board } from "./Board";
import {
  GameWrapper,
  PlayerIdContainer,
  BoardWrapper,
} from "../styled/game.styled";
import HandDetectionVideo from "./HandDetectionVideo";
import { GameProps } from "../types/table";
import { memo, useContext } from "react";
import { SingleGameContext } from "../pages/SingleGamePage";

function MyGame({ turn, userId, row, column }: GameProps) {
  const { start } = useContext(SingleGameContext);

  return (
    <GameWrapper>
      <BoardWrapper>
        {<HandDetectionVideo />}
        {turn == userId && (
          <Board turn={turn} userId={userId} row={row} column={column} />
        )}
      </BoardWrapper>
      <PlayerIdContainer>Player ID: {userId}</PlayerIdContainer>
      {start && turn == userId && <h2 color="red">Your Turn!</h2>}
    </GameWrapper>
  );
}

export const MemoizedMyGame = memo(MyGame);
