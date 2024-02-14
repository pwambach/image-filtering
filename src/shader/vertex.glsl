#version 300 es

in vec2 position;
out vec2 uv;

void main() {
  // Set uv to 0..1
  uv = position * 0.5 + 0.5;
  // position goes from -1..1
  gl_Position = vec4(position, 0.0, 1.0);
}