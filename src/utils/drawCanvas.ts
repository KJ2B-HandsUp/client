let plandImage = [new Image(), new Image()];
plandImage[0].src = "/hand.png";
plandImage[1].src = "/hand_flip.png";

export function drawCanvas(
  ctx: CanvasRenderingContext2D,
  results: Window["Results"],
  fingerSize: number[],
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  ctx.scale(-1, 1);
  ctx.translate(-width, 0);

  ctx.drawImage(results.image, 0, 0, width, height);

  if (results.multiHandLandmarks) {
    let idx = 0;
    for (const landmarks of results.multiHandLandmarks) {
      if ("x" in landmarks && "y" in landmarks) {
        const indexFingertip = landmarks[8];
        ctx.beginPath();
        ctx.arc(
          indexFingertip.x * width,
          indexFingertip.y * height,
          fingerSize[idx],
          0,
          2 * Math.PI,
        );
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      idx++;
    }
  }
  ctx.restore();
}
