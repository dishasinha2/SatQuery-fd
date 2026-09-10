import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useTheme } from '../context/ThemeContext';

interface SatelliteData {
  group: THREE.Group;
  orbit: number;
  speed: number;
  angle: number;
  yOffset: number;
  color: number;
  ring: THREE.Mesh;
}

interface PlanetData {
  group: THREE.Group;
  orbit: number;
  speed: number;
  angle: number;
  yOffset: number;
  color: number;
  planet: THREE.Mesh;
  glow: THREE.Sprite;
}

export const CosmicBackground: React.FC = () => {
  const { isDarkMode } = useTheme();

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
  const [showControls, setShowControls] = useState<boolean>(true);

  // Mutable state for the animation loop
  const rotatingRef = useRef(true);
  const pulsingRef = useRef(false);
  const warpRef = useRef(false);
  const pulsePhaseRef = useRef(0);
  const warpPhaseRef = useRef(0);

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

    // Helper: Glow texture for planets
    function createGlowTexture(): THREE.CanvasTexture {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    }
    const glowTexture = createGlowTexture();

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    if (isDarkMode) {
      // Dark Mode Palette
      scene.background = new THREE.Color(0x050510);
      scene.fog = new THREE.FogExp2(0x050510, 0.002);
    } else {
      // Light Mode Palette (exact values from provided light mode code)
      scene.background = new THREE.Color(0xe8f0fe);
      scene.fog = new THREE.FogExp2(0xe8f0fe, 0.0015);
    }

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 14);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDarkMode ? 1.5 : 1.2;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 35;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Lights
    if (isDarkMode) {
      scene.add(new THREE.AmbientLight(0x222244, 0.3));
      const mainLight = new THREE.DirectionalLight(0x4488ff, 2);
      mainLight.position.set(5, 10, 7);
      mainLight.castShadow = true;
      scene.add(mainLight);

      const lightColors = [0xff00ff, 0x00ffcc, 0xffaa00, 0x4488ff];
      const lightPositions: [number, number, number][] = [
        [-6, 3, 6],
        [6, -3, 6],
        [0, 6, -6],
        [-3, -4, 8]
      ];
      lightColors.forEach((color, i) => {
        const pLight = new THREE.PointLight(color, 0.8, 20);
        pLight.position.set(...lightPositions[i]);
        scene.add(pLight);
      });
      scene.add(new THREE.HemisphereLight(0x4488ff, 0x002244, 0.8));
    } else {
      // Light Mode Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
      mainLight.position.set(5, 10, 7);
      mainLight.castShadow = true;
      scene.add(mainLight);

      const colors = [0x7209b7, 0x0077b6, 0xf77f00, 0x3a86ff];
      const positions: [number, number, number][] = [
        [-6, 3, 6],
        [6, -3, 6],
        [0, 6, -6],
        [-3, -4, 8]
      ];
      colors.forEach((c, i) => {
        const light = new THREE.PointLight(c, 0.5, 25);
        light.position.set(...positions[i]);
        scene.add(light);
      });
      scene.add(new THREE.HemisphereLight(0xffffff, 0xccddee, 0.8));
    }

    // 6. Create Satellites (5 orbital satellites)
    const satellites: SatelliteData[] = [];
    const satColors = isDarkMode
      ? [0x00ffcc, 0xff00ff, 0xffaa00, 0x4488ff, 0x44ff88]
      : [0x0077b6, 0x7209b7, 0xf77f00, 0x3a86ff, 0x06d6a0];
    const satOrbits = [1.8, 2.8, 3.8, 4.8, 5.8];
    const satSpeeds = [0.8, 0.6, 0.4, 0.7, 0.5];

    satColors.forEach((color, idx) => {
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: isDarkMode ? 0.9 : 0.7,
        roughness: isDarkMode ? 0.1 : 0.2,
        emissive: color,
        emissiveIntensity: isDarkMode ? 0.5 : 0.2
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), bodyMat);
      body.castShadow = true;
      group.add(body);

      const panelMat = new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x4488ff : 0x3a86ff,
        metalness: isDarkMode ? 0.8 : 0.6,
        roughness: isDarkMode ? 0.2 : 0.3,
        emissive: isDarkMode ? 0x4488ff : 0x3a86ff,
        emissiveIntensity: isDarkMode ? 0.3 : 0.15
      });
      const panelGeo = new THREE.BoxGeometry(1.0, 0.03, 0.4);
      const left = new THREE.Mesh(panelGeo, panelMat);
      left.position.set(-0.8, 0, 0);
      group.add(left);

      const right = new THREE.Mesh(panelGeo, panelMat);
      right.position.set(0.8, 0, 0);
      group.add(right);

      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: isDarkMode ? 0.8 : 0.4,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.015, 16, 32), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.05;
      group.add(ring);

      const antMat = new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0xffffff : 0x333333,
        metalness: isDarkMode ? 0.9 : 0.7,
        roughness: isDarkMode ? 0.1 : 0.2
      });
      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.3), antMat);
      ant.position.set(0, 0.4, 0);
      group.add(ant);

      const angle = (idx / satColors.length) * Math.PI * 2;
      group.position.x = satOrbits[idx] * Math.cos(angle);
      group.position.z = satOrbits[idx] * Math.sin(angle);
      group.position.y = (Math.random() - 0.5) * 1.5;
      scene.add(group);

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

    // 7. Create Planets (5 orbital celestial bodies)
    const planets: PlanetData[] = [];
    const planetData = isDarkMode
      ? [
          { color: 0xff4466, size: 0.8, orbit: 9, speed: 0.15, ring: true },
          { color: 0xffaa00, size: 1.0, orbit: 11, speed: 0.10, ring: true },
          { color: 0x44ff88, size: 0.6, orbit: 7, speed: 0.20, ring: false },
          { color: 0x8844ff, size: 0.7, orbit: 13, speed: 0.08, ring: true },
          { color: 0xff44ff, size: 0.5, orbit: 5, speed: 0.25, ring: false }
        ]
      : [
          { color: 0xff6b6b, size: 0.8, orbit: 9, speed: 0.15, ring: true },
          { color: 0xf77f00, size: 1.0, orbit: 11, speed: 0.10, ring: true },
          { color: 0x06d6a0, size: 0.6, orbit: 7, speed: 0.20, ring: false },
          { color: 0x7209b7, size: 0.7, orbit: 13, speed: 0.08, ring: true },
          { color: 0xff70a6, size: 0.5, orbit: 5, speed: 0.25, ring: false }
        ];

    planetData.forEach((data) => {
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        metalness: isDarkMode ? 0.3 : 0.2,
        roughness: isDarkMode ? 0.6 : 0.7,
        emissive: data.color,
        emissiveIntensity: isDarkMode ? 0.1 : 0.05
      });
      const planet = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), mat);
      planet.castShadow = true;
      group.add(planet);

      if (data.ring) {
        const ringMat = new THREE.MeshStandardMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: isDarkMode ? 0.2 : 0.1,
          transparent: true,
          opacity: isDarkMode ? 0.3 : 0.25,
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
        map: glowTexture,
        blending: THREE.AdditiveBlending,
        opacity: isDarkMode ? 0.3 : 0.15,
        color: data.color
      });
      const glow = new THREE.Sprite(glowMat);
      glow.scale.set(data.size * 4, data.size * 4, 1);
      group.add(glow);

      // Planetary orbit path
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(data.orbit * Math.cos(a), 0, data.orbit * Math.sin(a)));
      }
      const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
      const pathMat = new THREE.LineBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: isDarkMode ? 0.1 : 0.15
      });
      scene.add(new THREE.Line(pathGeo, pathMat));

      const angle = Math.random() * Math.PI * 2;
      group.position.x = data.orbit * Math.cos(angle);
      group.position.z = data.orbit * Math.sin(angle);
      group.position.y = (Math.random() - 0.5) * 1.0;
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

    // 8. Create Particles (12,000 colorful cosmic particles)
    const particleCount = 12000;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 8 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      pPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const c = new THREE.Color().setHSL(
        0.55 + Math.random() * 0.35,
        0.7,
        isDarkMode ? 0.4 + Math.random() * 0.3 : 0.5 + Math.random() * 0.3
      );
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: isDarkMode ? 0.08 : 0.07,
      vertexColors: true,
      transparent: true,
      opacity: isDarkMode ? 0.8 : 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 9. Create Starfield (3,000 background stars)
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 300;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMat = new THREE.PointsMaterial({
      color: isDarkMode ? 0xffffff : 0x555555,
      size: isDarkMode ? 0.2 : 0.15,
      transparent: true,
      opacity: isDarkMode ? 0.7 : 0.4,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 10. Create Shooting Stars (20 dynamic shooting stars)
    const shootingStars: THREE.Line[] = [];
    for (let i = 0; i < 20; i++) {
      const length = 0.5 + Math.random() * 1.5;
      const sGeo = new THREE.BufferGeometry();
      const sPos = new Float32Array([0, 0, 0, length, 0, 0]);
      sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));

      const sMat = new THREE.LineBasicMaterial({
        color: isDarkMode ? 0x00ffff : 0x888888,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });

      const sStar = new THREE.Line(sGeo, sMat);
      sStar.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 60
      );
      sStar.rotation.z = Math.random() * Math.PI * 2;
      sStar.userData = {
        speed: 0.02 + Math.random() * 0.06,
        phase: Math.random() * 100,
        length
      };

      scene.add(sStar);
      shootingStars.push(sStar);
    }

    // 11. Responsive resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Main animation render loop
    const clock = new THREE.Clock();
    let lastFpsUpdate = 0;
    let frames = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      // FPS tracking
      frames++;
      if (time - lastFpsUpdate > 0.5) {
        setFps(Math.round(frames / (time - lastFpsUpdate)));
        frames = 0;
        lastFpsUpdate = time;
      }

      // Rotate satellites & planets
      if (rotatingRef.current) {
        satellites.forEach((s, i) => {
          s.angle += s.speed * 0.01;
          s.group.position.x = s.orbit * Math.cos(s.angle);
          s.group.position.z = s.orbit * Math.sin(s.angle);
          s.group.position.y = s.yOffset + Math.sin(time * s.speed + i) * 1.0;
          s.group.rotation.y += 0.01;
          s.group.rotation.x = Math.sin(time * 0.5 + i) * 0.1;

          if (s.ring) {
            (s.ring.material as THREE.MeshStandardMaterial).opacity =
              0.3 + Math.sin(time * 2 + i) * 0.2;
          }
        });

        planets.forEach((p, i) => {
          p.angle += p.speed * 0.005;
          p.group.position.x = p.orbit * Math.cos(p.angle);
          p.group.position.z = p.orbit * Math.sin(p.angle);
          p.group.position.y = p.yOffset + Math.sin(time * p.speed + i) * 0.5;
          p.group.rotation.y += 0.005;
          p.planet.rotation.x = Math.sin(time * 0.3 + i) * 0.1;

          if (p.glow) {
            const pulse = 1 + Math.sin(time * 0.5 + i) * 0.2;
            p.glow.scale.set(
              p.glow.scale.x * (1 + (pulse - 1) * 0.01),
              p.glow.scale.y * (1 + (pulse - 1) * 0.01),
              1
            );
          }
        });
      }

      // Pulsing effect
      if (pulsingRef.current) {
        pulsePhaseRef.current += 0.05;
        const pulse = 1 + Math.sin(pulsePhaseRef.current) * 0.15;
        satellites.forEach((s) => s.group.scale.set(pulse, pulse, pulse));
      } else {
        satellites.forEach((s) =>
          s.group.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05)
        );
      }

      // Warp effect
      if (warpRef.current) {
        warpPhaseRef.current += 0.03;
        const speed = 1 + Math.sin(warpPhaseRef.current * 2) * 0.5;
        satellites.forEach((s) => {
          s.angle += s.speed * 0.05 * speed;
          s.group.position.x = s.orbit * Math.cos(s.angle);
          s.group.position.z = s.orbit * Math.sin(s.angle);
        });

        if (particles) {
          particles.rotation.y += 0.02 * speed;
          particles.rotation.x += 0.01 * speed;
        }

        camera.position.x += (Math.random() - 0.5) * 0.02;
        camera.position.y += (Math.random() - 0.5) * 0.02;
      } else {
        if (particles) {
          particles.rotation.y += 0.0005;
          particles.rotation.x += 0.0002;
        }
      }

      // Shooting stars animation
      shootingStars.forEach((star) => {
        const sPhase = (time * star.userData.speed + star.userData.phase) % 1;
        if (sPhase < 0.05) {
          (star.material as THREE.LineBasicMaterial).opacity = 1;
          star.position.x = (Math.random() - 0.5) * 60;
          star.position.y = (Math.random() - 0.5) * 30;
          star.position.z = (Math.random() - 0.5) * 60;
        } else if (sPhase < 0.3) {
          (star.material as THREE.LineBasicMaterial).opacity =
            1 - (sPhase - 0.05) / 0.25;
          star.position.x += Math.cos(star.rotation.z) * 0.5;
          star.position.y += Math.sin(star.rotation.z) * 0.5;
        } else {
          (star.material as THREE.LineBasicMaterial).opacity = 0;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 13. Keyboard controls listener
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in form inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        setIsRotating((prev) => !prev);
      }
      if (e.key === 'p' || e.key === 'P') {
        setIsPulsing((prev) => !prev);
      }
      if (e.key === 'w' || e.key === 'W') {
        setIsWarp((prev) => !prev);
      }
      if (e.key === 'd' || e.key === 'D') {
        triggerScreenshot();
      }
      if (e.key === ' ') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [isDarkMode]);

  const handleToggleRotate = () => {
    setIsRotating((prev) => !prev);
  };

  const handleTogglePulse = () => {
    setIsPulsing((prev) => !prev);
  };

  const handleToggleWarp = () => {
    setIsWarp((prev) => !prev);
  };

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 4, 14);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const triggerScreenshot = () => {
    if (!rendererRef.current) return;
    const link = document.createElement('a');
    link.download = `satquery_3d_${isDarkMode ? 'dark' : 'light'}_${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    link.href = rendererRef.current.domElement.toDataURL('image/png');
    link.click();
  };

  return (
    <>
      {/* 3D WebGL Canvas Layer - Fixed full-viewport behind all content */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 pointer-events-auto overflow-hidden select-none"
        style={{ touchAction: 'none' }}
      />

      {/* Atmospheric Veil Layer - Subtle directional gradients: left darker for readability, center mostly transparent, subtle edge vignette */}
      <div
        className={`fixed inset-0 z-[1] pointer-events-none transition-all duration-500 ${
          isDarkMode
            ? 'bg-[linear-gradient(to_right,rgba(5,10,24,0.42)_0%,rgba(5,10,24,0.18)_260px,rgba(5,10,24,0.03)_500px,transparent_800px),radial-gradient(ellipse_at_50%_50%,transparent_50%,rgba(5,9,20,0.12)_75%,rgba(5,9,20,0.32)_100%)]'
            : 'bg-[linear-gradient(to_right,rgba(232,240,254,0.38)_0%,rgba(232,240,254,0.15)_260px,transparent_600px),radial-gradient(ellipse_at_50%_50%,transparent_60%,rgba(200,215,240,0.10)_80%,rgba(185,205,235,0.22)_100%)]'
        }`}
      />

      {/* Floating 3D Space Controls Bar (matching user's controls for Dark and Light mode) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 pointer-events-auto">
        {showControls && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] transition-all ${
              isDarkMode
                ? 'bg-black/80 backdrop-blur-xl border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
                : 'bg-white/85 backdrop-blur-xl border border-[#0077b6]/25 shadow-[0_8px_32px_rgba(0,0,0,0.08)]'
            }`}
          >
            <button
              onClick={handleToggleRotate}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                isRotating
                  ? 'border-[#f77f00] text-[#f77f00] shadow-[0_0_12px_rgba(247,127,0,0.3)] bg-[#f77f00]/10'
                  : isDarkMode
                  ? 'border-slate-700 text-slate-500 hover:border-slate-500'
                  : 'border-slate-300 text-slate-400 hover:border-slate-500'
              }`}
              style={{
                borderColor: isRotating ? '#f77f00' : isDarkMode ? '#334155' : '#cbd5e1',
                color: isRotating ? '#f77f00' : isDarkMode ? '#64748b' : '#94a3b8'
              }}
              title="Toggle Satellite & Planet Rotation (R)"
            >
              ⟳ ROTATE
            </button>

            <button
              onClick={handleTogglePulse}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                isPulsing
                  ? 'border-[#7209b7] text-[#7209b7] shadow-[0_0_12px_rgba(114,9,183,0.3)] bg-[#7209b7]/10'
                  : isDarkMode
                  ? 'border-slate-700 text-slate-500 hover:border-slate-500'
                  : 'border-slate-300 text-slate-400 hover:border-slate-500'
              }`}
              style={{
                borderColor: isPulsing ? '#7209b7' : isDarkMode ? '#334155' : '#cbd5e1',
                color: isPulsing ? '#7209b7' : isDarkMode ? '#64748b' : '#94a3b8'
              }}
              title="Toggle Celestial Pulse (P)"
            >
              ◉ PULSE
            </button>

            <button
              onClick={handleToggleWarp}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                isWarp
                  ? 'border-[#f77f00] bg-[#f77f00] text-white shadow-[0_0_20px_rgba(247,127,0,0.4)]'
                  : 'border-[#f77f00] text-[#f77f00] hover:bg-[#f77f00]/15'
              }`}
              title="Toggle Hyperspace Warp Speed (W)"
            >
              {isWarp ? '⚡ WARP ON' : '⚡ WARP'}
            </button>

            <button
              onClick={handleReset}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                isDarkMode
                  ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black'
                  : 'border-[#0077b6] text-[#0077b6] hover:bg-[#0077b6] hover:text-white'
              }`}
              title="Reset Camera View (Space)"
            >
              ⟲ RESET
            </button>

            <button
              onClick={triggerScreenshot}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                isDarkMode
                  ? 'border-fuchsia-400 text-fuchsia-400 hover:bg-fuchsia-400 hover:text-black'
                  : 'border-[#7209b7] text-[#7209b7] hover:bg-[#7209b7] hover:text-white'
              }`}
              title="Capture 3D View (D)"
            >
              ⬇ CAPTURE
            </button>

            <div
              className={`h-4 w-[1px] mx-1 hidden sm:block ${
                isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
              }`}
            />

            {/* FPS and Hint */}
            <div
              className={`text-[10px] font-mono hidden md:flex items-center gap-2 ${
                isDarkMode ? 'text-cyan-400/80' : 'text-[#0077b6]'
              }`}
            >
              <span
                className={`font-bold ${
                  isDarkMode ? 'text-emerald-400' : 'text-[#0077b6]'
                }`}
              >
                ⚡ {fps} FPS
              </span>
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>|</span>
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                🖱 Drag 3D cosmos
              </span>
            </div>

            <button
              onClick={() => setShowControls(false)}
              className={`ml-1 text-xs cursor-pointer ${
                isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Minimize space dock"
            >
              ✕
            </button>
          </div>
        )}

        {!showControls && (
          <button
            onClick={() => setShowControls(true)}
            className={`px-3 py-1 rounded-full backdrop-blur-md text-[10px] font-mono transition-all cursor-pointer shadow-lg ${
              isDarkMode
                ? 'bg-black/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/60'
                : 'bg-white/90 border border-[#0077b6]/30 text-[#0077b6] hover:bg-sky-50'
            }`}
          >
            🚀 3D Space Controls
          </button>
        )}
      </div>
    </>
  );
};
