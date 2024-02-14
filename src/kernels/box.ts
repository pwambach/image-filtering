/**
 * Creates kernel values for a box/mean filter.
 * @param size The size (width) of the filter kernel
 * @returns A linear array of kernel values of a size x size grid
 */
export function boxKernel(size: number): number[] {
  const length = size ** 2;
  return Array.from({ length }).fill(1 / length) as number[];
}
