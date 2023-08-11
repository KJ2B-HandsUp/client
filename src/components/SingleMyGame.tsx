import { MemoizedSingleBoard } from "./SingleBoard";
import { GameWrapper } from "../styled/game.styled";
import { MemoizedHandDetectionVideo } from "./HandDetectionVideo";
import { GameProps } from "../types/table";
import { memo, useContext } from "react";
import { SingleGameContext } from "../pages/SingleGamePage";

function SingleMyGame({ turn, userId }: GameProps) {
  const { start } = useContext(SingleGameContext);

  return (
    <GameWrapper>
      <MemoizedHandDetectionVideo />
      {start && turn == userId && (
        <MemoizedSingleBoard turn={turn} userId={userId} />
      )}
    </GameWrapper>
  );
}

export const MemoizedSingleMyGame = memo(SingleMyGame);
