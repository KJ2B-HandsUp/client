import { MemoizedSingleBoard } from "./SingleBoard";
import { GameWrapper } from "../styled/game.styled";
import HandDetectionVideo from "./HandDetectionVideo";
import { GameProps } from "../types/table";
import { memo, useContext } from "react";
import { SingleGameContext } from "../pages/SingleGamePage";

function SingleMyGame({ turn, userId, row, column }: GameProps) {
  const { start } = useContext(SingleGameContext);

  return (
    <GameWrapper>
      {<HandDetectionVideo />}
      {start && turn == userId && (
        <MemoizedSingleBoard
          turn={turn}
          userId={userId}
          row={row}
          column={column}
        />
      )}
    </GameWrapper>
  );
}

export const MemoizedSingleMyGame = memo(SingleMyGame);
