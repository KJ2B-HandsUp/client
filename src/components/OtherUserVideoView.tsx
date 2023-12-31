import { useEffect, memo, useContext, useRef } from "react";
import { UserType } from "../types/game.type";
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

function OtherUserVideoView({
  turn,
  user,
  userNum,
}: {
  turn: number;
  user: UserType;
  userNum: number;
}) {
  console.log("otheruservideo rendered", user);
  const { start } = useContext(GameContext);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (userNum > 0 && videoRef.current) {
      videoRef.current!.srcObject = user.stream!;
      videoRef.current!.play();
      audioRef.current!.srcObject = user.audioStream!;
      audioRef.current!.play();
    }
  }, [userNum, videoRef.current, audioRef.current]);

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
                border: "2px solid red",
                borderRadius: "20px",
                boxShadow: "0 0 20px red",
                transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              autoPlay
              playsInline
            />
            <audio ref={audioRef} />
          </MyCameraView>
          {user && start && turn == user.userId && (
            <Board turn={turn} userId={user.userId} />
          )}
        </BoardWrapper>
        <PlayerIdContainer>
          Player: {userNum > 0 ? user.nickname : "Waiting.."}
        </PlayerIdContainer>
      </GameWrapper>
    </>
  );
}

export const MemoizedOtherUserVideoView = memo(OtherUserVideoView);
