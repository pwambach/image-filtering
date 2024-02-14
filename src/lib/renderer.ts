import { compileShader, createProgram } from "./webgl";
import vertexSource from "../shader/vertex.glsl?raw";
import fragmentSource from "../shader/fragment.glsl?raw";

export class FilterRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private texture: WebGLTexture;
  private uKernelLoc: WebGLUniformLocation;
  private uKernelSizeLoc: WebGLUniformLocation;
  private uImageSizeLoc: WebGLUniformLocation;
  private uSamplerLoc: WebGLUniformLocation;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = this.createProgram();
    this.vao = this.createVAO();
    this.texture = this.createTexture();

    // Save uniform locations
    this.uKernelLoc = this.gl.getUniformLocation(this.program, "kernel")!;
    this.uKernelSizeLoc = this.gl.getUniformLocation(
      this.program,
      "kernelSize"
    )!;
    this.uImageSizeLoc = this.gl.getUniformLocation(this.program, "imageSize")!;
    this.uSamplerLoc = this.gl.getUniformLocation(this.program, "sampler")!;
  }

  /**
   * Creates the filtering program.
   * @returns The WebGL program
   */
  private createProgram() {
    const vertexShader = compileShader(
      this.gl,
      vertexSource,
      this.gl.VERTEX_SHADER
    );
    const fragmentShader = compileShader(
      this.gl,
      fragmentSource,
      this.gl.FRAGMENT_SHADER
    );

    return createProgram(this.gl, vertexShader, fragmentShader);
  }

  /**
   * Creates a vertex array object with one positions buffer to render a fullsize quad.
   * @returns The vertex array object
   */
  private createVAO() {
    const vao = this.gl.createVertexArray();

    if (!vao) {
      throw new Error("Could not create vertex array object.");
    }

    this.gl.bindVertexArray(vao);

    // Vertex positions for two 2D triangles forming a quad from -1..1
    // prettier-ignore
    const positions = new Float32Array([
      -1, 1,
      1, 1,
      -1, -1,

      1, 1,
      1, -1,
      -1, -1
    ]);

    const positionsBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionsBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(
      this.program,
      "position"
    );
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(
      positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    return vao;
  }

  /**
   * Create and sets up a texture for the image to filter
   * @returns The WebGL texture
   */
  private createTexture() {
    const texture = this.gl.createTexture();

    if (!texture) {
      throw new Error("Could not create texture.");
    }

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    );

    return texture;
  }

  /**
   * Updates the texture on the GPU from the given image.
   * @param img An image element
   */
  updateTexture(img: HTMLImageElement) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      img
    );
    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.uImageSizeLoc, img.width, img.height);
  }

  /**
   * Draws the uploaded texture with the applied filter kernel into a specified viewport.
   * @param kernel A array of kernel values
   * @param viewport The values for gl.viewport (x, y, width, height)
   */
  drawWithKernel(
    kernel: number[],
    viewport: [x: number, y: number, width: number, height: number]
  ) {
    this.gl.useProgram(this.program);
    this.gl.uniform1i(this.uSamplerLoc, 0);
    this.gl.uniform1fv(this.uKernelLoc, kernel);
    this.gl.uniform1i(this.uKernelSizeLoc, Math.sqrt(kernel.length));
    this.gl.viewport(...viewport);
    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
