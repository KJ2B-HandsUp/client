import styled from "styled-components";

const GameWrapper = styled.div`
  align-items: center;
  justify-content: center;
`;

export default function Game() {
  return (
    <GameWrapper>
      <div>
        <h2>Score: {score}</h2>
        {isPlaying ? (
          <></>
        ) : (
          <button onClick={startGame}>New Game</button>
        )}
        <button>Share Video</button>
      </div>
    </GameWrapper>
  );
}
