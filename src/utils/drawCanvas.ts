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
  try {
    if (results.multiHandLandmarks) {
      let idx = 0;
      for (const landmarks of results.multiHandLandmarks) {
        const indexFingertip = landmarks[8];
        if (
          indexFingertip !== undefined &&
          "x" in indexFingertip &&
          "y" in indexFingertip
        ) {
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
  } catch (err) {
    console.log(err);
  }
}
