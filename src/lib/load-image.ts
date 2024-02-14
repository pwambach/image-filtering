/**
 * Loads an network image from a given URL.
 * @param url The URL of the image resource
 * @returns The image element in a promise.
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image could not be loaded"));
    img.src = url;
  });
}
