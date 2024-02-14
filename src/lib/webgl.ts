/**
 * Creates a WebGL2 context for a canvas element.
 * @param canvas The canvas element
 * @returns The WebGL2 context
 */
export function createContext(
  canvas: HTMLCanvasElement,
  options: WebGLContextAttributes
) {
  const gl = canvas.getContext("webgl2", options);

  if (!gl) {
    throw new Error("Could not create WebGL context.");
  }

  return gl;
}

/**
 * Compiles a shader program.
 * @param gl The WebGL2 context
 * @param shaderSource The source of the shader program
 * @param shaderType The type of the shader, either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @returns The compiled shader.
 */
export function compileShader(
  gl: WebGL2RenderingContext,
  shaderSource: string,
  shaderType: typeof gl.VERTEX_SHADER | typeof gl.FRAGMENT_SHADER
) {
  const shader = gl.createShader(shaderType);

  if (!shader) {
    throw new Error("Could not create shader.");
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!success) {
    const info = gl.getShaderInfoLog(shader);
    throw new Error("Could not compile shader: " + info);
  }

  return shader;
}

/**
 * @param gl The WebGL2 context
 * @param vertexShader The compiled vertex shader
 * @param fragmentShader The compiled fragment shader
 * @returns The linked program
 */
export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Could not create program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    const info = gl.getProgramInfoLog(program);
    throw new Error("Could not link program: " + info);
  }

  return program;
}
