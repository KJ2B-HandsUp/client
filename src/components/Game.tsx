import styled from "styled-components";
import { Board } from "./Board";

const GameWrapper = styled.div`
  align-items: center;
  justify-content: center;
`;

export default function Game() {
  console.log("game rendered");
  return (
    <GameWrapper>
      <Board row={4} column={6} />
      <h2>Score: 0</h2>
      <button>New Game</button>
    </GameWrapper>
  );
}
