import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";
import { MyCameraView } from "../styled/game.styled";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";

const MAX_DISTANCE = 30;
let ctx: CanvasRenderingContext2D | null = null;
const wasFingersTogether = [false, false];
let rectLeft = 0;

export default function HandDetect() {
  const webcamRef = useRef<Webcam>(null);
  const resultsRef = useRef<Results>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const myRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (myRef.current) {
      rectLeft = myRef.current.getBoundingClientRect().left;
      console.log("rectLeft: ", rectLeft);
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth * 0.5;
      canvasRef.current.height = window.innerHeight * 0.85;
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

  // 현재 상태를 나타내는 변수

  const onResults = useCallback(
    (results: Results) => {
      resultsRef.current = results;

      if (ctx === null) {
        return;
      }

      drawCanvas(ctx, results);

      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const handLandmarks = results.multiHandLandmarks[i];
        const fingerTips = [
          handLandmarks[4], // 엄지 손가락 끝
          handLandmarks[8], // 검지 손가락 끝
          handLandmarks[12], // 중지 손가락 끝
          handLandmarks[16], // 약지 손가락 끝
          handLandmarks[20], // 새끼 손가락 끝
        ];

        const averagePoint = fingerTips.reduce(
          (acc, curr) => {
            acc.x += curr.x;
            acc.y += curr.y;
            return acc;
          },
          { x: 0, y: 0 },
        );
        let distance;
        averagePoint.x /= 5;
        averagePoint.y /= 5;
        let isFingersTogether = true;
        for (const fingerTip of fingerTips) {
          distance =
            Math.sqrt(
              Math.pow(fingerTip.x - averagePoint.x, 2) +
                Math.pow(fingerTip.y - averagePoint.y, 2),
            ) * 1000;

          if (distance > MAX_DISTANCE) {
            isFingersTogether = false;
            break;
          }
        }

        if (isFingersTogether && !wasFingersTogether[i]) {
          //console.log("All fingers are together", distance);
          simulateClick(averagePoint.x, averagePoint.y);
        } else if (!isFingersTogether && wasFingersTogether[i]) {
          console.log("Fingers are apart");
        }

        wasFingersTogether[i] = isFingersTogether; // 현재 상태를 추적
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
        minTrackingConfidence: 0.5,
      });
      hands.onResults(onResults);

      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: 600,
        height: 600,
      });

      await camera.start();
    }
  }, [onResults, webcamRef]);

  useEffect(() => {
    startHandDetection();
  }, [startHandDetection]);

  useEffect(() => {
    resizeCanvas();

    // 창 크기가 변경될 때마다 크기 조정
    window.addEventListener("resize", resizeCanvas);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
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
