import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";
import { MyCameraView } from "../styled/game.styled";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";
import { HandType } from "../types/game.type";

let ctx: CanvasRenderingContext2D | null = null;
let rectLeft = 0;
const threshold = 5;

export default function HandDetectionVideo() {
  const webcamRef = useRef<Webcam>(null);
  const resultsRef = useRef<Results>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const myRef = useRef<HTMLDivElement>(null);
  const resizeCanvas = useCallback(() => {
    if (myRef.current) {
      rectLeft = myRef.current.getBoundingClientRect().left;
    }
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * (CAMERA_VIEW_WIDTH / 100);
      canvasRef.current.height =
        window.innerHeight * (CAMERA_VIEW_HEIGHT / 100);
    }
  }, []);

  const simulateClick = useCallback((x: number, y: number) => {
    // 좌표를 실제 픽셀 값으로 변환할 수 있습니다. (옵션)
    const element = document.elementFromPoint(
      canvasRef.current!.width - x * canvasRef.current!.width + rectLeft,
      y * canvasRef.current!.height,
    );

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

  const previousZRef = useRef<Record<HandType, number | null>>({
    left: null,
    right: null,
  });

  const onResults = useCallback(
    (results: Results) => {
      resultsRef.current = results;

      if (ctx === null) {
        return;
      }

      drawCanvas(ctx, results);
      if (
        results.multiHandLandmarks.length == 2 &&
        results.multiHandedness[0].label !== results.multiHandedness[1].label
      ) {
        results.multiHandLandmarks?.forEach((landmarks, index) => {
          const handType = results.multiHandedness?.[
            index
          ]?.label.toLowerCase() as HandType;

          const indexFingerLandmark = landmarks[8];
          if (indexFingerLandmark && "z" in indexFingerLandmark) {
            const zValue = indexFingerLandmark.z * 100;
            if (
              typeof zValue === "number" &&
              previousZRef.current[handType] != null &&
              previousZRef.current[handType]! > -0.01 &&
              zValue < 0
            ) {
              if (previousZRef.current[handType]! - zValue > threshold) {
                simulateClick(indexFingerLandmark.x, indexFingerLandmark.y);
              }
            }

            previousZRef.current[handType] = zValue;
          }
        });
      }
    },
    [simulateClick],
  );

  const startHandDetection = useCallback(async () => {
    if (webcamRef.current != null && "video" in webcamRef.current) {
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
        minTrackingConfidence: 0.7,
      });
      hands.onResults(onResults);

      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: 600,
        height: 800,
      });

      await camera.start();
    }
  }, [onResults, webcamRef]);

  useEffect(() => {
    startHandDetection();
  }, [startHandDetection]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  });

  return (
    <MyCameraView ref={myRef}>
      <canvas
        ref={canvasRef}
        style={{
          top: 0,
          left: 0,
          border: "2px solid",
        }}
      />

      <Webcam
        audio={false}
        ref={webcamRef}
        style={{ visibility: "hidden" }}
        videoConstraints={{
          facingMode: "user",
          width: 600,
          height: 800,
        }}
      />
    </MyCameraView>
  );
}
