import { Board } from "./Board";
import {
  GameWrapper,
  PlayerIdContainer,
  BoardWrapper,
} from "../styled/game.styled";
import { MemoizedHandDetectionVideo } from "./HandDetectionVideo";
import { GameProps } from "../types/table";
import { memo } from "react";

function MyGame({ turn, userId, nickname }: GameProps) {
  console.log("MyGame rendered", turn);
  return (
    <GameWrapper>
      <BoardWrapper>
        <MemoizedHandDetectionVideo />
        {turn == userId ? <Board turn={turn} userId={userId} /> : null}
      </BoardWrapper>
      <PlayerIdContainer>Player: {nickname}</PlayerIdContainer>
    </GameWrapper>
  );
}

export const MemoizedMyGame = memo(MyGame);
