/**
 * Creates kernel values for a gaussian filter.
 * @param size The size (width) of the filter kernel.
 * @param sigma The standard deviation of the gaussian distribution.
 * @returns A linear array of kernel values of a size x size grid.
 */
export function gaussianKernel(size: number, sigma: number): number[] {
  const kernel: number[] = Array.from({ length: size ** 2 });
  const radius = Math.floor(size / 2);

  let sum = 0;
  const divisor = 2 * sigma ** 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dividend = (x - radius) ** 2 + (y - radius) ** 2;
      kernel[y * size + x] = Math.exp(-dividend / divisor);

      sum += kernel[y * size + x];
    }
  }

  // Normalize values so that sum of all values = 1;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      kernel[y * size + x] *= 1 / sum;
    }
  }

  return kernel;
}
