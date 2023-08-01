import React, { useState, useEffect, memo } from "react";
import { UserType } from "../types/game.type";
import { Board } from "../components/Board";
import { GameContainer, MyCameraView } from "../styled/game.styled";

function OtherVideoList({
  turn,
  users,
  userNum,
}: {
  turn: number;
  users: UserType[];
  userNum: number;
}) {
  console.log(users);
  console.log(userNum);
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
                width: "30rem",
                height: "30rem",
                border: "2px solid",
                zIndex: 100,
                transform: "scaleX(-1)",
              }}
            />
          </MyCameraView>
          {turn == user.id && (
            <Board turn={turn} id={user.id} row={4} column={4} />
          )}
        </GameContainer>
      ))}
    </>
  );
}

export default memo(OtherVideoList);
