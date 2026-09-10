import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, Zap, Disc, Camera, RefreshCw, Radio } from 'lucide-react';

interface ThreeSpaceCanvasProps {
  className?: string;
  isHeroMode?: boolean;
  onClose?: () => void;
}

export const ThreeSpaceCanvas: React.FC<ThreeSpaceCanvasProps> = ({
  className = '',
  isHeroMode = false,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [fps, setFps] = useState<number>(60);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [isWarp, setIsWarp] = useState<boolean>(false);
  const [activeSatellite] = useState<string>('SAT-1 (ISRO CARTOSAT-3 / Optical)');

  // State refs for animation loop
  const rotatingRef = useRef(true);
  const pulsingRef = useRef(false);
  const warpRef = useRef(false);
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    rotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    pulsingRef.current = isPulsing;
  }, [isPulsing]);

  useEffect(() => {
    warpRef.current = isWarp;
  }, [isWarp]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    if (!isHeroMode) {
      scene.background = new THREE.Color(0x050510);
      scene.fog = new THREE.FogExp2(0x050510, 0.002);
    }

    // Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);

    if (isHeroMode) {
      // Offset camera in Hero mode to balance Earth on the right, clear safe zone on the left
      camera.position.set(0.8, 1.6, 14.5);
    } else {
      camera.position.set(0, 4, 14);
    }
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: isHeroMode,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isHeroMode ? 1.2 : 1.5;
    if (isHeroMode) {
      renderer.setClearColor(0x000000, 0);
    }
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 35;

    if (isHeroMode) {
      // In hero mode: disable scroll trapping & pan so user can scroll page smoothly
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = false;
      controls.target.set(2.0, 0.2, 0);
    } else {
      controls.target.set(0, 0, 0);
    }
    controlsRef.current = controls;

    // Mouse move parallax listener for hero mode
    const handlePointerMove = (e: MouseEvent) => {
      if (!isHeroMode) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTargetRef.current = { x: nx * 0.4, y: ny * 0.25 };
    };
    if (isHeroMode) {
      window.addEventListener('mousemove', handlePointerMove);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0x222244, isHeroMode ? 0.4 : 0.35));
    const mainLight = new THREE.DirectionalLight(0x4488ff, 2.0);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const pointColors = [0xff00ff, 0x00ffcc, 0xffaa00, 0x4488ff];
    const pointPositions: [number, number, number][] = [
      [-6, 3, 6],
      [6, -3, 6],
      [0, 6, -6],
      [-3, -4, 8]
    ];
    pointColors.forEach((color, i) => {
      const pl = new THREE.PointLight(color, isHeroMode ? 0.5 : 0.8, 22);
      pl.position.set(...pointPositions[i]);
      scene.add(pl);
    });
    scene.add(new THREE.HemisphereLight(0x4488ff, 0x002244, 0.7));

    // Glow Texture Helper
    const createGlowTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 64;
      cvs.height = 64;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(cvs);
    };

    // SYSTEM GROUP (Earth + Satellites)
    // In Hero mode, position on the right side (x = 4.6) to guarantee a pristine text safe-zone on the left
    const systemGroup = new THREE.Group();
    if (isHeroMode) {
      systemGroup.position.set(4.6, 0.4, -1.0);
    } else {
      systemGroup.position.set(0, 0, 0);
    }
    scene.add(systemGroup);

    // Central Earth Hologram Orb
    const earthGroup = new THREE.Group();
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x112244,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0x004488,
      emissiveIntensity: 0.4,
      wireframe: false
    });
    const earthSphere = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), earthMat);
    earthGroup.add(earthSphere);

    // Wireframe grid cage around earth
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      wireframe: true,
      transparent: true,
      opacity: isHeroMode ? 0.14 : 0.18
    });
    const earthWire = new THREE.Mesh(new THREE.SphereGeometry(1.48, 24, 24), wireMat);
    earthGroup.add(earthWire);
    systemGroup.add(earthGroup);

    // 5 Satellites (orbiting around the Earth in systemGroup)
    const satColors = [0x00ffcc, 0xff00ff, 0xffaa00, 0x4488ff, 0x44ff88];
    const satOrbits = [2.2, 3.0, 3.8, 4.6, 5.4];
    const satSpeeds = [0.8, 0.6, 0.45, 0.7, 0.5];

    interface SatItem {
      group: THREE.Group;
      orbit: number;
      speed: number;
      angle: number;
      yOffset: number;
      color: number;
      ring: THREE.Mesh;
    }

    const satellites: SatItem[] = [];

    satColors.forEach((color, idx) => {
      const group = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        emissive: color,
        emissiveIntensity: 0.5
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), bodyMat);
      body.castShadow = true;
      group.add(body);

      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x4488ff,
        metalness: 0.85,
        roughness: 0.15,
        emissive: 0x4488ff,
        emissiveIntensity: 0.35
      });
      const panelGeo = new THREE.BoxGeometry(0.85, 0.03, 0.35);
      const leftPanel = new THREE.Mesh(panelGeo, panelMat);
      leftPanel.position.set(-0.68, 0, 0);
      group.add(leftPanel);

      const rightPanel = new THREE.Mesh(panelGeo, panelMat);
      rightPanel.position.set(0.68, 0, 0);
      group.add(rightPanel);

      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.015, 16, 32), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.05;
      group.add(ring);

      const antMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32), antMat);
      ant.position.set(0, 0.34, 0);
      group.add(ant);

      const angle = (idx / satColors.length) * Math.PI * 2;
      group.position.x = satOrbits[idx] * Math.cos(angle);
      group.position.z = satOrbits[idx] * Math.sin(angle);
      group.position.y = (idx % 2 === 0 ? 1 : -1) * (0.4 + idx * 0.3);
      systemGroup.add(group);

      satellites.push({
        group,
        orbit: satOrbits[idx],
        speed: satSpeeds[idx],
        angle,
        yOffset: group.position.y,
        color,
        ring
      });
    });

    // 5 Outer Planets (Placed far at outer edges: left & right)
    interface PlanetItem {
      group: THREE.Group;
      orbit: number;
      speed: number;
      angle: number;
      yOffset: number;
      color: number;
      planet: THREE.Mesh;
      glow: THREE.Sprite;
    }

    const planets: PlanetItem[] = [];
    const planetData = isHeroMode
      ? [
          { color: 0xff4466, size: 0.6, orbit: 12.5, speed: 0.1, ring: true },
          { color: 0xffaa00, size: 0.75, orbit: 15.0, speed: 0.08, ring: true },
          { color: 0x44ff88, size: 0.45, orbit: 10.5, speed: 0.12, ring: false },
          { color: 0x8844ff, size: 0.55, orbit: 16.5, speed: 0.06, ring: true },
          { color: 0xff44ff, size: 0.4, orbit: 11.0, speed: 0.14, ring: false }
        ]
      : [
          { color: 0xff4466, size: 0.75, orbit: 9, speed: 0.15, ring: true },
          { color: 0xffaa00, size: 0.95, orbit: 11.5, speed: 0.1, ring: true },
          { color: 0x44ff88, size: 0.55, orbit: 7.5, speed: 0.2, ring: false },
          { color: 0x8844ff, size: 0.68, orbit: 14, speed: 0.08, ring: true },
          { color: 0xff44ff, size: 0.48, orbit: 5.8, speed: 0.25, ring: false }
        ];

    planetData.forEach((data, pIdx) => {
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        metalness: 0.3,
        roughness: 0.6,
        emissive: data.color,
        emissiveIntensity: 0.1
      });
      const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), mat);
      planet.castShadow = true;
      group.add(planet);

      if (data.ring) {
        const ringMat = new THREE.MeshStandardMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(data.size * 1.3, data.size * 2.0, 64),
          ringMat
        );
        ring.rotation.x = Math.PI / 2.5;
        ring.rotation.z = 0.3;
        group.add(ring);
      }

      const glowMat = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        blending: THREE.AdditiveBlending,
        opacity: isHeroMode ? 0.2 : 0.3,
        color: data.color
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(data.size * 3.5, data.size * 3.5, 1);
      group.add(glow);

      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        points.push(new THREE.Vector3(data.orbit * Math.cos(a), 0, data.orbit * Math.sin(a)));
      }
      const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
      const pathMat = new THREE.LineBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: isHeroMode ? 0.07 : 0.12
      });
      scene.add(new THREE.Line(pathGeo, pathMat));

      // In hero mode, stagger angles to flank left/right margins and avoid central region
      const angle = (pIdx * (Math.PI * 0.75)) + 0.5;
      group.position.x = data.orbit * Math.cos(angle);
      group.position.z = data.orbit * Math.sin(angle);
      group.position.y = (pIdx % 2 === 0 ? 1 : -1) * 2.2;
      scene.add(group);

      planets.push({
        group,
        orbit: data.orbit,
        speed: data.speed,
        angle,
        yOffset: group.position.y,
        color: data.color,
        planet,
        glow
      });
    });

    // Particle Cloud (reduced in hero mode for clean contrast)
    const particleCount = isHeroMode ? 4000 : 9000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      particlePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.35, 0.8, 0.4 + Math.random() * 0.4);
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: isHeroMode ? 0.05 : 0.07,
      vertexColors: true,
      transparent: true,
      opacity: isHeroMode ? 0.45 : 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Distant Star Field
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 300;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.18,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Shooting Stars
    const shootingStars: THREE.Line[] = [];
    for (let i = 0; i < 12; i++) {
      const length = 0.5 + Math.random() * 1.4;
      const sGeo = new THREE.BufferGeometry();
      const pos = new Float32Array([0, 0, 0, length, 0, 0]);
      sGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const sMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const star = new THREE.Line(sGeo, sMat);
      star.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 60
      );
      star.rotation.z = Math.random() * Math.PI * 2;
      star.userData = {
        speed: 0.02 + Math.random() * 0.05,
        phase: Math.random() * 100,
        length
      };
      scene.add(star);
      shootingStars.push(star);
    }

    // Animation Loop
    const clock = new THREE.Clock();
    let pulsePhase = 0;
    let warpPhase = 0;
    let lastFpsUpdate = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (time - lastFpsUpdate > 0.5) {
        lastFpsUpdate = time;
        if (delta > 0) {
          setFps(Math.min(60, Math.round(1 / delta)));
        }
      }

      // Parallax smooth lerp in hero mode
      if (isHeroMode) {
        scene.rotation.y += (mouseTargetRef.current.x - scene.rotation.y) * 0.03;
        scene.rotation.x += (mouseTargetRef.current.y - scene.rotation.x) * 0.03;
      }

      // Rotate Earth sphere
      earthSphere.rotation.y += 0.003;
      earthWire.rotation.y -= 0.002;
      earthWire.rotation.x += 0.001;

      if (rotatingRef.current) {
        satellites.forEach((s, i) => {
          s.angle += s.speed * 0.01;
          s.group.position.x = s.orbit * Math.cos(s.angle);
          s.group.position.z = s.orbit * Math.sin(s.angle);
          s.group.position.y = s.yOffset + Math.sin(time * s.speed + i) * 0.6;
          s.group.rotation.y += 0.012;
          s.group.rotation.x = Math.sin(time * 0.5 + i) * 0.1;
          if (s.ring && (s.ring.material as THREE.MeshStandardMaterial)) {
            (s.ring.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(time * 2 + i) * 0.2;
          }
        });
      }

      planets.forEach((p, i) => {
        p.angle += p.speed * 0.005;
        p.group.position.x = p.orbit * Math.cos(p.angle);
        p.group.position.z = p.orbit * Math.sin(p.angle);
        p.group.position.y = p.yOffset + Math.sin(time * p.speed + i) * 0.4;
        p.group.rotation.y += 0.005;
        p.planet.rotation.x = Math.sin(time * 0.3 + i) * 0.1;
        if (p.glow) {
          const pulse = 1 + Math.sin(time * 0.5 + i) * 0.15;
          p.glow.scale.set(
            p.glow.scale.x * (1 + (pulse - 1) * 0.01),
            p.glow.scale.y * (1 + (pulse - 1) * 0.01),
            1
          );
        }
      });

      if (pulsingRef.current) {
        pulsePhase += 0.05;
        const pulse = 1 + Math.sin(pulsePhase) * 0.18;
        satellites.forEach((s) => s.group.scale.set(pulse, pulse, pulse));
      } else {
        satellites.forEach((s) => s.group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05));
      }

      if (warpRef.current) {
        warpPhase += 0.03;
        const speed = 1 + Math.sin(warpPhase * 2) * 0.5;
        satellites.forEach((s) => {
          s.angle += s.speed * 0.05 * speed;
          s.group.position.x = s.orbit * Math.cos(s.angle);
          s.group.position.z = s.orbit * Math.sin(s.angle);
        });
        particles.rotation.y += 0.02 * speed;
        particles.rotation.x += 0.01 * speed;
        camera.position.x += (Math.random() - 0.5) * 0.03;
        camera.position.y += (Math.random() - 0.5) * 0.03;
      } else {
        particles.rotation.y += 0.0004;
        particles.rotation.x += 0.0001;
      }

      shootingStars.forEach((star) => {
        const phase = (time * star.userData.speed + star.userData.phase) % 1;
        const mat = star.material as THREE.LineBasicMaterial;
        if (phase < 0.05) {
          mat.opacity = 0.8;
          star.position.x = (Math.random() - 0.5) * 60;
          star.position.y = (Math.random() - 0.5) * 30;
          star.position.z = (Math.random() - 0.5) * 60;
        } else if (phase < 0.3) {
          mat.opacity = (1 - (phase - 0.05) / 0.25) * 0.8;
          star.position.x += Math.cos(star.rotation.z) * 0.4;
          star.position.y += Math.sin(star.rotation.z) * 0.4;
        } else {
          mat.opacity = 0;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW && newH && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Keyboard controls for Lab mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHeroMode) return;
      if (e.key === 'r' || e.key === 'R') setIsRotating((prev) => !prev);
      if (e.key === 'p' || e.key === 'P') setIsPulsing((prev) => !prev);
      if (e.key === 'w' || e.key === 'W') setIsWarp((prev) => !prev);
      if (e.key === 'd' || e.key === 'D') downloadScreenshot();
      if (e.key === ' ') {
        e.preventDefault();
        resetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (isHeroMode) {
        window.removeEventListener('mousemove', handlePointerMove);
      }
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isHeroMode]);

  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      if (isHeroMode) {
        cameraRef.current.position.set(0.8, 1.6, 14.5);
        controlsRef.current.target.set(2.0, 0.2, 0);
      } else {
        cameraRef.current.position.set(0, 4, 14);
        controlsRef.current.target.set(0, 0, 0);
      }
      controlsRef.current.update();
    }
  };

  const downloadScreenshot = () => {
    if (!rendererRef.current) return;
    const link = document.createElement('a');
    link.download = `satquery_3d_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = rendererRef.current.domElement.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${isHeroMode ? 'bg-transparent' : 'bg-[#050510]'} ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full ${isHeroMode ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* ONLY RENDER FULL HUD CONTROLS IN LAB MODE (isHeroMode === false) */}
      {!isHeroMode && (
        <>
          {/* Top HUD */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ffcc] animate-pulse" />
              <h2 className="text-xl md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] via-[#ff00ff] to-[#ffaa00] font-mono">
                SATQUERY 3D SPACE LAB
              </h2>
            </div>
            <div className="text-[11px] text-cyan-300/70 tracking-widest font-mono flex items-center gap-2">
              <span>ISRO &bull; CARTOSAT-3 &bull; SENTINEL-1/2 ORBIT SIMULATOR</span>
            </div>
            <div className="text-[10px] text-cyan-400/50 font-mono">
              SIH 2026 SPECIALIST GEO-AI ARCHITECTURE
            </div>
          </div>

          {/* Top Right Stats & FPS */}
          <div className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-black/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>{fps} FPS</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
              >
                Exit 3D View
              </button>
            )}
          </div>

          {/* Satellite Telemetry Pill on Left */}
          <div className="hidden md:flex absolute top-24 left-4 z-20 pointer-events-auto flex-col gap-1 p-3 rounded-xl bg-black/70 border border-cyan-500/20 backdrop-blur-md max-w-xs text-xs font-mono">
            <div className="flex items-center justify-between text-cyan-300 text-[10px] uppercase font-bold border-b border-white/10 pb-1">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Simulated Telemetry
              </span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div className="text-white/90 text-[11px] font-semibold mt-1">{activeSatellite}</div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-white/60 mt-1">
              <div>Altitude: <span className="text-cyan-300">505 km LEO</span></div>
              <div>Velocity: <span className="text-cyan-300">7.6 km/s</span></div>
              <div>Inclination: <span className="text-cyan-300">97.4° SSO</span></div>
              <div>Sensors: <span className="text-amber-300">Optical + SAR</span></div>
            </div>
          </div>

          {/* Bottom Floating Interactive Controls Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 md:gap-3 p-2 md:px-5 md:py-2.5 rounded-full bg-black/85 border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex-wrap justify-center">
            <button
              onClick={() => setIsRotating((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                isRotating
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                  : 'border-white/20 text-white/50 hover:text-white hover:border-white/40'
              }`}
              title="Toggle Orbit Rotation (Press R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </button>

            <button
              onClick={() => setIsPulsing((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                isPulsing
                  ? 'border-fuchsia-400 text-fuchsia-300 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(232,121,249,0.2)]'
                  : 'border-white/20 text-white/50 hover:text-white hover:border-white/40'
              }`}
              title="Toggle Pulse Effect (Press P)"
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Pulse</span>
            </button>

            <button
              onClick={() => setIsWarp((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                isWarp
                  ? 'border-amber-400 bg-amber-400 text-black font-bold shadow-[0_0_25px_rgba(251,191,36,0.5)]'
                  : 'border-amber-400/60 text-amber-300 hover:bg-amber-400/20'
              }`}
              title="Toggle Warp Speed Mode (Press W)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isWarp ? '⚡ Warp ON' : '⚡ Warp'}</span>
            </button>

            <button
              onClick={resetView}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/20 transition-colors"
              title="Reset Camera Target (Press Space)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={downloadScreenshot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-fuchsia-300 border border-fuchsia-500/50 hover:bg-fuchsia-500/20 transition-colors"
              title="Capture High-Res PNG (Press D)"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture</span>
            </button>
          </div>

          {/* Drag & Zoom Info Helper */}
          <div className="hidden lg:block absolute bottom-6 right-6 z-20 pointer-events-none text-right font-mono text-[10px] text-white/30 tracking-widest leading-relaxed">
            <div>DRAG TO ROTATE &bull; SCROLL TO ZOOM</div>
            <div>[R] Rotate &bull; [P] Pulse &bull; [W] Warp &bull; [SPACE] Reset</div>
          </div>
        </>
      )}
    </div>
  );
};
