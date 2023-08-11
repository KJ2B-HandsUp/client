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
      const indexFingertip = landmarks[8];
      const x = indexFingertip.x * width;
      const y = indexFingertip.y * height;

      const imageWidth = fingerSize[idx] * 3;
      const imageHeight = fingerSize[idx] * 3;
      if (plandImage[idx]) {
        if (plandImage[idx].complete) {
          ctx.drawImage(
            plandImage[idx],
            x - imageWidth / 2,
            y - imageHeight / 2,
            imageWidth,
            imageHeight,
          );
        } else {
          plandImage[idx].onload = () => {
            ctx.drawImage(
              plandImage[idx],
              x - imageWidth / 2,
              y - imageHeight / 2,
              imageWidth,
              imageHeight,
            );
          };
        }
      }
      idx++;
    }
  }
  ctx.restore();
}
