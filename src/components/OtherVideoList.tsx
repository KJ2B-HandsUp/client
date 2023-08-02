import React, { useState, useEffect, memo } from "react";
import { UserType } from "../types/game.type";
import { Board } from "../components/Board";
import {
  GameContainer,
  MyCameraView,
  CAMERA_VIEW_WIDTH,
  CAMERA_VIEW_HEIGHT,
} from "../styled/game.styled";

function OtherVideoList({
  turn,
  users,
  userNum,
}: {
  turn: number;
  users: UserType[];
  userNum: number;
}) {
  const [videoRefs, setVideoRefs] = useState<
    Record<string, React.RefObject<HTMLVideoElement>>
  >({});

  // 유저 정보가 변경될 때마다 video ref를 업데이트
  useEffect(() => {
    const newVideoRefs: Record<string, React.RefObject<HTMLVideoElement>> = {};
    users.forEach((user) => {
      if (user.stream !== null) {
        newVideoRefs[user.id] = React.createRef<HTMLVideoElement>();
      }
    });
    setVideoRefs(newVideoRefs);
  }, [users, userNum]);

  // 비디오 ref에 스트림을 할당
  useEffect(() => {
    users.forEach((user) => {
      const videoRef = videoRefs[user.id];
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
        <GameContainer key={idx}>
          <MyCameraView key={idx}>
            <video
              key={idx}
              ref={videoRefs[user.id]}
              style={{
                width: CAMERA_VIEW_WIDTH,
                height: CAMERA_VIEW_HEIGHT,
                border: "2px solid",
                transform: "scaleX(-1)",
              }}
            />
          </MyCameraView>
          {turn == user.id && (
            <Board turn={turn} id={user.id} row={4} column={4} />
          )}
          <h2>Player ID: ${user.id}</h2>
          {turn == user.id && <h3>Your Turn!</h3>}
        </GameContainer>
      ))}
    </>
  );
}

export default memo(OtherVideoList);
