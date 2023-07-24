import React, { useEffect } from "react";
import GamePage from "../pages/GamePage";

export default function Room() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && videoRef.current.srcObject === null) {
      navigator.mediaDevices
        .getDisplayMedia({ audio: false, video: { width: 500, height: 500 } })
        .then((stream) => {
          console.log(videoRef.current!.srcObject);
          videoRef.current!.srcObject = stream;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, []);

  return (
    <>
      <GamePage />
      <video ref={videoRef} autoPlay />
    </>
  );
}
