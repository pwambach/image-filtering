import { createContext } from "./lib/webgl";
import { FilterRenderer } from "./lib/renderer";
import { loadImage } from "./lib/load-image";
import { gaussianKernel } from "./kernels/gaussian";
import { boxKernel } from "./kernels/box";
import "./style.styl";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Canvas element not found.");
}

const gl = createContext(canvas, { depth: false });
const renderer = new FilterRenderer(gl);
gl.clearColor(0, 0, 0, 0);

/**
 * Draws the final image as a 4x4 grid with varying filter settings.
 * @param url Image url to load over network
 */
const draw4x4 = async (url: string) => {
  const img = await loadImage(url);
  renderer.updateTexture(img);

  const { width, height } = img;
  canvas.width = width * 2;
  canvas.height = height * 2;

  gl.clear(gl.COLOR_BUFFER_BIT);

  renderer.drawWithKernel([1.0], [0, height, width, height]); // top left
  renderer.drawWithKernel(boxKernel(3), [width, height, width, height]); // top right
  renderer.drawWithKernel(gaussianKernel(3, 1.0), [0, 0, width, height]); // bottom left
  renderer.drawWithKernel(gaussianKernel(5, 1.0), [width, 0, width, height]); // bottom right
};

// Query all image sources
const sources = [...document.querySelectorAll(".list a")] as HTMLElement[];

// Add click listener to image sources
for (const source of sources) {
  source.addEventListener("click", () => draw4x4(source.dataset.url!));
}

// Show first image on page load
draw4x4(sources[0].dataset.url!);
