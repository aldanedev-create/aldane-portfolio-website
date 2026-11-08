function initSecurityScene() {
  const canvas = document.querySelector("[data-security-scene]");
  if (!canvas || canvas.dataset.ready || !window.THREE) return;
  canvas.dataset.ready = "true";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const group = new THREE.Group();
  scene.add(group);

  const shield = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 1),
    new THREE.MeshStandardMaterial({
      color: 0x41e6a2,
      metalness: 0.36,
      roughness: 0.32,
      transparent: true,
      opacity: 0.82,
      wireframe: true,
    }),
  );
  group.add(shield);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x7aa7ff, transparent: true, opacity: 0.34 });
  [2.05, 2.6, 3.15].forEach((radius, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 120), ringMaterial.clone());
    ring.rotation.x = Math.PI / 2 + index * 0.45;
    ring.rotation.y = index * 0.32;
    group.add(ring);
  });

  const pointsGeometry = new THREE.BufferGeometry();
  const positions = [];
  for (let index = 0; index < 95; index += 1) {
    const angle = index * 0.82;
    const radius = 2.4 + (index % 9) * 0.11;
    positions.push(Math.cos(angle) * radius, Math.sin(index * 0.37) * 1.2, Math.sin(angle) * radius);
  }
  pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const points = new THREE.Points(
    pointsGeometry,
    new THREE.PointsMaterial({ color: 0xf2c14e, size: 0.035, transparent: true, opacity: 0.8 }),
  );
  group.add(points);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.3);
  key.position.set(3, 4, 5);
  scene.add(key);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  function animate() {
    group.rotation.y += 0.004;
    group.rotation.x = Math.sin(performance.now() * 0.00055) * 0.16;
    points.rotation.y -= 0.0025;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

document.addEventListener("DOMContentLoaded", initSecurityScene);
