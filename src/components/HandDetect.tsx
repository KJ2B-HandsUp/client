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
  let prevRightPose: NormalizedLandmarkList;
  let prevLeftPose: NormalizedLandmarkList;

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
        width: cameraViewWidth,
        height: cameraViewHeight,
      });
      camera.start();
    }
  }, [onResults]);

  useInterval(() => {
    if (
      resultsRef &&
      resultsRef.current &&
      resultsRef.current.multiHandedness.length == 2
    ) {
      const rightResults = resultsRef.current.multiHandLandmarks[1];
      const leftResults = resultsRef.current.multiHandLandmarks[0];
      let moveType = "nothing";

      if (resultsRef.current.multiHandedness[0].label === "Right") {
        moveType = checkRightMotion(prevLeftPose, leftResults);
        if (setMoveType && moveType !== "nothing") {
          setMoveType(moveType);
        }
        prevLeftPose = leftResults;
      }
      if (
        moveType === "nothing" &&
        resultsRef.current.multiHandedness[1].label === "Left"
      ) {
        moveType = checkLeftMotion(prevRightPose, rightResults);
        if (setMoveType && moveType !== "nothing") {
          setMoveType(moveType);
        }
        prevRightPose = rightResults;
      }
    }
  }, 20);

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

function calculateAngle(A: Vector, B: Vector): number {
  const dotProduct: number = A.x * B.x + A.y * B.y;
  const magnitudeA: number = Math.sqrt(A.x * A.x + A.y * A.y);
  const magnitudeB: number = Math.sqrt(B.x * B.x + B.y * B.y);

  const cosTheta: number = dotProduct / (magnitudeA * magnitudeB);
  const thetaInRadians: number = Math.acos(cosTheta);
  const thetaInDegrees: number = thetaInRadians * (180 / Math.PI);

  return thetaInDegrees;
}

function checkRightMotion(
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

  if (totalMoveX < -0.3) {
    result = "right";
    return result;
  }

  if (totalMoveY > 0.4) {
    result = "down";
    return result;
  }

  if (totalAngle / fingerNum.length > 30) {
    result = "up";
  }
  //console.log(result);
  return result;
}

function checkLeftMotion(
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

  if (totalMoveX > 0.3) {
    result = "left";
    return result;
  }
  if (totalMoveY > 0.4) {
    result = "down";
    return result;
  }

  if (totalAngle / fingerNum.length > 30) {
    result = "up";
  }
  //console.log(result);
  return result;
}
