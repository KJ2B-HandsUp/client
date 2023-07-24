import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results, NormalizedLandmarkList } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";
import useInterval from "../hooks/useInterval";
import React from "react";
import { MoveContext } from "../pages/GamePage";
import { Vector } from "../types/types";

const cameraViewHeight = 640;
const cameraViewWidth = 400;

export default function HandDetect() {
  const moveContext = React.useContext(MoveContext);
  const setMoveType = moveContext?.setMoveType;

  const webcamRef = useRef<Webcam>(null);
  const resultsRef = useRef<Results>();
  let prevPose: NormalizedLandmarkList;

  const canvasRef = useRef<HTMLCanvasElement>(null);
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
      maxNumHands: 1,
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
        width: cameraViewWidth,
        height: cameraViewHeight,
      });
      camera.start();
    }
  }, [onResults]);

  useInterval(() => {
    if (resultsRef && resultsRef.current) {
      const results = resultsRef.current.multiHandLandmarks[0];

      const moveType: string = checkMotion(prevPose, results);
      if (setMoveType) {
        setMoveType(moveType);
      }
      prevPose = results;
    }
  }, 50);

  return (
    <div className="hand-detect">
      <canvas
        ref={canvasRef}
        className="motion-data"
        width={cameraViewWidth}
        height={cameraViewHeight}
      />
      <Webcam
        audio={false}
        style={{ visibility: "hidden" }}
        ref={webcamRef}
        videoConstraints={{ facingMode: "user" }}
      />
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
  const fingerX = fingerNum.map((idx) => currentHand[idx].x);
  if (
    Math.abs(
      fingerX.reduce(function add(sum, currValue) {
        return sum + currValue;
      }, 0) /
        fingerNum.length -
        0.5,
    ) > 0.2
  ) {
    return "nothing";
  }

  const fingerY = fingerNum.map((idx) => currentHand[idx].y);
  if (
    Math.abs(
      fingerY.reduce(function add(sum, currValue) {
        return sum + currValue;
      }, 0) /
        fingerNum.length -
        0.5,
    ) > 0.2
  ) {
    return "nothing";
  }

  let totalMoveX = 0;
  let totalMoveY = 0;
  let result = "nothing";
  let totalAngle = 0;

  fingerNum.map((idx) => {
    totalMoveX += currentHand[idx].x - prevHand[idx].x;
    totalMoveY += currentHand[idx].y - prevHand[idx].y;
    totalAngle += calculateAngle(
      {
        x: currentHand[idx].x - currentHand[0].x,
        y: currentHand[idx].y - currentHand[0].y,
      },
      {
        x: prevHand[idx].x - prevHand[0].x,
        y: prevHand[idx].y - prevHand[0].y,
      },
    );
  });

  if (totalMoveX > 0.4) {
    result = "left";
  } else if (totalMoveX < -0.4) {
    result = "right";
  }

  if (totalMoveY > 0.4) {
    result = "down";
  }

  if (totalAngle / fingerNum.length > 30) {
    result = "up";
  }

  //console.log(result);
  return result;
}

function calculateAngle(A: Vector, B: Vector): number {
  const dotProduct: number = A.x * B.x + A.y * B.y;
  const magnitudeA: number = Math.sqrt(A.x * A.x + A.y * A.y);
  const magnitudeB: number = Math.sqrt(B.x * B.x + B.y * B.y);

  const cosTheta: number = dotProduct / (magnitudeA * magnitudeB);

  // acos function returns the angle in radians
  const thetaInRadians: number = Math.acos(cosTheta);

  // convert to degrees if needed
  const thetaInDegrees: number = thetaInRadians * (180 / Math.PI);

  return thetaInDegrees; // or return thetaInDegrees;
}
