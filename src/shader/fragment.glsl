#version 300 es

precision highp float;

uniform sampler2D sampler;
uniform float[25] kernel; // Maximum kernel size is 5
uniform int kernelSize;
uniform vec2 imageSize;

in vec2 uv;
out vec4 fragColor;

void main() {
  vec2 pixelWidth = vec2(1.0) / imageSize;
  vec2 pixelWidthHalf = pixelWidth * 0.5;
  int maxKernelOffset = kernelSize / 2;

  uint kernelIndex = 0u;
  vec4 color = vec4(0.0);

  // Iterate over kernel grid from top left to bottom right
  for(int y = -maxKernelOffset; y <= maxKernelOffset; y++) {
    for(int x = -maxKernelOffset; x <= maxKernelOffset; x++) {
      // Calculate texel offset
      vec2 offset = vec2(x, y) * pixelWidth + pixelWidthHalf;
      vec2 texelCoords = uv + offset;

      // Multiply kernel with texel value and add to final color
      color += kernel[kernelIndex] * texture(sampler, texelCoords);
      kernelIndex++;
    }
  }

  fragColor = color;
}