(function () {
  const palettes = {
    "screen-compiler": [0x41e6a2, 0x7aa7ff, 0xf2c14e],
    "screen-workspace": [0x7aa7ff, 0x41e6a2, 0xf2c14e],
    "screen-cms": [0xd57bff, 0x7aa7ff, 0x41e6a2],
    "screen-education": [0x41e6a2, 0x4aa3ff, 0xf2c14e],
    "screen-mobile": [0xff6b91, 0x41e6a2, 0x7aa7ff],
    "screen-market": [0xf2c14e, 0x41e6a2, 0xff6b6b],
    "screen-commerce": [0x41e6a2, 0xf2c14e, 0x7aa7ff],
    "screen-inventory": [0x9be15d, 0xf2c14e, 0x7aa7ff],
    "screen-gym": [0xf2c14e, 0x7aa7ff, 0x41e6a2],
    "screen-terminal": [0x41e6a2, 0x2ee66b, 0xf2c14e],
    "screen-web": [0x7aa7ff, 0x41e6a2, 0xf2c14e],
    "screen-dashboard": [0x7aa7ff, 0xf2c14e, 0x41e6a2],
    "screen-security": [0xff6b91, 0x41e6a2, 0x7aa7ff],
    "screen-analytics": [0x7aa7ff, 0xf2c14e, 0x41e6a2],
    "screen-sova": [0x8b7cf6, 0x41e6a2, 0x7aa7ff],
    "screen-code": [0x41e6a2, 0x7aa7ff, 0xf2c14e],
  };

  function initProjectScenes() {
    document.querySelectorAll("[data-project-scene]").forEach((canvas) => {
      if (!canvas.dataset.ready) buildScene(canvas);
    });
  }

  function buildScene(canvas) {
    if (!window.THREE) return;
    canvas.dataset.ready = "true";

    const type = canvas.dataset.sceneType || "screen-code";
    const colors = palettes[type] || palettes["screen-code"];
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 2.2, 7.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const mats = {
      primary: material(colors[0], 0.36),
      secondary: material(colors[1], 0.42),
      accent: material(colors[2], 0.32),
      dark: material(0x101722, 0.55),
      glass: new THREE.MeshStandardMaterial({
        color: colors[1],
        transparent: true,
        opacity: 0.32,
        roughness: 0.22,
        metalness: 0.18,
      }),
    };

    const root = new THREE.Group();
    scene.add(root);
    addFloor(root, mats);
    addSceneModel(type, root, mats);
    addOrbit(root, mats);

    scene.add(new THREE.AmbientLight(0xffffff, 0.62));
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(4, 5, 5);
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

    function animate(now) {
      const time = now * 0.001;
      root.rotation.y = Math.sin(time * 0.28) * 0.16;

      root.traverse((node) => {
        if (!node.userData.kind) return;
        if (node.userData.kind === "orbit") {
          const angle = time * node.userData.speed + node.userData.phase;
          node.position.x = Math.cos(angle) * node.userData.radius;
          node.position.z = Math.sin(angle) * node.userData.radius * 0.55;
          node.position.y = node.userData.height + Math.sin(angle * 1.8) * 0.2;
          node.rotation.y += 0.012;
        }
        if (node.userData.kind === "pulse") {
          const scale = 1 + Math.sin(time * node.userData.speed + node.userData.phase) * 0.09;
          node.scale.setScalar(scale);
        }
        if (node.userData.kind === "bar") {
          node.scale.y = 0.45 + Math.abs(Math.sin(time * node.userData.speed + node.userData.phase)) * node.userData.height;
          node.position.y = -0.7 + node.scale.y * 0.35;
        }
        if (node.userData.kind === "spin") {
          node.rotation.y += node.userData.speed;
          node.rotation.x += node.userData.speed * 0.34;
        }
        if (node.userData.kind === "scan") {
          node.rotation.z = time * node.userData.speed;
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function addSceneModel(type, root, mats) {
    if (type === "screen-compiler") return compilerScene(root, mats);
    if (type === "screen-workspace") return workspaceScene(root, mats);
    if (type === "screen-cms") return cmsScene(root, mats);
    if (type === "screen-education") return educationScene(root, mats);
    if (type === "screen-mobile") return mobileSecurityScene(root, mats);
    if (type === "screen-market") return marketScene(root, mats);
    if (type === "screen-commerce") return commerceScene(root, mats);
    if (type === "screen-inventory") return inventoryScene(root, mats);
    if (type === "screen-gym") return gymScene(root, mats);
    if (type === "screen-terminal") return terminalScene(root, mats);
    if (type === "screen-web") return webScene(root, mats);
    if (type === "screen-dashboard") return dashboardScene(root, mats);
    if (type === "screen-security") return shieldScene(root, mats);
    if (type === "screen-analytics") return analyticsScene(root, mats);
    if (type === "screen-sova") return sovaScene(root, mats);
    return codeScene(root, mats);
  }

  function sovaScene(root, mats) {
    const pipeline = [
      [-1.7, 0.8, 0],
      [-0.88, 0.28, 0],
      [0, 0.74, 0],
      [0.88, 0.18, 0],
      [1.68, 0.7, 0],
    ];
    pipeline.forEach((position, index) => {
      const node = addBox(root, [0.46, 0.46, 0.18], position, index % 2 ? mats.secondary : mats.primary);
      node.userData = { kind: "pulse", speed: 1.8 + index * 0.22, phase: index * 0.7 };
    });
    addLineWeb(root, pipeline, mats.accent, true);
    const runtime = addCylinder(root, 0.54, 0.76, [0, -0.66, 0], mats.dark);
    runtime.userData = { kind: "spin", speed: 0.008 };
    for (let index = 0; index < 5; index += 1) {
      const token = addSphere(root, 0.09, [0, 0, 0], index % 2 ? mats.accent : mats.secondary);
      token.userData = {
        kind: "orbit",
        radius: 1.18 + (index % 2) * 0.26,
        height: -0.5 + index * 0.12,
        phase: index * 1.2,
        speed: 0.7 + index * 0.08,
      };
    }
  }

  function compilerScene(root, mats) {
    const positions = [[0, 1.2, 0], [-1.25, 0.35, 0], [1.25, 0.35, 0], [-0.75, -0.6, 0], [0.75, -0.6, 0]];
    positions.forEach((pos, index) => {
      const node = addSphere(root, index ? 0.18 : 0.28, pos, index ? mats.secondary : mats.primary);
      node.userData = { kind: "pulse", speed: 2 + index * 0.2, phase: index };
    });
    addLineWeb(root, positions, mats.accent);
    addBox(root, [1.9, 0.18, 0.14], [0, -1.1, 0], mats.dark);
  }

  function workspaceScene(root, mats) {
    addMonitor(root, mats, [0, 0.22, -0.62]);
    addBox(root, [2.2, 0.12, 0.8], [0, -0.92, 0.24], mats.dark);
    for (let index = 0; index < 10; index += 1) {
      addBox(root, [0.18, 0.05, 0.14], [-0.95 + index * 0.21, -0.82, 0.28], index % 3 ? mats.secondary : mats.accent);
    }
    addBox(root, [0.8, 0.08, 0.24], [0.88, -0.58, -0.5], mats.accent).userData = { kind: "pulse", speed: 3, phase: 0 };
  }

  function cmsScene(root, mats) {
    addCylinder(root, 0.62, 1.08, [0, -0.22, 0], mats.primary).userData = { kind: "pulse", speed: 1.4, phase: 0 };
    for (let index = 0; index < 6; index += 1) {
      const card = addBox(root, [0.7, 0.9, 0.06], [0, 0.52, 0], index % 2 ? mats.secondary : mats.accent);
      card.userData = { kind: "orbit", speed: 0.7, phase: index, radius: 1.85, height: 0.42 };
    }
  }

  function educationScene(root, mats) {
    for (let index = 0; index < 4; index += 1) {
      addBox(root, [1.7 - index * 0.14, 0.18, 0.8], [0, -0.75 + index * 0.22, 0], index % 2 ? mats.secondary : mats.primary);
    }
    addBox(root, [1.8, 1.1, 0.08], [0.15, 0.6, -0.46], mats.dark);
    addBox(root, [0.3, 0.82, 0.06], [-0.55, 0.52, -0.38], mats.accent).userData = { kind: "bar", speed: 1.6, phase: 0.1, height: 1.2 };
    addBox(root, [0.3, 0.82, 0.06], [0, 0.52, -0.38], mats.secondary).userData = { kind: "bar", speed: 1.8, phase: 1.2, height: 1 };
    addBox(root, [0.3, 0.82, 0.06], [0.55, 0.52, -0.38], mats.primary).userData = { kind: "bar", speed: 1.4, phase: 2, height: 1.35 };
  }

  function mobileSecurityScene(root, mats) {
    addBox(root, [1.05, 2.05, 0.14], [0, 0, 0], mats.dark);
    addBox(root, [0.86, 1.62, 0.05], [0, 0.04, 0.08], mats.glass);
    const shield = addCylinder(root, 0.44, 0.08, [0, 0.1, 0.2], mats.primary);
    shield.rotation.x = Math.PI / 2;
    shield.userData = { kind: "pulse", speed: 2.3, phase: 0 };
    for (let index = 0; index < 3; index += 1) {
      const ring = addTorus(root, 0.78 + index * 0.32, [0, 0.08, 0.18], index % 2 ? mats.secondary : mats.accent);
      ring.userData = { kind: "scan", speed: 0.8 + index * 0.3 };
    }
  }

  function marketScene(root, mats) {
    for (let index = 0; index < 12; index += 1) {
      const mat = index % 3 === 0 ? mats.accent : index % 2 ? mats.secondary : mats.primary;
      const bar = addBox(root, [0.14, 1, 0.18], [-1.55 + index * 0.28, -0.35, 0], mat);
      bar.userData = { kind: "bar", speed: 1 + index * 0.08, phase: index * 0.6, height: 1.8 };
    }
  }

  function commerceScene(root, mats) {
    addTorus(root, 0.26, [-0.62, -0.86, 0.26], mats.dark);
    addTorus(root, 0.26, [0.76, -0.86, 0.26], mats.dark);
    addBox(root, [1.7, 0.75, 0.9], [0, -0.38, 0], mats.secondary);
    addBox(root, [0.62, 0.52, 0.62], [-0.42, 0.28, 0], mats.primary).userData = { kind: "pulse", speed: 1.8, phase: 0 };
    addBox(root, [0.52, 0.46, 0.52], [0.42, 0.18, 0.04], mats.accent).userData = { kind: "pulse", speed: 2.2, phase: 1 };
  }

  function inventoryScene(root, mats) {
    for (let shelf = 0; shelf < 3; shelf += 1) {
      addBox(root, [2.3, 0.1, 0.28], [0, -0.75 + shelf * 0.65, 0], mats.dark);
      for (let index = 0; index < 5; index += 1) {
        addBox(root, [0.32, 0.32, 0.32], [-0.9 + index * 0.45, -0.53 + shelf * 0.65, 0], index % 2 ? mats.primary : mats.accent);
      }
    }
  }

  function gymScene(root, mats) {
    const bar = addCylinder(root, 0.06, 2.6, [0, 0, 0], mats.secondary);
    bar.rotation.z = Math.PI / 2;
    [-1.18, -0.92, 0.92, 1.18].forEach((x, index) => {
      const plate = addCylinder(root, 0.34, 0.18, [x, 0, 0], index % 2 ? mats.primary : mats.accent);
      plate.rotation.z = Math.PI / 2;
      plate.userData = { kind: "spin", speed: 0.012 };
    });
  }

  function terminalScene(root, mats) {
    addBox(root, [2.65, 1.6, 0.12], [0, 0.1, 0], mats.dark);
    for (let index = 0; index < 8; index += 1) {
      const line = addBox(root, [0.5 + (index % 4) * 0.28, 0.05, 0.05], [-0.75, 0.75 - index * 0.18, 0.1], index % 2 ? mats.primary : mats.accent);
      line.userData = { kind: "pulse", speed: 2.1, phase: index * 0.3 };
    }
  }

  function webScene(root, mats) {
    for (let index = 0; index < 3; index += 1) {
      addBox(root, [1.45, 1, 0.08], [-0.8 + index * 0.8, 0.05 + index * 0.16, -index * 0.12], index % 2 ? mats.secondary : mats.primary);
      addBox(root, [1.2, 0.08, 0.05], [-0.8 + index * 0.8, 0.32 + index * 0.16, 0.02 - index * 0.12], mats.accent);
    }
  }

  function dashboardScene(root, mats) {
    addBox(root, [2.6, 1.55, 0.1], [0, 0.05, 0], mats.dark);
    for (let index = 0; index < 5; index += 1) {
      addBox(root, [0.24, 1, 0.08], [-0.95 + index * 0.46, -0.28, 0.08], index % 2 ? mats.secondary : mats.primary).userData = {
        kind: "bar",
        speed: 1.4 + index * 0.2,
        phase: index,
        height: 1.4,
      };
    }
    addTorus(root, 0.42, [0.94, 0.42, 0.08], mats.accent).userData = { kind: "spin", speed: 0.015 };
  }

  function shieldScene(root, mats) {
    const shield = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), mats.primary);
    shield.userData = { kind: "spin", speed: 0.006 };
    root.add(shield);
    for (let index = 0; index < 4; index += 1) {
      const ring = addTorus(root, 1.35 + index * 0.28, [0, 0, 0], index % 2 ? mats.secondary : mats.accent);
      ring.rotation.x = Math.PI / 2 + index * 0.32;
      ring.userData = { kind: "scan", speed: 0.42 + index * 0.16 };
    }
  }

  function analyticsScene(root, mats) {
    const points = [[-1.5, -0.6, 0], [-0.85, 0.1, 0], [-0.15, -0.2, 0], [0.55, 0.65, 0], [1.35, 0.25, 0]];
    points.forEach((point, index) => addSphere(root, 0.16, point, index % 2 ? mats.secondary : mats.primary));
    addLineWeb(root, points, mats.accent, true);
    addBox(root, [3.2, 0.08, 0.08], [0, -0.9, 0], mats.dark);
  }

  function codeScene(root, mats) {
    addMonitor(root, mats, [0, 0.2, -0.52]);
    for (let index = 0; index < 7; index += 1) {
      addBox(root, [0.54 + (index % 3) * 0.36, 0.06, 0.05], [-0.75, 0.74 - index * 0.18, -0.38], index % 2 ? mats.secondary : mats.accent);
    }
  }

  function addFloor(root, mats) {
    addBox(root, [4.4, 0.06, 2.8], [0, -1.15, 0], mats.dark);
  }

  function addOrbit(root, mats) {
    for (let index = 0; index < 9; index += 1) {
      const node = index % 2 ? addSphere(root, 0.06, [0, 0, 0], mats.secondary) : addBox(root, [0.12, 0.12, 0.12], [0, 0, 0], mats.accent);
      node.userData = {
        kind: "orbit",
        radius: 2.4 + (index % 3) * 0.25,
        height: 0.1 + (index % 4) * 0.28,
        phase: index * 0.7,
        speed: 0.45 + index * 0.03,
      };
    }
  }

  function addMonitor(root, mats, position) {
    addBox(root, [2.4, 1.42, 0.14], position, mats.dark);
    addBox(root, [2, 1.04, 0.05], [position[0], position[1] + 0.02, position[2] + 0.08], mats.glass);
    addBox(root, [0.25, 0.56, 0.12], [position[0], position[1] - 0.96, position[2] + 0.02], mats.dark);
    addBox(root, [1.15, 0.08, 0.52], [position[0], position[1] - 1.2, position[2] + 0.12], mats.dark);
  }

  function addLineWeb(root, points, mat, sequentialOnly) {
    const vertices = [];
    points.forEach((point, index) => {
      if (sequentialOnly && index === points.length - 1) return;
      const targets = sequentialOnly ? [points[index + 1]] : points.slice(index + 1, index + 3);
      targets.forEach((target) => {
        vertices.push(point[0], point[1], point[2], target[0], target[1], target[2]);
      });
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    root.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: mat.color, transparent: true, opacity: 0.68 })));
  }

  function addBox(parent, size, position, mat) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), mat);
    mesh.position.set(position[0], position[1], position[2]);
    parent.add(mesh);
    return mesh;
  }

  function addSphere(parent, radius, position, mat) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), mat);
    mesh.position.set(position[0], position[1], position[2]);
    parent.add(mesh);
    return mesh;
  }

  function addCylinder(parent, radius, height, position, mat) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 32), mat);
    mesh.position.set(position[0], position[1], position[2]);
    parent.add(mesh);
    return mesh;
  }

  function addTorus(parent, radius, position, mat) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 8, 96), mat);
    mesh.position.set(position[0], position[1], position[2]);
    parent.add(mesh);
    return mesh;
  }

  function material(color, roughness) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.18 });
  }

  window.initProjectScenes = initProjectScenes; document.addEventListener("DOMContentLoaded", initProjectScenes);
})();
