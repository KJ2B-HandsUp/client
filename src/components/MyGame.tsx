import { Board } from "./Board";
import {
  GameWrapper,
  PlayerIdContainer,
  BoardWrapper,
} from "../styled/game.styled";
import { MemoizedHandDetectionVideo } from "./HandDetectionVideo";
import { GameProps } from "../types/table";
import { memo, useContext } from "react";
import { GameContext } from "../pages/GamePage";

function MyGame({ turn, userId, row, column }: GameProps) {
  const { start } = useContext(GameContext);
  console.log("MyGame rendered", turn);
  return (
    <GameWrapper>
      <BoardWrapper>
        <MemoizedHandDetectionVideo />
        {turn == userId ? (
          <Board turn={turn} userId={userId} row={row} column={column} />
        ) : null}
      </BoardWrapper>
      <PlayerIdContainer>Player ID: {userId}</PlayerIdContainer>
      {start && turn == userId && <h2 color="red">Your Turn!</h2>}
    </GameWrapper>
  );
}

export const MemoizedMyGame = memo(MyGame);
