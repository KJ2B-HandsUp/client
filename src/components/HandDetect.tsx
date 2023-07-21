import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results, NormalizedLandmarkList } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";
import useInterval from "../hooks/useInterval";
import React from "react";
import { MoveContext } from "../pages/GamePage";

export default function HandDetect() {
  const moveContext = React.useContext(MoveContext);
  const moveType = moveContext?.moveType;
  const setMoveType = moveContext?.setMoveType;

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<Results>();
  let prevPose: NormalizedLandmarkList;

  /**
   * @param results
   */
  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;

    const canvasCtx = canvasRef.current!.getContext("2d")!;
    drawCanvas(canvasCtx, results);
  }, []);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, [onResults]);

  const OutputData = () => {
    const results = resultsRef.current!;
    console.log(results.multiHandLandmarks[0][4]);
    console.log(results.multiHandedness[0]);
  };

  useInterval(() => {
    if (resultsRef && resultsRef.current) {
      const results = resultsRef.current.multiHandLandmarks[0];

      const moveType: string = checkMotion(prevPose, results);
      if (setMoveType) {
        setMoveType(moveType);
      }
      prevPose = results;
    }
  }, 200);

  return (
    <div className="hand-detect">
      <canvas
        ref={canvasRef}
        className="motion-data"
        width={500}
        height={700}
      />
      <Webcam
        audio={false}
        style={{ visibility: "hidden" }}
        width={500}
        height={700}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 500, height: 500, facingMode: "user" }}
      />

      <button className="detect-btn" onClick={OutputData}>
        Output Data
      </button>
    </div>
  );
}

function checkMotion(
  prevHand: NormalizedLandmarkList,
  currentHand: NormalizedLandmarkList,
): string {
  if (!(currentHand && prevHand)) {
    return "nothing";
  }

  const fingerNum = [4, 8, 12, 16, 20];
  let totalMoveX = 0;
  let totalMoveY = 0;
  let result = "nothing";

  fingerNum.map((idx) => {
    totalMoveX += currentHand[idx].x - prevHand[idx].x;
    totalMoveY += currentHand[idx].y - prevHand[idx].y;
  });

  if (totalMoveX > 0.2) {
    result = "left";
  } else if (totalMoveX < -0.2) {
    result = "right";
  }

  if (totalMoveY > 0.2) {
    result = "down";
  } else if (totalMoveY < -0.2) {
    result = "up";
  }

  console.log(result);
  return result;
}
