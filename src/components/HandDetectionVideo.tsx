import { useCallback, useEffect, useRef, useContext } from "react";
import Webcam from "react-webcam";
import { drawCanvas } from "../utils/drawCanvas";
import { MyCameraView } from "../styled/game.styled";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";
import { HandType } from "../types/game.type";
import { GameContext } from "../pages/GamePage";

let ctx: CanvasRenderingContext2D | null = null;
let rectLeft = 0;
let rectTop = 0;
const threshold = 5;

export default function HandDetectionVideo() {
  const { start } = useContext(GameContext);

  const webcamRef = useRef<Webcam>(null);
  const resultsRef = useRef<Window["Results"]>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const myRef = useRef<HTMLDivElement>(null);
  const resizeCanvas = useCallback(() => {
    if (myRef.current) {
      rectLeft = myRef.current.getBoundingClientRect().left;
      rectTop = myRef.current.getBoundingClientRect().top;
      console.log("myRef.current exists ", rectLeft, rectTop);
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
      (1 - x) * canvasRef.current!.width + rectLeft,
      y * canvasRef.current!.height + rectTop,
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

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    const resizeEvent = new Event("resize", {
      bubbles: true,
      cancelable: false,
    });

    window.dispatchEvent(resizeEvent);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    resizeCanvas();
  }, [start]);

  const onResults = useCallback(
    (results: Window["Results"]) => {
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
      const hands = new window.Hands({
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

      const camera = new window.Camera(webcamRef.current.video!, {
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

  return (
    <MyCameraView ref={myRef}>
      <canvas
        ref={canvasRef}
        style={{
          top: 0,
          left: 0,
          width: `${CAMERA_VIEW_WIDTH}vw`,
          height: `${CAMERA_VIEW_HEIGHT}vh`,
          border: "5px solid #ffffff",
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
