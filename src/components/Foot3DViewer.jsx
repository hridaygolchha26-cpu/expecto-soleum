import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function createRealisticFootSockGeometry() {
  const geom = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  const rings = [];

  // A. Calf / Shin Section (Vertical Rings Y from 12.0 down to 3.0)
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const y = 12.0 - t * 9.0;
    const rWidth = 1.9 - t * 0.4;
    const rDepth = 2.1 - t * 0.45;
    const zOffset = -2.8 - t * 0.6;
    rings.push({
      center: [0, y, zOffset],
      rx: rWidth,
      ry: rDepth,
      isLeg: true
    });
  }

  // B. Ankle & Heel Transition
  for (let i = 1; i <= 6; i++) {
    const t = i / 6;
    const angle = (t * Math.PI) / 2;
    const y = 3.0 - Math.sin(angle) * 2.2;
    const z = -3.4 - Math.cos(angle) * 1.8 + t * 0.6;
    const rx = 1.6 + Math.sin(t * Math.PI) * 0.35;
    const ry = 1.8;
    rings.push({
      center: [0, Math.max(0.7, y), z],
      rx: rx,
      ry: ry,
      isTransition: true
    });
  }

  // C. Plantar Foot & Forefoot Section
  for (let i = 1; i <= 10; i++) {
    const t = i / 10;
    const z = -3.2 + t * 5.4;
    const archLift = Math.sin(t * Math.PI) * 0.45;
    const y = 0.85 + (1 - t) * 0.6;
    const rx = 1.55 + t * 0.85;
    const ry = 1.6 - t * 0.65;
    rings.push({
      center: [0.1, y, z],
      rx: rx,
      ry: ry,
      archLift: archLift,
      isSole: true
    });
  }

  // D. Anatomical Sock Toe Box
  for (let i = 1; i <= 6; i++) {
    const t = i / 6;
    const z = 2.2 + t * 2.6;
    const y = 0.7 - t * 0.35;
    const rx = Math.max(0.4, 2.35 * (1 - t * 0.68));
    const ry = Math.max(0.3, 0.95 * (1 - t * 0.65));
    const xOffset = -0.3 * t;
    rings.push({
      center: [xOffset, y, z],
      rx: rx,
      ry: ry,
      isToes: true
    });
  }

  const N_RADIAL = 28;

  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    const cx = ring.center[0];
    const cy = ring.center[1];
    const cz = ring.center[2];

    for (let j = 0; j < N_RADIAL; j++) {
      const theta = (j / N_RADIAL) * Math.PI * 2;
      let cos = Math.cos(theta);
      let sin = Math.sin(theta);

      let px = cx + cos * ring.rx;
      let py, pz;

      if (ring.isLeg) {
        py = cy;
        pz = cz + sin * ring.ry;
      } else {
        py = cy + sin * ring.ry;
        if (py < 0.05) py = 0.05;
        if (ring.archLift && cos < 0 && sin < 0) {
          py += ring.archLift * (-cos) * (-sin);
        }
        pz = cz;
      }

      vertices.push(px, py, pz);
      uvs.push(j / N_RADIAL, r / (rings.length - 1));
    }
  }

  for (let r = 0; r < rings.length - 1; r++) {
    for (let j = 0; j < N_RADIAL; j++) {
      const nextJ = (j + 1) % N_RADIAL;
      const i1 = r * N_RADIAL + j;
      const i2 = (r + 1) * N_RADIAL + j;
      const i3 = (r + 1) * N_RADIAL + nextJ;
      const i4 = r * N_RADIAL + nextJ;

      indices.push(i1, i2, i4);
      indices.push(i2, i3, i4);
    }
  }

  const tipIndex = vertices.length / 3;
  const lastRing = rings[rings.length - 1];
  vertices.push(lastRing.center[0], 0.35, lastRing.center[2] + 0.4);
  uvs.push(0.5, 1.0);

  const lastRingOffset = (rings.length - 1) * N_RADIAL;
  for (let j = 0; j < N_RADIAL; j++) {
    const nextJ = (j + 1) % N_RADIAL;
    indices.push(lastRingOffset + j, tipIndex, lastRingOffset + nextJ);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

function generateSockTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base Sock Fabric: Rich Gryffindor Crimson
  ctx.fillStyle = '#780000';
  ctx.fillRect(0, 0, 512, 512);

  // Woven ribs
  ctx.strokeStyle = 'rgba(120, 0, 0, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 512; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Upper Calf Golden Stripes
  ctx.fillStyle = '#d3a625';
  ctx.fillRect(0, 30, 512, 28);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 70, 512, 16);

  // Instep band
  ctx.fillStyle = '#590000';
  ctx.fillRect(0, 270, 512, 60);
  ctx.fillStyle = '#d3a625';
  ctx.fillRect(0, 290, 512, 14);

  // Silicone Grip Pads on Sole
  ctx.fillStyle = '#fbbf24';
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      const px = 30 + col * 60;
      const py = 360 + row * 18;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Hogwarts Lightning Insignia
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(250, 110);
  ctx.lineTo(262, 132);
  ctx.lineTo(254, 134);
  ctx.lineTo(265, 155);
  ctx.lineTo(245, 137);
  ctx.lineTo(252, 135);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export const Foot3DViewer = ({ lengthCm = 27.0, widthCm = 10.0 }) => {
  const mountRef = useRef(null);
  const footMeshRef = useRef(null);
  const lengthCaliperRef = useRef(null);
  const widthCaliperRef = useRef(null);
  const runeCircleRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x140606); // Dark Velvet Burgundy

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(22, 16, 26);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 55;
    controls.minDistance = 12;
    controlsRef.current = controls;

    // Harry Potter Lights
    scene.add(new THREE.AmbientLight(0x78350f, 2.2));
    const lumosLight = new THREE.DirectionalLight(0xfef08a, 2.6);
    lumosLight.position.set(16, 26, 18);
    lumosLight.castShadow = true;
    scene.add(lumosLight);

    const crimsonRim = new THREE.DirectionalLight(0xdc2626, 2.2);
    crimsonRim.position.set(-18, 14, -16);
    scene.add(crimsonRim);

    // Rotating Hogwarts Runic Pedestal
    const runeGroup = new THREE.Group();
    runeCircleRef.current = runeGroup;
    scene.add(runeGroup);

    const ringGeo = new THREE.RingGeometry(13.8, 14.2, 64);
    const outerRing = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xd97706, side: THREE.DoubleSide }));
    outerRing.rotation.x = Math.PI / 2;
    runeGroup.add(outerRing);

    const grid = new THREE.GridHelper(30, 24, 0xf59e0b, 0x451a03);
    grid.position.y = -0.02;
    scene.add(grid);

    // Build Foot Mesh
    const sockTexture = generateSockTexture();
    const sockMaterial = new THREE.MeshStandardMaterial({
      map: sockTexture,
      roughness: 0.55,
      metalness: 0.12
    });

    const footGeo = createRealisticFootSockGeometry();
    const footMesh = new THREE.Mesh(footGeo, sockMaterial);
    footMesh.castShadow = true;
    footMesh.receiveShadow = true;
    footMeshRef.current = footMesh;
    scene.add(footMesh);

    // Glowing Golden Calipers
    const lenGroup = new THREE.Group();
    lengthCaliperRef.current = lenGroup;
    scene.add(lenGroup);

    const goldLineMat = new THREE.LineBasicMaterial({ color: 0xfbbf24, linewidth: 3 });
    const lenGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.8, 0.1, -5.8),
      new THREE.Vector3(-3.8, 0.1, 5.2)
    ]);
    lenGroup.add(new THREE.Line(lenGeo, goldLineMat));

    const widGroup = new THREE.Group();
    widthCaliperRef.current = widGroup;
    scene.add(widGroup);

    const widGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.2, 0.1, 2.0),
      new THREE.Vector3(3.4, 0.1, 2.0)
    ]);
    widGroup.add(new THREE.Line(widGeo, new THREE.LineBasicMaterial({ color: 0xfde047, linewidth: 3 })));

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (isRotating) {
        if (footMeshRef.current) footMeshRef.current.rotation.y += 0.003;
        if (runeCircleRef.current) runeCircleRef.current.rotation.y -= 0.002;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();

      // Release every GPU resource created for this viewer before removing it.
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value && value.isTexture) value.dispose();
            });
            material.dispose();
          });
        }
      });

      renderer.renderLists.dispose();
      if (mount && renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  useEffect(() => {
    if (!footMeshRef.current) return;
    const scaleZ = parseFloat(lengthCm) / 27.0;
    const scaleX = parseFloat(widthCm) / 10.0;
    footMeshRef.current.scale.set(scaleX, 1.0, scaleZ);

    if (lengthCaliperRef.current) lengthCaliperRef.current.scale.set(1.0, 1.0, scaleZ);
    if (widthCaliperRef.current) widthCaliperRef.current.scale.set(scaleX, 1.0, 1.0);
  }, [lengthCm, widthCm]);

  return (
    <div className="relative w-full h-[480px] lg:h-[560px] bg-gradient-to-b from-stone-950 via-red-950/60 to-black rounded-3xl overflow-hidden border-2 border-amber-600/50 shadow-2xl">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/50 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span className="text-xs font-serif font-bold text-amber-300">⚡ 3D FOOT IN FOOTBALL SOCKS</span>
        </div>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className="pointer-events-auto px-3 py-1.5 text-xs font-mono rounded-xl bg-amber-950/90 border border-amber-600/60 text-amber-200 hover:text-white"
        >
          {isRotating ? 'Spell: Rotating ON' : 'Spell: Paused'}
        </button>
      </div>

      {/* Real-time Dimensions */}
      <div className="absolute bottom-16 left-4 flex flex-col gap-2 pointer-events-none font-mono">
        <div className="bg-red-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/60 text-xs">
          <span className="text-amber-300/80 block text-[10px] uppercase">LUMOS LENGTH CALIPER</span>
          <span className="font-bold text-amber-100 text-base">{lengthCm} cm</span>
        </div>
        <div className="bg-amber-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-yellow-500/60 text-xs">
          <span className="text-yellow-300/80 block text-[10px] uppercase">METATARSAL BALL WIDTH</span>
          <span className="font-bold text-yellow-100 text-base">{widthCm} cm</span>
        </div>
      </div>
    </div>
  );
};
