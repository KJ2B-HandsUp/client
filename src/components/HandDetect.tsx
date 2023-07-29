import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";
import { MyCameraView } from "../styled/game.styled";
import Loading from "./Loading";

const thresholdDistance = 14;
const cameraViewWidth = 800;
const cameraViewHeight = 600;

export default function HandDetect() {
  const webcamRef = useRef<Webcam>(null);
  const resultsRef = useRef<Results>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingState, setLoadingState] = useState(false);

  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;

    const canvasCtx = canvasRef.current!.getContext("2d");
    if (canvasCtx) {
      drawCanvas(canvasCtx, results);
    }

    // If hands detected
    if (results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      const indexFingerTip = hand[8];

      // If there's previous frame data, check the distance
      const depth = indexFingerTip.z * -100;
      if (depth > thresholdDistance) {
        console.log(`Hand moved closer more than threshold: ${depth}`);
        //console.log(`x: ${indexFingerTip.x}, y: ${indexFingerTip.y}`);
      }
    }
  }, []);

  const startHandDetection = useCallback(async () => {
    if (webcamRef.current != null && webcamRef.current.video != null) {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });
      hands.onResults(onResults);

      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({
            image: webcamRef.current!.video!,
          });
        },
        width: cameraViewWidth,
        height: cameraViewHeight,
      });

      await camera.start();
      setLoadingState(true);
    }
  }, [onResults, webcamRef]);

  useEffect(() => {
    startHandDetection();
  }, [startHandDetection]);

  return (
    <MyCameraView>
      {loadingState ? (
        <canvas
          ref={canvasRef}
          className="motion-data"
          width={cameraViewWidth}
          height={cameraViewHeight}
        />
      ) : (
        <Loading />
      )}

      <Webcam
        audio={false}
        style={{ visibility: "hidden" }}
        ref={webcamRef}
        videoConstraints={{ facingMode: "user" }}
      />
    </MyCameraView>
  );
}
