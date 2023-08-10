export function updateCanvasImage(canvasElement) {
  const dataUrl = canvasElement.toDataURL();

  let img = canvasElement.nextSibling;
  if (!img || img.tagName !== "IMG") {
    img = new Image();
    canvasElement.parentNode.insertBefore(img, canvasElement.nextSibling);
  }

  img.src = dataUrl;
  img.style.position = "absolute";
  img.style.left = canvasElement.offsetLeft + "px";
  img.style.top = canvasElement.offsetTop + "px";
  img.style.width = canvasElement.offsetWidth + "px";
  img.style.height = canvasElement.offsetHeight + "px";

  canvasElement.style.visibility = "hidden";
}

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
      idx++;
    }
  }
  ctx.restore();
}
