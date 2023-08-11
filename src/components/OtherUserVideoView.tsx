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

  useEffect(() => {
    if (userNum > 0 && videoRef.current) {
      videoRef.current!.srcObject = users[0].stream!;
      videoRef.current!.play();
      audioRef.current!.srcObject = users[0].audioStream!;
      audioRef.current!.play();
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
                borderRadius: "20px",
                boxShadow: "0 0 20px red",
                borderColor: "red",
                transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              autoPlay
              playsInline
            />
            <audio ref={audioRef} />
          </MyCameraView>
          {users[0] && start && turn == users[0].userId && (
            <Board
              turn={turn}
              userId={users[0].userId}
              row={ROW_LENGTH}
              column={COL_LENGTH}
            />
          )}
        </BoardWrapper>
        <PlayerIdContainer>
          Player ID: {userNum > 0 ? users[0].userId : "대기 중.."}
        </PlayerIdContainer>
      </GameWrapper>
    </>
  );
}

export const MemoizedOtherUserVideoView = memo(OtherUserVideoView);
