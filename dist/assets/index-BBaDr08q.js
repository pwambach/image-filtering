var E=Object.defineProperty;var x=(t,e,r)=>e in t?E(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var a=(t,e,r)=>(x(t,typeof e!="symbol"?e+"":e,r),r);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();function T(t,e){const r=t.getContext("webgl2",e);if(!r)throw new Error("Could not create WebGL context.");return r}function g(t,e,r){if(!(r===t.VERTEX_SHADER||r===t.FRAGMENT_SHADER))throw new Error("Invalid shader type.");const o=t.createShader(r);if(!o)throw new Error("Could not create shader.");if(t.shaderSource(o,e),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS)){const i=t.getShaderInfoLog(o);throw new Error("Could not compile shader: "+i)}return o}function v(t,e,r){const o=t.createProgram();if(!o)throw new Error("Could not create program.");if(t.attachShader(o,e),t.attachShader(o,r),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS)){const i=t.getProgramInfoLog(o);throw new Error("Could not link program: "+i)}return o}const S=`#version 300 es

in vec2 position;
out vec2 uv;

void main() {
  // Set uv to 0..1
  uv = position * 0.5 + 0.5;
  // position goes from -1..1
  gl_Position = vec4(position, 0.0, 1.0);
}`,A=`#version 300 es

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
}`;class R{constructor(e){a(this,"gl");a(this,"program");a(this,"vao");a(this,"texture");a(this,"uKernelLoc");a(this,"uKernelSizeLoc");a(this,"uResolutionLoc");a(this,"uSamplerLoc");this.gl=e,this.program=this.createProgram(),this.vao=this.createVAO(),this.texture=this.createTexture(),this.uKernelLoc=this.gl.getUniformLocation(this.program,"kernel"),this.uKernelSizeLoc=this.gl.getUniformLocation(this.program,"kernelSize"),this.uResolutionLoc=this.gl.getUniformLocation(this.program,"imageSize"),this.uSamplerLoc=this.gl.getUniformLocation(this.program,"sampler")}createProgram(){const e=g(this.gl,S,this.gl.VERTEX_SHADER),r=g(this.gl,A,this.gl.FRAGMENT_SHADER);return v(this.gl,e,r)}createVAO(){const e=this.gl.createVertexArray();if(!e)throw new Error("Could not create vertex array object.");this.gl.bindVertexArray(e);const r=new Float32Array([-1,1,1,1,-1,-1,1,1,1,-1,-1,-1]),o=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,o),this.gl.bufferData(this.gl.ARRAY_BUFFER,r,this.gl.STATIC_DRAW);const n=this.gl.getAttribLocation(this.program,"position");return this.gl.enableVertexAttribArray(n),this.gl.vertexAttribPointer(n,2,this.gl.FLOAT,!1,0,0),e}createTexture(){const e=this.gl.createTexture();if(!e)throw new Error("Could not create texture.");return this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,e),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),e}updateTexture(e){this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture),this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!0),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,e),this.gl.useProgram(this.program),this.gl.uniform2f(this.uResolutionLoc,e.width,e.height)}drawWithKernel(e,r){this.gl.useProgram(this.program),this.gl.uniform1i(this.uSamplerLoc,0),this.gl.uniform1fv(this.uKernelLoc,e),this.gl.uniform1i(this.uKernelSizeLoc,Math.sqrt(e.length)),this.gl.viewport(...r),this.gl.bindVertexArray(this.vao),this.gl.drawArrays(this.gl.TRIANGLES,0,6)}}function w(t){return new Promise((e,r)=>{const o=new Image;o.crossOrigin="anonymous",o.onload=()=>e(o),o.onerror=()=>r(new Error("Image could not be loaded")),o.src=t})}function f(t,e){const r=Array.from({length:t**2}),o=Math.floor(t/2);let n=0;const i=2*e**2;for(let s=0;s<t;s++)for(let l=0;l<t;l++){const p=(l-o)**2+(s-o)**2;r[s*t+l]=Math.exp(-p/i),n+=r[s*t+l]}for(let s=0;s<t;s++)for(let l=0;l<t;l++)r[s*t+l]*=1/n;return r}function L(t){const e=t**2;return Array.from({length:e}).fill(1/e)}const h=document.querySelector("canvas");if(!h)throw new Error("Canvas element not found.");const u=T(h,{depth:!1}),c=new R(u);u.clearColor(0,0,0,0);const d=async t=>{const e=await w(t);c.updateTexture(e);const{width:r,height:o}=e;h.width=r*2,h.height=o*2,u.clear(u.COLOR_BUFFER_BIT),c.drawWithKernel([1],[0,o,r,o]),c.drawWithKernel(L(3),[r,o,r,o]),c.drawWithKernel(f(3,1),[0,0,r,o]),c.drawWithKernel(f(5,1),[r,0,r,o])},m=[...document.querySelectorAll(".list a")];for(const t of m)t.addEventListener("click",()=>d(t.dataset.url));d(m[0].dataset.url);
