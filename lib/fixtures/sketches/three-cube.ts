import { Sketch } from '@/lib/schemas/parameterSchema';

export const threeCube: Sketch = {
  id: 'fixture-three-cube',
  slug: 'three-cube',
  title: 'Three Cube',
  runtime: 'three',
  code: `
  import * as THREE from 'three';

  // ---- Scene setup ----
  const scene = new THREE.Scene();
  let lastBgColor = params.bgColor ?? '#F0F0F0';
  scene.background = new THREE.Color(lastBgColor);

  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  // ---- Geometry helpers ----
  // The shape changes via param, so we keep a factory and rebuild on demand.
  function makeGeometry(shape) {
    if (shape === 'sphere')   return new THREE.SphereGeometry(0.8, 32, 32);
    if (shape === 'cone')     return new THREE.ConeGeometry(0.8, 1.4, 32);
    if (shape === 'torus')    return new THREE.TorusGeometry(0.7, 0.25, 16, 64);
    return new THREE.BoxGeometry(1, 1, 1);  // default: cube
  }

  function makeMaterial(wireframe) {
    return new THREE.MeshNormalMaterial({ wireframe });
  }

  // Track the current mesh so we can swap it out when shape/wireframe changes.
  let mesh = new THREE.Mesh(
    makeGeometry(params.shape ?? 'cube'),
    makeMaterial(params.wireframe ?? false)
  );
  scene.add(mesh);

  // Remember the last-applied values so we know when to rebuild.
  let lastShape = params.shape ?? 'cube';
  let lastWireframe = params.wireframe ?? false;
  let smoothedSpeedX = params.speedX ?? 1;
  let smoothedSpeedY = params.speedY ?? 1;
  let smoothedScale = params.scale ?? 1;
  let smoothedCameraZ = params.cameraZ ?? 5;

  // ---- Actions ----
  onAction('reset', () => {
    mesh.rotation.set(0, 0, 0);
    mesh.position.set(0, 0, 0);
  });

  onAction('randomize', () => {
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
  });

  onAction('jump', () => {
    // Quick vertical bounce — interpolated over the next ~30 frames.
    let t = 0;
    const interval = setInterval(() => {
      t += 0.1;
      mesh.position.y = Math.sin(t * Math.PI) * 1.5;
      if (t >= 1) {
        clearInterval(interval);
        mesh.position.y = 0;
      }
    }, 16);
  });

  // ---- Resize handling ----
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // ---- Render loop ----
  function animate() {
    // Rebuild the mesh if shape or wireframe changed since last frame.
    if (params.shape !== lastShape || params.wireframe !== lastWireframe) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
      mesh = new THREE.Mesh(
        makeGeometry(params.shape ?? 'cube'),
        makeMaterial(params.wireframe ?? false)
      );
      scene.add(mesh);
      lastShape = params.shape ?? 'cube';
      lastWireframe = params.wireframe ?? false;
    }

    // Avoid re-parsing color strings every frame when the value is unchanged.
    const nextBgColor = params.bgColor ?? '#F0F0F0';
    if (nextBgColor !== lastBgColor) {
      scene.background.set(nextBgColor);
      lastBgColor = nextBgColor;
    }

    // Smooth parameter updates so rapid UI events still feel continuous.
    smoothedSpeedX += ((params.speedX ?? 1) - smoothedSpeedX) * 0.2;
    smoothedSpeedY += ((params.speedY ?? 1) - smoothedSpeedY) * 0.2;
    smoothedScale += ((params.scale ?? 1) - smoothedScale) * 0.2;
    smoothedCameraZ += ((params.cameraZ ?? 5) - smoothedCameraZ) * 0.2;

    // Rotation driven by params.
    mesh.rotation.x += smoothedSpeedX * 0.01;
    mesh.rotation.y += smoothedSpeedY * 0.01;

    // Scale also driven by params.
    mesh.scale.set(smoothedScale, smoothedScale, smoothedScale);

    // Camera distance via param.
    camera.position.z = smoothedCameraZ;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
  `,
  parameters: [
    {
      name: 'speedX',
      type: 'number',
      min: -5,
      max: 5,
      step: 0.1,
      default: 1,
      label: 'Speed X',
    },
    {
      name: 'speedY',
      type: 'number',
      min: -5,
      max: 5,
      step: 0.1,
      default: 0.6,
      label: 'Speed Y',
    },
    {
      name: 'scale',
      type: 'number',
      min: 0.2,
      max: 3,
      step: 0.1,
      default: 1,
      label: 'Scale',
    },
    {
      name: 'cameraZ',
      type: 'number',
      min: 2,
      max: 12,
      step: 0.1,
      default: 5,
      label: 'Camera Distance',
    },
    {
      name: 'shape',
      type: 'select',
      options: ['cube', 'sphere', 'cone', 'torus'],
      default: 'cube',
      label: 'Shape',
    },
    {
      name: 'wireframe',
      type: 'boolean',
      default: false,
      label: 'Wireframe',
    },
    {
      name: 'bgColor',
      type: 'color',
      default: '#F0F0F0',
      label: 'Background',
    },
  ],
  actions: [
    { name: 'reset', label: 'Reset' },
    { name: 'randomize', label: 'Randomize' },
    { name: 'jump', label: 'Jump' },
  ],
  extraImports: {},
};