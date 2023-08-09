import { useEffect, memo, useContext, useRef, useCallback } from "react";
import { COL_LENGTH, ROW_LENGTH, UserType } from "../types/game.type";
import { Board } from "./Board";
import {
  GameWrapper,
  MyCameraView,
  CAMERA_VIEW_WIDTH,
  CAMERA_VIEW_HEIGHT,
  PlayerIdContainer,
  BoardWrapper,
} from "../styled/game.styled";
import { GameContext } from "../pages/GamePage";
import html2canvas from "html2canvas";

function OtherUserVideoView({
  turn,
  users,
  userNum,
}: {
  turn: number;
  users: UserType[];
  userNum: number;
}) {
  const { start } = useContext(GameContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (userNum > 0 && videoRef.current) {
      console.log(users);
      videoRef.current!.srcObject = users[0].stream!;
      videoRef.current!.play();
      audioRef.current!.srcObject = users[0].audioStream!;
      audioRef.current!.play();
      console.log(users[0].stream);
      console.log(users[0].audioStream);
    }
  }, [videoRef.current]);

  const handleScreenshot = useCallback(() => {
    const video = videoRef.current;
    const downloadLink = downloadLinkRef.current;

    if (video) {
      html2canvas(video).then((canvas) => {
        const screenshot = canvas.toDataURL("image/png");

        if (downloadLink) {
          downloadLink.href = screenshot;
          downloadLink.download = "screenshot.png";
          downloadLink.click();
        }
      });
    }
  }, [videoRef.current]);

  return (
    <>
      <GameWrapper>
        <BoardWrapper>
          <MyCameraView>
            <video
              ref={videoRef}
              style={{
                position: "absolute",
                transform: "scaleX(-1)",
                width: `${CAMERA_VIEW_WIDTH}vw`,
                height: `${CAMERA_VIEW_HEIGHT}vh`,
                border: "5px solid #ffffff",
              }}
              autoPlay
              playsInline
            />
            <audio ref={audioRef}></audio>
            <canvas
              ref={canvasRef}
              style={{
                width: `${CAMERA_VIEW_WIDTH}vw`,
                height: `${CAMERA_VIEW_HEIGHT}vh`,
                display: "hidden",
              }}
            />
          </MyCameraView>
          {((start && turn == users[0].userId) || turn == -1) && (
            <Board
              turn={turn}
              userId={users[0].userId}
              row={ROW_LENGTH}
              column={COL_LENGTH}
            />
          )}
        </BoardWrapper>
        <PlayerIdContainer>
          Player ID: {userNum > 0 ? users[0].userId : "None"}
        </PlayerIdContainer>
        {start && turn == users[0].userId && (
          <h2 style={{ color: "white" }}>Your Turn!</h2>
        )}
        <button onClick={handleScreenshot}>Take Screenshot</button>
        <a ref={downloadLinkRef} href="/" style={{ display: "none" }}>
          Download
        </a>
        <button onClick={() => downloadLinkRef.current?.click()}>
          Download Screenshot
        </button>
      </GameWrapper>
    </>
  );
}

export const MemoizedOtherUserVideoView = memo(OtherUserVideoView);
