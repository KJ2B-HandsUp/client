import html2canvas from "html2canvas";

export const takeScreenshot = async () => {
  const canvas = await html2canvas(document.body);
  return canvas.toDataURL("image/png");
};
