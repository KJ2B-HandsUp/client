import Board from "./Board";
import UpcomingBlocks from "./UpcommingBlocks";
import { useTetris } from "../hooks/useTetris";

import "../index.css";

export default function Game() {
  const { board, startGame, isPlaying, score, upComingBlocks } = useTetris();

  return (
    <>
      <Board currentBoard={board} />
      <div className="controls">
        <h2>Score: {score}</h2>
        {isPlaying ? (
          <UpcomingBlocks upcomingBlocks={upComingBlocks} />
        ) : (
          <button onClick={startGame}>New Game</button>
        )}
      </div>
    </>
  );
}
