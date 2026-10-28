// AYLA · hero.js — the Gyroscope. Four glass rings spin out of sync on their own axes,
// light races around them, and scrolling locks them into one aligned system.
// 'full' mode: real glass (transmission). 'lite' mode: polished dark chrome for phones and low power.
import * as THREE from '../vendor/three.module.min.js';

const TAU = Math.PI * 2;

function envTexture(renderer, RED) {
  // A small studio built from emissive panels: soft white key, white strips, red strip, dim fill.
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x050404);
  const panel = (w, h, color, k, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).clone().multiplyScalar(k), side: THREE.DoubleSide, toneMapped: false }));
    m.position.set(...pos); m.rotation.set(...rot); s.add(m);
  };
  panel(10, 3, '#ffffff', 7.0, [0, 6, 2], [Math.PI / 2, 0, 0]);       // overhead softbox
  panel(0.6, 9, '#ffffff', 12.0, [-6, 0, 1], [0, Math.PI / 2, 0]);    // left strip
  panel(6, 0.35, '#ffffff', 9.0, [1, 3.5, -5], [0.4, 0, 0]);          // back rim strip
  panel(0.7, 9, RED, 6.0, [6, 0.5, -1], [0, -Math.PI / 2, 0]);  // red strip, right
  panel(8, 2, RED, 0.7, [0, -5, -2], [-Math.PI / 2, 0, 0]);     // warm floor bounce
  panel(12, 6, '#d8d4d0', 0.25, [0, 0, -7], [0, 0, 0]);               // dim back
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.035).texture;
  pm.dispose();
  return tex;
}

function backdrop(RED) {
  const mat = new THREE.ShaderMaterial({
    depthWrite: false,
    uniforms: { uT: { value: 0 }, uA: { value: 0 }, uAspect: { value: 1.7 }, uBoost: { value: 0 }, uFlash: { value: 0 }, uAcc: { value: new THREE.Vector3(RED.r, RED.g, RED.b) } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float uT; uniform float uA; uniform float uAspect; uniform float uBoost; uniform float uFlash; uniform vec3 uAcc;
      float hash(float n){ return fract(sin(n)*43758.5453); }
      vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }
      void main(){
        vec2 p = vUv - 0.5; p.x *= uAspect;
        vec3 col = lin(vec3(0.039,0.035,0.035));
        vec2 g = vec2(mix(0.42, 0.0, uA) + 0.06*sin(uT*0.11), mix(0.02, 0.14, uA) + 0.05*cos(uT*0.09));
        float r = length(p - g);
        col += uAcc * (0.026 + 0.022*uA + 0.06*uFlash) * exp(-r*r*5.0);
        col += uAcc * (0.05 + 0.08*uFlash) * exp(-r*r*40.0);
        // light streaks: attention racing through the frame, faster while scrolling
        for (int i = 0; i < 12; i++) {
          float fi = float(i);
          float y = (hash(fi*7.13) - 0.5) * 0.95;
          float speed = (0.05 + hash(fi*3.1)*0.09) * (1.0 + uBoost*2.5);
          float x = fract(hash(fi*1.7) + uT*speed) * 3.4 - 1.7;
          float len = (0.25 + hash(fi*9.2)*0.6) * (1.0 + uBoost*0.8);
          float d = abs(p.y - y - sin(p.x*1.3 + fi)*0.03);
          float along = smoothstep(x - len, x, p.x) * (1.0 - smoothstep(x, x + 0.02, p.x));
          float w = 0.0012 + hash(fi*5.7)*0.0016;
          float line = smoothstep(w*4.0, 0.0, d) * along;
          vec3 c = hash(fi*11.3) > 0.6 ? uAcc : lin(vec3(0.95,0.93,0.9));
          col += c * line * (0.16 + 0.18*hash(fi*2.9));
        }
        col *= mix(1.0, 0.35, smoothstep(0.35, 1.1, length(p*vec2(0.85,1.15))));
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  return new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
}

function sprite(inner, mid, edge) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, inner); gr.addColorStop(0.22, mid); gr.addColorStop(1, edge);
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// A comet trail: an arc of torus whose glow fades from the head back along the ring.
function trailMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uI: { value: 0.6 }, uRed: { value: 0 }, uAcc: { value: new THREE.Vector3(1, 0.16, 0.1) } },
    vertexShader: `varying vec2 vUv; varying float vF; void main(){ vUv = uv; vec3 n = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vF = abs(dot(n, normalize(-mv.xyz))); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying vec2 vUv; varying float vF; uniform float uI; uniform float uRed; uniform vec3 uAcc;
      void main(){
        float a = pow(vUv.x, 1.7) * uI * (0.45 + 0.55*vF);
        vec3 head = vec3(1.0, 0.92, 0.88);
        vec3 tail = uAcc;
        vec3 c = mix(tail, head, pow(vUv.x, 6.0) * (1.0 - 0.5*uRed));
        gl_FragColor = vec4(c * a * 3.4, a);
      }`,
  });
}

