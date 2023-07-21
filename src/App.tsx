import Board from "./components/Board";
import UpcomingBlocks from "./components/UpcommingBlocks";
import { useTetris } from "./hooks/useTetris";
import WebCam from "./components/WebCam";

import "./index.css";

function App() {
  const { board, startGame, isPlaying, score, upComingBlocks } = useTetris();
  const { videoRef, getUserCamera } = WebCam();

  return (
    <div className="App">
      <h1>Tetris</h1>
      <video className="webcam" ref={videoRef} autoPlay></video>
      <Board currentBoard={board} />
      <div className="controls">
        <h2>Score: {score}</h2>
        {isPlaying ? (
          <UpcomingBlocks upcomingBlocks={upComingBlocks} />
        ) : (
          <button onClick={startGame}>New Game</button>
        )}
        <button
          onClick={() => {
            getUserCamera().catch((e) => console.log(e));
          }}
        >
          카메라 ON
        </button>
      </div>
    </div>
  );
}

export default App;
