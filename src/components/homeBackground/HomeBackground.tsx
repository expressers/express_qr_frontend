import { useEffect, useRef } from "react";

/**
 * Own WebGL2 background: slow, soft "water" waves in greys only.
 * No dependencies, no network. The palette comes from the CSS tokens of the static
 * backdrop (--bd-a highlight, --bd-b shadow, --bd-c mid, --background) and is re-read
 * whenever the `.dark` class on <html> flips.
 */

const MAX_DPR = 1.5;
// Waves are low-frequency: rendering below native resolution is invisible and ~3x cheaper.
const RENDER_SCALE = 0.6;
const FRAME_MS = 1000 / 30;
const SPEED = 0.1;

const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uHi;
uniform vec3 uLo;
uniform vec3 uMid;
out vec4 o;

float hash(vec2 q){ return fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453); }

float field(vec2 q, float t){
  for (int i = 0; i < 3; i++) {
    float f = float(i);
    q += 0.45 * vec2(sin(q.y * 1.6 + t * (1.0 + 0.3 * f) + f * 1.7),
                     sin(q.x * 1.9 - t * 0.8 + f * 2.3));
    q = mat2(0.8, -0.6, 0.6, 0.8) * q;
  }
  return 0.5 + 0.5 * sin(q.x * 1.7 + q.y * 0.9 + t);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime;
  float h = field(uv * 1.3, t);
  // Soft sheen from the height gradient (screen-space derivatives).
  vec3 n = normalize(vec3(-dFdx(h) * 90.0, -dFdy(h) * 90.0, 1.0));
  float sheen = pow(clamp(dot(n, normalize(vec3(-0.4, 0.6, 0.7))), 0.0, 1.0), 6.0);
  vec3 col = mix(uLo, uMid, smoothstep(0.05, 0.55, h));
  col = mix(col, uHi, smoothstep(0.45, 1.0, h) * 0.85);
  col = mix(col, uHi, sheen * 0.35);
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0; // dither: no banding on flat greys
  o = vec4(col, 1.0);
}`;

type RGB = [number, number, number];

const FALLBACK = {
  light: { hi: [1, 1, 1], lo: [0.83, 0.83, 0.83], mid: [0.9, 0.9, 0.9] },
  dark: { hi: [0.23, 0.23, 0.23], lo: [0.11, 0.11, 0.11], mid: [0.08, 0.08, 0.08] },
} as const;

function toRgb(ctx: CanvasRenderingContext2D | null, value: string, fallback: RGB): RGB {
  const v = value.trim();
  if (!ctx || !v) return fallback;
  ctx.fillStyle = "#010203";
  ctx.fillStyle = v;
  const s = String(ctx.fillStyle);
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(s);
  if (!m || s === "#010203") return fallback;
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function HomeBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A fresh canvas per mount: a canvas whose context was lost on cleanup cannot be reused
    // (React StrictMode re-runs effects in dev).
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";
    host.appendChild(canvas);
    const dispose = () => canvas.remove();
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return dispose;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return dispose;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return dispose;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uHi = gl.getUniformLocation(prog, "uHi");
    const uLo = gl.getUniformLocation(prog, "uLo");
    const uMid = gl.getUniformLocation(prog, "uMid");

    const probe = document.createElement("canvas").getContext("2d");
    const readPalette = () => {
      const root = document.documentElement;
      const dark = root.classList.contains("dark");
      const fb = dark ? FALLBACK.dark : FALLBACK.light;
      const src = host.parentElement?.querySelector(".static-backdrop") ?? root;
      const cs = getComputedStyle(src);
      gl.uniform3fv(uHi, toRgb(probe, cs.getPropertyValue("--bd-a"), [...fb.hi]));
      gl.uniform3fv(uLo, toRgb(probe, cs.getPropertyValue("--bd-b"), [...fb.lo]));
      gl.uniform3fv(uMid, toRgb(probe, cs.getPropertyValue("--bd-c"), [...fb.mid]));
    };
    readPalette();

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * RENDER_SCALE;
      const nw = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const nh = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();

    let time = 0;
    let last = 0;
    let raf = 0;
    let inView = true;
    let lost = false;

    const draw = () => {
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = now - last;
      if (dt < FRAME_MS) return;
      last = now;
      time += Math.min(dt, 100) * 0.001 * SPEED * 6; // clamp: resume never jumps
      draw();
    };
    const sync = () => {
      const run = inView && !lost && document.visibilityState === "visible";
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) draw();
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readPalette();
      if (!raf) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      sync();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", sync);

    draw();
    sync();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", sync);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      dispose();
    };
  }, []);

  return (
    <div className="backdrop-webgl" ref={hostRef} />
  );
}
