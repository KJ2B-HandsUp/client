export const drawCanvas = (
  ctx: CanvasRenderingContext2D,
  results: Window["Results"],
) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  ctx.scale(-1, 1);
  ctx.translate(-width, 0);

  ctx.drawImage(results.image, 0, 0, width, height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
        color: "#ffffff",
        lineWidth: 10,
      });
      window.drawLandmarks(ctx, landmarks, {
        color: "#ffffff",
        lineWidth: 5,
        radius: 5,
      });
    }
  }
  ctx.restore();
};
