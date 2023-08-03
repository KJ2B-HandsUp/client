import { useCallback, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results } from "@mediapipe/hands";
import { drawCanvas } from "../utils/drawCanvas";
import { MyCameraView } from "../styled/game.styled";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";

let ctx: CanvasRenderingContext2D | null = null;
let rectLeft = 0;
const threshold = 0.035;
type HandType = "left" | "right";

export default function HandDetect() {
  const webcamRef = useRef<Webcam>(null);
  const resultsRef = useRef<Results>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const myRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (myRef.current) {
      rectLeft = myRef.current.getBoundingClientRect().left;
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

          // 가정: 검지 손가락은 랜드마크 배열의 인덱스 8에 해당함
          const indexFingerLandmark = landmarks[8];
          const zValue = indexFingerLandmark.z;

          if (
            typeof zValue === "number" &&
            previousZRef.current[handType] !== null
          ) {
            if (threshold < previousZRef.current[handType]! - zValue) {
              // console.log(
              //   `Index finger coordinates: x=${indexFingerLandmark.x}, y=${indexFingerLandmark.y}, z=${zValue}`,
              // );
              // console.log("prev zValue: ", previousZRef.current[handType]!);
              simulateClick(indexFingerLandmark.x, indexFingerLandmark.y);
            }
          }

          previousZRef.current[handType] = zValue;
        });
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
