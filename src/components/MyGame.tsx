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
  console.log("MyGame rendered", turn);
  return (
    <GameWrapper>
      <BoardWrapper>
        <HandDetectionVideo />
        {turn == userId || turn == -1 ? (
          <Board turn={turn} userId={userId} row={row} column={column} />
        ) : null}
      </BoardWrapper>
      <PlayerIdContainer>Player ID: {userId}</PlayerIdContainer>
      {start && turn == userId && <h2 color="red">Your Turn!</h2>}
    </GameWrapper>
  );
}

export const MemoizedMyGame = memo(MyGame);