export function startHero({ canvas, getProgress, getVelocity = () => 0, onReady, fixed = null, mode = 'full' }) {
  const lite = mode === 'lite';
  const acc = (window.AYLA && window.AYLA.accent) ? window.AYLA.accent() : { rgb: [255, 59, 47], hot: [255, 90, 79] };
  const RED = new THREE.Color().setRGB(acc.rgb[0] / 255, acc.rgb[1] / 255, acc.rgb[2] / 255, THREE.SRGBColorSpace);
  const S = acc.rgb.join(','), Hh = acc.hot.join(',');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite || (window.devicePixelRatio || 1) < 2, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!fixed });
  let dpr = Math.min(window.devicePixelRatio || 1, fixed ? 1 : lite ? 1.25 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x0a0909, 1);

  const scene = new THREE.Scene();
  scene.environment = envTexture(renderer, RED);
  const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 60);
  camera.position.set(0, 0, 10);

  const lumA = 0.2126 * RED.r + 0.7152 * RED.g + 0.0722 * RED.b;
  const GLOW = RED.clone().multiplyScalar(Math.min(1, 0.24 / Math.max(0.01, lumA)));
  const bg = backdrop(GLOW);
  bg.renderOrder = -1;
  scene.add(bg);

  const ringMat = lite
    ? new THREE.MeshPhysicalMaterial({ color: 0x8a8483, metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.6 })
    : new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.07, transmission: 1, thickness: 0.9, ior: 1.46,
      clearcoat: 1, clearcoatRoughness: 0.05, specularIntensity: 1, envMapIntensity: 2.2,
      attenuationColor: new THREE.Color('#fff1ee'), attenuationDistance: 2.6, dispersion: 0.2,
    });

  // spin: radians per second around each ring's hinge axis; prec: slow precession of the hinge
  const RINGS = [
    { R: 2.05, t: 0.088, spin: 0.62, prec: 0.21, tilt: 0.35, ph: 0.0, comet: 1.25 },
    { R: 1.64, t: 0.078, spin: -0.9, prec: -0.27, tilt: 1.2, ph: 1.7, comet: -1.6 },
    { R: 1.25, t: 0.07, spin: 1.18, prec: 0.33, tilt: 2.1, ph: 3.1, comet: 2.0 },
    { R: 0.88, t: 0.062, spin: -1.45, prec: -0.4, tilt: 2.9, ph: 4.4, comet: -2.5 },
  ];
  const seg = lite ? [24, 150] : [40, 220];
  const group = new THREE.Group();
  scene.add(group);
  const glowRed = sprite(`rgba(${Hh},1)`, `rgba(${S},.55)`, `rgba(${S},0)`);
  const glowWhite = sprite('rgba(255,255,255,1)', `rgba(${Hh},.45)`, `rgba(${S},0)`);
  const ARC = 1.7;
  const rings = RINGS.map((cfg, i) => {
    const pivot = new THREE.Object3D();
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(cfg.R, cfg.t, seg[0], seg[1]), ringMat);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
    const core = new THREE.Mesh(new THREE.TorusGeometry(cfg.R, cfg.t * 0.16, 6, seg[1]), coreMat);
    const tMat = trailMaterial(); tMat.uniforms.uAcc.value.set(RED.r, RED.g, RED.b);
    const trail = new THREE.Mesh(new THREE.TorusGeometry(cfg.R, cfg.t * 1.3, 8, 72, ARC), tMat);
    if (cfg.comet < 0) trail.scale.set(1, -1, 1); // mirror so the head leads in either direction
    const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowWhite, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 }));
    head.scale.setScalar(0.55);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowRed, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
    halo.scale.setScalar(0.95);
    pivot.add(core, mesh, trail, head, halo);
    group.add(pivot);
    return { cfg, i, pivot, coreMat, trail, tMat, head, halo, q: new THREE.Quaternion(), spin: cfg.ph, prec: cfg.ph * 0.5, comet: cfg.ph };
  });

  // dust field orbiting the gyroscope
  const N = lite ? 260 : 520;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let k = 0; k < N; k++) {
    const r = 2.3 + Math.pow(Math.random(), 0.7) * 2.6, a = Math.random() * TAU, y = (Math.random() - 0.5) * (0.5 + r * 0.25);
    pos[k * 3] = Math.cos(a) * r; pos[k * 3 + 1] = y; pos[k * 3 + 2] = Math.sin(a) * r;
    const red = Math.random() < 0.22, b = 0.35 + Math.random() * 0.65;
    col[k * 3] = red ? b * RED.r * 1.6 : b; col[k * 3 + 1] = red ? b * RED.g * 1.6 : b * 0.94; col[k * 3 + 2] = red ? b * RED.b * 1.6 : b * 0.9;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: lite ? 0.11 : 0.085, map: glowWhite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85, sizeAttenuation: true }));
  const dustTilt = new THREE.Group();
  dustTilt.rotation.set(0.42, 0, 0.18);
  dustTilt.add(dust);
  group.add(dustTilt);

  // lock-in shockwave, lives in the aligned plane
  const waveMat = new THREE.MeshBasicMaterial({ color: GLOW.clone().multiplyScalar(1.8), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
  const wave = new THREE.Mesh(new THREE.RingGeometry(0.97, 1.0, 128), waveMat);
  const wavePivot = new THREE.Object3D();
  wavePivot.add(wave);
  group.add(wavePivot);
  let waveT = -1, lastP = 0;

  const qChaos = new THREE.Quaternion(), qAlign = new THREE.Quaternion(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), qc = new THREE.Quaternion();
  const AX = new THREE.Vector3(1, 0, 0), AY = new THREE.Vector3(0, 1, 0), AZ = new THREE.Vector3(0, 0, 1), eul = new THREE.Euler();
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const sm = (p, a, b) => { const t = Math.min(1, Math.max(0, (p - a) / (b - a))); return t * t * (3 - 2 * t); };
  let boost = 0, flash = 0, alignSpin = 0;

  function onPointer(e) {
    ptr.tx = (e.clientX / innerWidth - 0.5) * 2;
    ptr.ty = (e.clientY / innerHeight - 0.5) * 2;
  }
  if (!fixed) addEventListener('pointermove', onPointer, { passive: true });

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const z = -6, dist = camera.position.z - z;
    const hh = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
    bg.position.z = z; bg.scale.set((hh * camera.aspect) / 2 * 1.04, hh / 2 * 1.04, 1);
    bg.material.uniforms.uAspect.value = camera.aspect;
  }
  resize();

  function update(t, dt, p) {
    const aspect = camera.aspect;
    ptr.x += (ptr.tx - ptr.x) * 0.05; ptr.y += (ptr.ty - ptr.y) * 0.05;
    // scroll speed spins everything faster, then eases back
    const v = Math.min(3, Math.abs(getVelocity()) * 0.05);
    boost += (v - boost) * (v > boost ? 0.25 : 0.04);
    const mixAll = sm(p, 0.1, 0.62);

    // composition: right of the headline on wide screens, centered and higher on tall ones
    if (aspect < 0.9) {
      group.position.set(0, 1.4 + 0.1 * mixAll, 0);
      group.scale.setScalar(Math.max(0.4, aspect * 1.0));
    } else {
      const side = aspect > 1.55 ? 1.8 : aspect > 1.25 ? 1.35 : 0.9;
      group.position.set(side * (1 - mixAll), 0.1 + 0.4 * mixAll, 0);
      group.scale.setScalar((aspect > 1.25 ? 0.9 : 0.78) * (1 - 0.04 * mixAll));
    }
    group.rotation.set(ptr.y * 0.14, ptr.x * 0.2, 0);

    // aligned plane: tilted toward the camera, slowly precessing
    alignSpin += dt * (0.35 + boost * 0.6);
    eul.set(1.12 + Math.sin(t * 0.5) * 0.08, Math.sin(alignSpin * 0.5) * 0.35, 0.2 + Math.cos(t * 0.37) * 0.06);
    qAlign.setFromEuler(eul);
    wavePivot.quaternion.copy(qAlign);

    for (const r of rings) {
      const c = r.cfg;
      const m = sm(p, 0.08 + r.i * 0.07, 0.42 + r.i * 0.07);
      // gimbal spin: each ring flips around a hinge in its own plane, the hinge precesses
      const sp = (1 - 0.92 * m) * (1 + boost);
      r.spin += c.spin * sp * dt;
      r.prec += c.prec * (1 + boost * 0.5) * dt;
      qa.setFromAxisAngle(AY, r.prec);
      qb.setFromAxisAngle(AZ, c.tilt);
      qc.setFromAxisAngle(AX, r.spin);
      qChaos.copy(qa).multiply(qb).multiply(qc);
      r.q.slerpQuaternions(qChaos, qAlign, m);
      r.pivot.quaternion.copy(r.q);

      // comets race around every ring, faster when scrolling and once locked
      r.comet += c.comet * (1 + boost * 1.4 + m * 0.6) * dt;
      const a = r.comet;
      r.trail.rotation.z = c.comet > 0 ? a - ARC : a + ARC;
      r.head.position.set(Math.cos(a) * c.R, Math.sin(a) * c.R, 0);
      r.halo.position.copy(r.head.position);
      const lit = sm(p, 0.42 + r.i * 0.06, 0.7 + r.i * 0.05);
      r.tMat.uniforms.uI.value = 0.55 + 0.45 * lit + boost * 0.2;
      r.tMat.uniforms.uRed.value = lit;
      r.halo.material.opacity = 0.25 + lit * 0.6;
      r.coreMat.color.copy(GLOW).multiplyScalar(lit * 2.4);
    }

    dust.rotation.y += dt * (0.09 + boost * 0.5);
    dust.material.opacity = 0.55 + 0.3 * Math.sin(t * 0.8) * 0.5 + 0.15;

    // shockwave when the system locks
    if (lastP < 0.72 && p >= 0.72) waveT = 0;
    lastP = p;
    if (waveT >= 0) {
      waveT += dt;
      const k = Math.min(1, waveT / 1.3);
      const s = 0.9 + k * 3.4;
      wave.scale.setScalar(s);
      waveMat.opacity = (1 - k) * (1 - k) * 0.9;
      flash = (1 - k) * (1 - k);
      if (k >= 1) { waveT = -1; waveMat.opacity = 0; flash = 0; }
    }

    bg.material.uniforms.uT.value = t;
    bg.material.uniforms.uA.value = mixAll;
    bg.material.uniforms.uBoost.value = boost;
    bg.material.uniforms.uFlash.value = flash;
  }

  // ── loop ──
  let running = false, raf = 0, t0 = performance.now(), slow = 0, frames = 0, last = 0, simT = 0;
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dtMs = last ? Math.min(100, now - last) : 16; last = now;
    frames++; if (dtMs > 26) slow++;
    if (frames === 90) {           // adaptive quality: drop resolution if frames run long
      if (slow > 40 && dpr > 1) { dpr = 1; renderer.setPixelRatio(dpr); resize(); }
      frames = slow = 0;
    }
    simT += dtMs / 1000;
    update(simT, dtMs / 1000, getProgress(simT));
    renderer.render(scene, camera);
  }
  const api = {
    start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize,
    renderAt(t, p) {
      // jump the simulation to time t (used to capture the still fallback)
      for (const r of rings) { r.spin = r.cfg.ph + r.cfg.spin * t * (1 - 0.92 * sm(p, 0.08 + r.i * 0.07, 0.42 + r.i * 0.07)); r.prec = r.cfg.ph * 0.5 + r.cfg.prec * t; r.comet = r.cfg.ph + r.cfg.comet * t; }
      alignSpin = t * 0.35; lastP = p; dust.rotation.y = t * 0.09;
      update(t, 0, p); renderer.render(scene, camera);
    },
  };
  if (fixed) {
    ptr.tx = ptr.x = fixed.px || 0; ptr.ty = ptr.y = fixed.py || 0;
    api.renderAt(fixed.t, fixed.p);
    onReady && onReady(api);
    return api;
  }
  update(0, 0, getProgress(0)); renderer.render(scene, camera);
  requestAnimationFrame(() => { onReady && onReady(api); });
  return api;
}
