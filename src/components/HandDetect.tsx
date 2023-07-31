import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";
import { MyCameraView } from "../styled/game.styled";
import Loading from "./Loading";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../types/game.type";

const thresholdDistance = 8;
let ctx: CanvasRenderingContext2D | null = null;

export default function HandDetect() {
  const webcamRef = useRef<Webcam>(null);
  const resultsRef = useRef<Results>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clicked = useRef([false, false]);

  const simulateClick = useCallback((x: number, y: number) => {
    // 좌표를 실제 픽셀 값으로 변환할 수 있습니다. (옵션)
    const element = document.elementFromPoint(625 - x * 500, y * 500);

    // 클릭 이벤트를 생성하고 발생시킵니다.
    if (element) {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      element.dispatchEvent(clickEvent);
    }
  }, []);

  const onResults = useCallback(
    (results: Results) => {
      resultsRef.current = results;

      if (ctx === null) {
        return;
      }

      drawCanvas(ctx, results);

      // If hands detected
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const hand = results.multiHandLandmarks[i];
        const indexFingerTip = hand[8];

        // If there's previous frame data, check the distance
        const depth = indexFingerTip.z * -100;
        if (!clicked.current[i] && depth > thresholdDistance) {
          //console.log(`Hand moved closer more than threshold: ${depth}`);
          //console.log(`x: ${indexFingerTip.x * 500}, y: ${indexFingerTip.y * 500}`);
          simulateClick(indexFingerTip.x, indexFingerTip.y);
          clicked.current[i] = true;
        } else if (clicked && depth <= thresholdDistance) {
          clicked.current[i] = false;
        }
      }
    },
    [simulateClick],
  );

  const startHandDetection = useCallback(async () => {
    if (webcamRef.current != null && webcamRef.current.video != null) {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@latest/${file}`;
        },
      });

      ctx = canvasRef.current!.getContext("2d");

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 0,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.3,
      });
      hands.onResults(onResults);

      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({
            image: webcamRef.current!.video!,
          });
        },
      });

      await camera.start();
    }
  }, [onResults, webcamRef]);

  useEffect(() => {
    startHandDetection();
  }, [startHandDetection]);

  return (
    <MyCameraView>
      <canvas
        ref={canvasRef}
        className="motion-data"
        width={CAMERA_VIEW_WIDTH}
        height={CAMERA_VIEW_HEIGHT}
        style={{
          border: "2px solid",
        }}
      />

      <Webcam
        audio={false}
        ref={webcamRef}
        style={{ visibility: "hidden" }}
        videoConstraints={{ facingMode: "user", width: 500, height: 500 }}
      />
    </MyCameraView>
  );
}
