import html2canvas from "html2canvas";

export const takeScreenshot = async () => {
  const canvas = await html2canvas(document.body, {
    ignoreElements: (el) => el.classList.contains("no-capture"),
  });
  return canvas.toDataURL("image/png");
};
