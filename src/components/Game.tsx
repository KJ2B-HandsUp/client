import Board from "./Board";
import UpcomingBlocks from "./UpcommingBlocks";
import { useTetris } from "../hooks/useTetris";
import styled from "styled-components";

const GameWrapper = styled.div`
  align-items: center;
  justify-content: center;
`;

export default function Game() {
  const { board, startGame, isPlaying, score, upComingBlocks } = useTetris();

  return (
    <GameWrapper>
      <Board currentBoard={board} />
      <div>
        <h2>Score: {score}</h2>
        {isPlaying ? (
          <UpcomingBlocks upcomingBlocks={upComingBlocks} />
        ) : (
          <button onClick={startGame}>New Game</button>
        )}
        <button>Share Video</button>
      </div>
    </GameWrapper>
  );
}
