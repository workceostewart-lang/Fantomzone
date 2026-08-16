const FALLBACK_VERTEX = `attribute vec2 a_position; uniform vec2 u_resolution; void main(){vec2 z=a_position/u_resolution; gl_Position=vec4((z*2.0-1.0)*vec2(1,-1),0,1);}`;
const FALLBACK_FRAGMENT = `precision mediump float; uniform vec4 u_color; void main(){gl_FragColor=u_color;}`;

export class ArenaRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    this.ready = false;
    if (!this.gl) return;
    this.program = this.createProgram(FALLBACK_VERTEX, FALLBACK_FRAGMENT);
    this.positionBuffer = this.gl.createBuffer();
    this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
    this.colorLocation = this.gl.getUniformLocation(this.program, 'u_color');
    this.resize();
    this.ready = true;
    this.loadShaderPack();
  }

  async loadShaderPack() {
    try {
      const source = await fetch('./arena.webgl').then((response) => response.text());
      const vertex = source.split('[fragment]')[0].replace('[vertex]', '').trim();
      const fragment = source.split('[fragment]')[1].trim();
      const next = this.createProgram(vertex, fragment);
      if (next) {
        this.gl.deleteProgram(this.program);
        this.program = next;
        this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.colorLocation = this.gl.getUniformLocation(this.program, 'u_color');
      }
    } catch { /* fallback shader stays active for file:// previews */ }
  }

  createProgram(vertexSource, fragmentSource) {
    const gl = this.gl;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return this.program || null;
    const program = gl.createProgram();
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(this.canvas.clientWidth * dpr);
    const height = Math.floor(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width; this.canvas.height = height;
    }
    if (this.gl) this.gl.viewport(0, 0, width, height);
  }

  rect(x, y, width, height, color) {
    const vertices = [x, y, x + width, y, x, y + height, x, y + height, x + width, y, x + width, y + height];
    this.draw(vertices, color);
  }

  circle(cx, cy, radius, color, segments = 18) {
    const vertices = [];
    for (let i = 0; i < segments; i += 1) {
      const a = (i / segments) * Math.PI * 2; const b = ((i + 1) / segments) * Math.PI * 2;
      vertices.push(cx, cy, cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, cx + Math.cos(b) * radius, cy + Math.sin(b) * radius);
    }
    this.draw(vertices, color);
  }

  line(x1, y1, x2, y2, thickness, color) {
    const dx = x2 - x1; const dy = y2 - y1; const len = Math.hypot(dx, dy) || 1; const ox = -dy / len * thickness / 2; const oy = dx / len * thickness / 2;
    this.draw([x1 + ox, y1 + oy, x2 + ox, y2 + oy, x1 - ox, y1 - oy, x1 - ox, y1 - oy, x2 + ox, y2 + oy, x2 - ox, y2 - oy], color);
  }

  draw(vertices, color) {
    if (!this.ready) return;
    const gl = this.gl;
    gl.useProgram(this.program); gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
    gl.enableVertexAttribArray(this.positionLocation); gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height); gl.uniform4fv(this.colorLocation, color);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
  }

  render(state) {
    if (!this.ready) return;
    this.resize();
    const gl = this.gl; const w = this.canvas.width; const h = this.canvas.height;
    gl.clearColor(0.055, 0.078, 0.118, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    this.rect(0, 0, w, h, [0.055, 0.078, 0.118, 1]);
    this.rect(0, h * 0.48, w, h * 0.52, [0.11, 0.16, 0.19, 1]);
    this.circle(w * 0.78, h * 0.18, h * 0.12, [0.95, 0.64, 0.22, 0.65]);
    this.rect(0, h * 0.58, w, h * 0.025, [0.13, 0.19, 0.22, 1]);
    this.rect(0, h * 0.78, w, h * 0.22, [0.07, 0.12, 0.14, 1]);
    this.rect(w * 0.12, h * 0.67, w * 0.18, h * 0.025, [0.73, 0.36, 0.23, 1]);
    this.rect(w * 0.71, h * 0.62, w * 0.16, h * 0.025, [0.73, 0.36, 0.23, 1]);
    this.drawFighter(w * state.player.x, h * state.player.y, [0.31, 0.59, 0.98, 1], false);
    this.drawFighter(w * state.rival.x, h * state.rival.y, [0.95, 0.35, 0.28, 1], true);
    if (state.projectile) {
      const points = state.projectile.trail || [];
      for (let i = 1; i < points.length; i += 1) this.line(w * points[i - 1].x, h * points[i - 1].y, w * points[i].x, h * points[i].y, Math.max(2, (i / points.length) * 9), [0.98, 0.76, 0.29, (i / points.length) * 0.5]);
      this.circle(w * state.projectile.x, h * state.projectile.y, Math.max(5, w * 0.012), [0.98, 0.82, 0.37, 1]);
      this.line(w * state.projectile.x, h * state.projectile.y, w * (state.projectile.x - state.projectile.vx * 0.025), h * (state.projectile.y - state.projectile.vy * 0.025), 4, [0.98, 0.94, 0.75, 1]);
    }
  }

  drawFighter(x, y, color, facingRight) {
    this.circle(x, y - 54, 25, [0.96, 0.72, 0.49, 1]);
    this.circle(x + (facingRight ? 5 : -5), y - 58, 21, color);
    this.rect(x - 24, y - 30, 48, 64, color);
    this.rect(x - 33, y + 28, 23, 54, [0.13, 0.16, 0.22, 1]); this.rect(x + 10, y + 28, 23, 54, [0.13, 0.16, 0.22, 1]);
    this.line(x + (facingRight ? 26 : -26), y - 15, x + (facingRight ? 64 : -64), y - 49, 5, [0.87, 0.68, 0.36, 1]);
    this.circle(x + (facingRight ? 34 : -34), y - 20, 8, [0.98, 0.82, 0.45, 1]);
  }
}

