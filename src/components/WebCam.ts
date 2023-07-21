import { useRef, useCallback } from "react";

export default function WebCam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getUserCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return { videoRef, getUserCamera };
}
