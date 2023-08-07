import {
  useState,
  useEffect,
  memo,
  useContext,
  RefObject,
  createRef,
} from "react";
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

function OtherUsersVideoView({
  turn,
  users,
  userNum,
}: {
  turn: number;
  users: UserType[];
  userNum: number;
}) {
  const { start } = useContext(GameContext);
  const [videoRefs, setVideoRefs] = useState<
    Record<string, RefObject<HTMLVideoElement>>
  >({});
  console.log(users, userNum);
  // 유저 정보가 변경될 때마다 video ref를 업데이트
  useEffect(() => {
    const newVideoRefs: Record<string, RefObject<HTMLVideoElement>> = {};
    users.forEach((user) => {
      if (user.stream !== null) {
        newVideoRefs[user.userId] = createRef<HTMLVideoElement>();
      }
    });
    setVideoRefs(newVideoRefs);
  }, [users, userNum]);

  // 비디오 ref에 스트림을 할당
  useEffect(() => {
    users.forEach((user) => {
      const videoRef = videoRefs[user.userId];
      if (videoRef && videoRef.current) {
        videoRef.current.srcObject = user.stream || null;
        videoRef.current.play();
      }
    });
  }, [users, videoRefs]);

  // 각 유저에 대한 비디오 요소 렌더링
  return (
    <>
      {users.map((user, idx) => (
        <GameWrapper key={idx}>
          <BoardWrapper>
            <MyCameraView key={idx}>
              <video
                key={idx}
                ref={videoRefs[user.userId]}
                style={{
                  position: "absolute",
                  transform: "scaleX(-1)",
                  width: `${CAMERA_VIEW_WIDTH}vw`,
                  height: `${CAMERA_VIEW_HEIGHT}vh`,
                  border: "5px solid #ffffff",
                }}
              />
            </MyCameraView>
            {((start && turn == user.userId) || turn == -1) && (
              <Board turn={turn} userId={user.userId} row={3} column={4} />
            )}
          </BoardWrapper>
          <PlayerIdContainer>Player ID: {user.userId}</PlayerIdContainer>
          {start && turn == user.userId && (
            <h2 style={{ color: "white" }}>Your Turn!</h2>
          )}
        </GameWrapper>
      ))}
    </>
  );
}

export const MemoizedOtherUsersVideoView = memo(OtherUsersVideoView);
