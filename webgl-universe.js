// WebGL Solar System Engine with Google Earth-grade smooth OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(function() {
  'use strict';

  // --- Planetary Specifications ---
  const PLANET_CONFIG = {
    sun: {
      name: 'Sun',
      radius: 14.0,
      dist: 0,
      orbitSpeed: 0,
      rotSpeed: 0.001,
      color: 0xffaa00,
      emissive: true
    },
    mercury: {
      name: 'Mercury',
      radius: 1.2,
      dist: 28,
      orbitSpeed: 0.04,
      rotSpeed: 0.004,
      color: 0x9e9e9e
    },
    venus: {
      name: 'Venus',
      radius: 2.2,
      dist: 42,
      orbitSpeed: 0.015,
      rotSpeed: -0.002, // retrograde
      color: 0xe0a96d
    },
    earth: {
      name: 'Earth',
      radius: 2.4,
      dist: 60,
      orbitSpeed: 0.01,
      rotSpeed: 0.02,
      color: 0x2196f3,
      hasClouds: true,
      hasMoon: true
    },
    mars: {
      name: 'Mars',
      radius: 1.5,
      dist: 80,
      orbitSpeed: 0.008,
      rotSpeed: 0.018,
      color: 0xc1440e
    },
    jupiter: {
      name: 'Jupiter',
      radius: 6.5,
      dist: 120,
      orbitSpeed: 0.002,
      rotSpeed: 0.04,
      color: 0xd4a373
    },
    saturn: {
      name: 'Saturn',
      radius: 5.2,
      dist: 165,
      orbitSpeed: 0.0009,
      rotSpeed: 0.038,
      color: 0xf4e04d,
      hasRing: true
    },
    uranus: {
      name: 'Uranus',
      radius: 3.5,
      dist: 215,
      orbitSpeed: 0.0004,
      rotSpeed: 0.03,
      color: 0x70d6ff
    },
    neptune: {
      name: 'Neptune',
      radius: 3.4,
      dist: 265,
      orbitSpeed: 0.0002,
      rotSpeed: 0.032,
      color: 0x3a86ff
    }
  };

  // --- Procedural Canvas Textures ---
  function createSunTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ff9900');
    grad.addColorStop(0.5, '#ffcc00');
    grad.addColorStop(1, '#ff6600');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Solar flares/granulation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 400; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 12 + 4, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createEarthTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    // Deep ocean blue
    ctx.fillStyle = '#103060';
    ctx.fillRect(0, 0, 1024, 512);

    // Continents
    ctx.fillStyle = '#2d6a4f';
    const drawLand = (x, y, w, h) => {
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    // Eurasia / Africa
    drawLand(550, 200, 160, 90);
    drawLand(520, 320, 80, 110);
    // Americas
    drawLand(220, 180, 70, 80);
    drawLand(260, 330, 60, 110);
    // Australia
    drawLand(750, 370, 50, 40);

    // Polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 35);
    ctx.fillRect(0, 480, 1024, 32);

    return new THREE.CanvasTexture(c);
  }

  function createEarthCloudTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 1024, 512);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 70 + 30, Math.random() * 20 + 10, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createMarsTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    // Rust red
    ctx.fillStyle = '#c1440e';
    ctx.fillRect(0, 0, 1024, 512);
    // Dark maria
    ctx.fillStyle = '#6e260e';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 90 + 30, Math.random() * 40 + 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // White ice caps
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 1024, 25);
    ctx.fillRect(0, 490, 1024, 22);
    return new THREE.CanvasTexture(c);
  }

  function createJupiterTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    // Banded atmosphere
    const bands = ['#d4a373', '#faedcd', '#bc6c25', '#dda15e', '#bb9457', '#e9d8a6', '#99582a'];
    const h = 512 / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, i * h, 1024, h);
    });
    // Great Red Spot
    ctx.fillStyle = '#a83232';
    ctx.beginPath();
    ctx.ellipse(650, 330, 45, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }

  function createSaturnTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    const bands = ['#e9d8a6', '#ee9b00', '#eed9c4', '#e29578', '#f3c053', '#e0cfb3'];
    const h = 512 / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, i * h, 1024, h);
    });
    return new THREE.CanvasTexture(c);
  }

  function createSaturnRingTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(238, 217, 196, 0.1)');
    grad.addColorStop(0.3, 'rgba(238, 217, 196, 0.8)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)'); // Cassini division
    grad.addColorStop(0.7, 'rgba(212, 163, 115, 0.7)');
    grad.addColorStop(1, 'rgba(212, 163, 115, 0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 64);
    return new THREE.CanvasTexture(c);
  }

  function createGenericTexture(colorHex) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(0, Math.random() * 256, 512, Math.random() * 15 + 5);
    }
    return new THREE.CanvasTexture(c);
  }

  // --- Main Engine ---
  class SolarSystemViewer {
    constructor() {
      this.container = document.getElementById('universe');
      if (!this.container) return;

      this.planets = {};
      this.currentFocus = 'sun';
      this.timeSpeed = 1.0;
      this.isPaused = false;
      this.cameraTarget = new THREE.Vector3(0, 0, 0);

      this.initScene();
      this.initStars();
      this.initSun();
      this.initPlanets();
      this.initOrbits();
      this.initControls();
      this.bindEvents();

      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initScene() {
      // Create high-performance WebGL renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;

      this.canvas = this.renderer.domElement;
      this.canvas.id = 'webgl-canvas';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '0';
      this.container.appendChild(this.canvas);

      // Hide CSS 3D solar system element so WebGL takes over with 60 FPS stability
      const cssGalaxy = document.getElementById('galaxy');
      if (cssGalaxy) {
        cssGalaxy.style.display = 'none';
      }

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 8000);
      this.camera.position.set(0, 90, 160);

      // Ambient light for dark side of planets
      this.ambientLight = new THREE.AmbientLight(0x333344, 0.4);
      this.scene.add(this.ambientLight);

      // Sun Point Light
      this.sunLight = new THREE.PointLight(0xffffff, 2.5, 0, 0);
      this.sunLight.position.set(0, 0, 0);
      this.scene.add(this.sunLight);
    }

    initStars() {
      // 2500 high-stability background stars
      const starCount = 2500;
      const starGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        const r = 2500 + Math.random() * 1000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        const brightness = 0.5 + Math.random() * 0.5;
        colors[i] = brightness;
        colors[i + 1] = brightness;
        colors[i + 2] = brightness * (0.8 + Math.random() * 0.4);
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const starMat = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85
      });

      this.stars = new THREE.Points(starGeo, starMat);
      this.scene.add(this.stars);
    }

    initSun() {
      const sunGeo = new THREE.SphereGeometry(PLANET_CONFIG.sun.radius, 48, 48);
      const sunTex = createSunTexture();
      const sunMat = new THREE.MeshBasicMaterial({
        map: sunTex,
        color: 0xffe066
      });

      this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
      this.scene.add(this.sunMesh);

      // Glowing Corona
      const coronaGeo = new THREE.SphereGeometry(PLANET_CONFIG.sun.radius * 1.15, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide
      });
      this.coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      this.scene.add(this.coronaMesh);

      this.planets.sun = {
        mesh: this.sunMesh,
        angle: 0,
        config: PLANET_CONFIG.sun,
        pivot: new THREE.Group()
      };
    }

    initPlanets() {
      const geoDetail = 40;

      Object.keys(PLANET_CONFIG).forEach(id => {
        if (id === 'sun') return;
        const cfg = PLANET_CONFIG[id];

        // Orbit pivot
        const pivot = new THREE.Group();
        this.scene.add(pivot);

        // Planet mesh
        const geo = new THREE.SphereGeometry(cfg.radius, geoDetail, geoDetail);
        let tex;
        if (id === 'earth') tex = createEarthTexture();
        else if (id === 'mars') tex = createMarsTexture();
        else if (id === 'jupiter') tex = createJupiterTexture();
        else if (id === 'saturn') tex = createSaturnTexture();
        else if (id === 'mercury') tex = createGenericTexture('#9e9e9e');
        else if (id === 'venus') tex = createGenericTexture('#e0a96d');
        else if (id === 'uranus') tex = createGenericTexture('#70d6ff');
        else if (id === 'neptune') tex = createGenericTexture('#3a86ff');

        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.8,
          metalness: 0.1
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(cfg.dist, 0, 0);
        pivot.add(mesh);

        // Earth Clouds
        let cloudsMesh = null;
        if (cfg.hasClouds) {
          const cloudsGeo = new THREE.SphereGeometry(cfg.radius * 1.025, geoDetail, geoDetail);
          const cloudsMat = new THREE.MeshStandardMaterial({
            map: createEarthCloudTexture(),
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
          });
          cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
          mesh.add(cloudsMesh);
        }

        // Earth Moon
        let moonMesh = null;
        if (cfg.hasMoon) {
          const moonGeo = new THREE.SphereGeometry(0.55, 20, 20);
          const moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 });
          moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.set(5.0, 0, 0);
          mesh.add(moonMesh);
        }

        // Saturn Rings
        let ringMesh = null;
        if (cfg.hasRing) {
          const ringGeo = new THREE.RingGeometry(cfg.radius * 1.3, cfg.radius * 2.3, 64);
          const ringMat = new THREE.MeshStandardMaterial({
            map: createSaturnRingTexture(),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.88,
            roughness: 0.7
          });
          ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI * 0.45;
          mesh.add(ringMesh);
        }

        this.planets[id] = {
          pivot,
          mesh,
          cloudsMesh,
          moonMesh,
          angle: Math.random() * Math.PI * 2,
          config: cfg
        };
      });
    }

    initOrbits() {
      // Subtle elegant orbit lines matching original AndyMagwayer aesthetic
      Object.keys(PLANET_CONFIG).forEach(id => {
        if (id === 'sun') return;
        const dist = PLANET_CONFIG[id].dist;
        const segments = 128;
        const orbitGeo = new THREE.BufferGeometry();
        const positions = new Float32Array((segments + 1) * 3);

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          positions[i * 3] = Math.cos(theta) * dist;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = Math.sin(theta) * dist;
        }

        orbitGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const orbitMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.12
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        this.scene.add(orbitLine);
      });
    }

    initControls() {
      // Signature Google Earth smooth inertial damping
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05; // Google Earth silky smooth weight
      this.controls.rotateSpeed = 0.75;
      this.controls.zoomSpeed = 1.2;
      this.controls.minDistance = 3;
      this.controls.maxDistance = 1500;
      this.controls.target.set(0, 0, 0);
    }

    flyTo(planetId) {
      const p = this.planets[planetId];
      if (!p) return;
      this.currentFocus = planetId;

      const targetPos = new THREE.Vector3();
      p.mesh.getWorldPosition(targetPos);

      const targetRadius = p.config.radius;
      const offsetDist = targetRadius * 3.8 + 6;

      const startCamPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();

      // Destination camera position keeping viewing angle
      const dir = startCamPos.clone().sub(startTarget).normalize();
      const endCamPos = targetPos.clone().add(dir.multiplyScalar(offsetDist));

      // 1.5s smooth Google Earth cinematic fly-to transition
      const duration = 1200;
      const startTime = performance.now();

      const animateFly = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth cubic in-out curve
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        this.camera.position.lerpVectors(startCamPos, endCamPos, ease);
        this.controls.target.lerpVectors(startTarget, targetPos, ease);

        if (progress < 1) {
          requestAnimationFrame(animateFly);
        }
      };

      requestAnimationFrame(animateFly);
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Hook into existing #data menu clicks
      const dataLinks = document.querySelectorAll('#data a');
      dataLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const cls = link.getAttribute('class') || '';
          const planetId = cls.replace('active', '').trim();
          if (this.planets[planetId]) {
            this.flyTo(planetId);
          }
        });
      });

      // Raycaster click on planets
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      this.canvas.addEventListener('dblclick', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);

        const meshes = Object.keys(this.planets).map(k => this.planets[k].mesh);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          const hitId = Object.keys(this.planets).find(k => this.planets[k].mesh === hitMesh);
          if (hitId) {
            const dataLink = document.querySelector(`#data a.${hitId}`);
            if (dataLink) dataLink.click();
            this.flyTo(hitId);
          }
        }
      });
    }

    animate() {
      requestAnimationFrame(this.animate);

      // Rotate Sun
      if (this.sunMesh) {
        this.sunMesh.rotation.y += 0.001;
      }

      // Update orbits and planetary axial rotations
      if (!this.isPaused) {
        Object.keys(this.planets).forEach(id => {
          if (id === 'sun') return;
          const p = this.planets[id];
          p.angle += p.config.orbitSpeed * 0.02 * this.timeSpeed;
          p.mesh.position.x = Math.cos(p.angle) * p.config.dist;
          p.mesh.position.z = Math.sin(p.angle) * p.config.dist;

          p.mesh.rotation.y += p.config.rotSpeed;

          if (p.cloudsMesh) {
            p.cloudsMesh.rotation.y += p.config.rotSpeed * 1.25;
          }
          if (p.moonMesh) {
            const mAngle = Date.now() * 0.002;
            p.moonMesh.position.x = Math.cos(mAngle) * 5.2;
            p.moonMesh.position.z = Math.sin(mAngle) * 5.2;
          }
        });
      }

      // If tracking a planet, keep controls target locked smoothly
      if (this.currentFocus && this.planets[this.currentFocus]) {
        const targetPos = new THREE.Vector3();
        this.planets[this.currentFocus].mesh.getWorldPosition(targetPos);
        this.controls.target.lerp(targetPos, 0.04);
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Initialize once DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    window.solarViewer = new SolarSystemViewer();
  });

})();
