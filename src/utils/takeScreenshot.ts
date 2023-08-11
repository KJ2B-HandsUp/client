import html2canvas from "html2canvas";

export const takeScreenshot = async () => {
  const canvas = await html2canvas(document.body);
  return canvas.toDataURL("image/png");
};

export function canvasToImage(canvasElement) {
  const dataUrl = canvasElement.toDataURL();
  const img = new Image();
  img.src = dataUrl;
  canvasElement.parentNode.insertBefore(img, canvasElement);
  canvasElement.style.display = "none";
  html2canvas(document.body).then((canvas) => {
    document.body.appendChild(canvas);
    canvasElement.style.display = "";
    img.remove();
  });
}
