// WebGL Solar System & Google Earth Explorer Engine
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(function() {
  'use strict';

  // Major World Cities with accurate Latitude & Longitude
  const CITIES = [
    { id: 'tashkent', name: 'Ташкент / Tashkent', lat: 41.2995, lon: 69.2401, pop: '2.9M', tz: 'UTC+5' },
    { id: 'moscow', name: 'Москва / Moscow', lat: 55.7558, lon: 37.6173, pop: '13.1M', tz: 'UTC+3' },
    { id: 'newyork', name: 'Нью-Йорк / New York', lat: 40.7128, lon: -74.0060, pop: '8.8M', tz: 'UTC-4' },
    { id: 'london', name: 'Лондон / London', lat: 51.5074, lon: -0.1278, pop: '9.0M', tz: 'UTC+1' },
    { id: 'paris', name: 'Париж / Paris', lat: 48.8566, lon: 2.3522, pop: '2.1M', tz: 'UTC+2' },
    { id: 'tokyo', name: 'Токио / Tokyo', lat: 35.6762, lon: 139.6503, pop: '14.0M', tz: 'UTC+9' },
    { id: 'dubai', name: 'Дубай / Dubai', lat: 25.2048, lon: 55.2708, pop: '3.6M', tz: 'UTC+4' },
    { id: 'beijing', name: 'Пекин / Beijing', lat: 39.9042, lon: 116.4074, pop: '21.5M', tz: 'UTC+8' },
    { id: 'cairo', name: 'Каир / Cairo', lat: 30.0444, lon: 31.2357, pop: '9.5M', tz: 'UTC+3' },
    { id: 'sydney', name: 'Сидней / Sydney', lat: -33.8688, lon: 151.2093, pop: '5.3M', tz: 'UTC+10' },
    { id: 'rio', name: 'Рио-де-Жанейро / Rio', lat: -22.9068, lon: -43.1729, pop: '6.7M', tz: 'UTC-3' }
  ];

  const PLANET_CONFIG = {
    sun: { name: 'Sun', radius: 14.0, dist: 0, orbitSpeed: 0, rotSpeed: 0.001, color: 0xffaa00, emissive: true },
    mercury: { name: 'Mercury', radius: 1.2, dist: 28, orbitSpeed: 0.04, rotSpeed: 0.004, color: 0x9e9e9e },
    venus: { name: 'Venus', radius: 2.2, dist: 42, orbitSpeed: 0.015, rotSpeed: -0.002, color: 0xe0a96d },
    earth: { name: 'Earth', radius: 2.5, dist: 60, orbitSpeed: 0.01, rotSpeed: 0.005, color: 0x2196f3, hasClouds: true, hasMoon: true },
    mars: { name: 'Mars', radius: 1.5, dist: 80, orbitSpeed: 0.008, rotSpeed: 0.018, color: 0xc1440e },
    jupiter: { name: 'Jupiter', radius: 6.5, dist: 120, orbitSpeed: 0.002, rotSpeed: 0.04, color: 0xd4a373 },
    saturn: { name: 'Saturn', radius: 5.2, dist: 165, orbitSpeed: 0.0009, rotSpeed: 0.038, color: 0xf4e04d, hasRing: true },
    uranus: { name: 'Uranus', radius: 3.5, dist: 215, orbitSpeed: 0.0004, rotSpeed: 0.03, color: 0x70d6ff },
    neptune: { name: 'Neptune', radius: 3.4, dist: 265, orbitSpeed: 0.0002, rotSpeed: 0.032, color: 0x3a86ff }
  };

  // Convert lat/lon to 3D position on sphere of radius R
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  // --- Procedural Textures Fallbacks ---
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 400; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 12 + 4, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createMarsTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#c1440e';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#6e260e';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 90 + 30, Math.random() * 40 + 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 1024, 25);
    ctx.fillRect(0, 490, 1024, 22);
    return new THREE.CanvasTexture(c);
  }

  function createJupiterTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    const bands = ['#d4a373', '#faedcd', '#bc6c25', '#dda15e', '#bb9457', '#e9d8a6', '#99582a'];
    const h = 512 / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, i * h, 1024, h);
    });
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
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
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
      this.cityPins = [];
      this.earthMode = false;

      this.initScene();
      this.initStars();
      this.initSun();
      this.initPlanets();
      this.initCityPins();
      this.initOrbits();
      this.initControls();
      this.initEarthUI();
      this.bindEvents();

      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    initScene() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.25;

      this.canvas = this.renderer.domElement;
      this.canvas.id = 'webgl-canvas';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '0';
      this.container.appendChild(this.canvas);

      // Hide CSS 3D solar system element
      const cssGalaxy = document.getElementById('galaxy');
      if (cssGalaxy) cssGalaxy.style.display = 'none';

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.2, 10000);
      this.camera.position.set(0, 90, 160);

      this.ambientLight = new THREE.AmbientLight(0x333344, 0.45);
      this.scene.add(this.ambientLight);

      this.sunLight = new THREE.PointLight(0xffffff, 2.6, 0, 0);
      this.sunLight.position.set(0, 0, 0);
      this.scene.add(this.sunLight);

      this.textureLoader = new THREE.TextureLoader();
    }

    initStars() {
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

      const starMat = new THREE.PointsMaterial({ size: 2.2, vertexColors: true, transparent: true, opacity: 0.85 });
      this.stars = new THREE.Points(starGeo, starMat);
      this.scene.add(this.stars);
    }

    initSun() {
      const sunGeo = new THREE.SphereGeometry(PLANET_CONFIG.sun.radius, 48, 48);
      const sunTex = createSunTexture();
      const sunMat = new THREE.MeshBasicMaterial({ map: sunTex, color: 0xffe066 });
      this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
      this.scene.add(this.sunMesh);

      const coronaGeo = new THREE.SphereGeometry(PLANET_CONFIG.sun.radius * 1.15, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.18, side: THREE.BackSide });
      this.coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      this.scene.add(this.coronaMesh);

      this.planets.sun = { mesh: this.sunMesh, angle: 0, config: PLANET_CONFIG.sun, pivot: new THREE.Group() };
    }

    initPlanets() {
      const geoDetail = 48;

      Object.keys(PLANET_CONFIG).forEach(id => {
        if (id === 'sun') return;
        const cfg = PLANET_CONFIG[id];
        const pivot = new THREE.Group();
        this.scene.add(pivot);

        const geo = new THREE.SphereGeometry(cfg.radius, geoDetail, geoDetail);
        let mat;

        if (id === 'earth') {
          // NASA Satellite Blue Marble high-res texture
          const earthTexture = this.textureLoader.load('textures/earth_atmos.jpg');
          earthTexture.colorSpace = THREE.SRGBColorSpace;
          mat = new THREE.MeshStandardMaterial({
            map: earthTexture,
            roughness: 0.6,
            metalness: 0.1
          });
        } else if (id === 'mars') {
          mat = new THREE.MeshStandardMaterial({ map: createMarsTexture(), roughness: 0.8 });
        } else if (id === 'jupiter') {
          mat = new THREE.MeshStandardMaterial({ map: createJupiterTexture(), roughness: 0.8 });
        } else if (id === 'saturn') {
          mat = new THREE.MeshStandardMaterial({ map: createSaturnTexture(), roughness: 0.8 });
        } else if (id === 'mercury') {
          mat = new THREE.MeshStandardMaterial({ map: createGenericTexture('#9e9e9e'), roughness: 0.8 });
        } else if (id === 'venus') {
          mat = new THREE.MeshStandardMaterial({ map: createGenericTexture('#e0a96d'), roughness: 0.8 });
        } else if (id === 'uranus') {
          mat = new THREE.MeshStandardMaterial({ map: createGenericTexture('#70d6ff'), roughness: 0.8 });
        } else if (id === 'neptune') {
          mat = new THREE.MeshStandardMaterial({ map: createGenericTexture('#3a86ff'), roughness: 0.8 });
        }

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(cfg.dist, 0, 0);
        pivot.add(mesh);

        // Earth Clouds with local realistic cloud texture
        let cloudsMesh = null;
        if (cfg.hasClouds) {
          const cloudsGeo = new THREE.SphereGeometry(cfg.radius * 1.015, geoDetail, geoDetail);
          const cloudsTex = this.textureLoader.load('textures/earth_clouds.png');
          const cloudsMat = new THREE.MeshStandardMaterial({
            map: cloudsTex,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
          });
          cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
          mesh.add(cloudsMesh);
        }

        // Earth Moon with local NASA moon texture
        let moonMesh = null;
        if (cfg.hasMoon) {
          const moonGeo = new THREE.SphereGeometry(0.55, 24, 24);
          const moonTex = this.textureLoader.load('textures/moon.jpg');
          const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.9 });
          moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.set(5.5, 0, 0);
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

    initCityPins() {
      const earthMesh = this.planets.earth.mesh;
      const earthR = PLANET_CONFIG.earth.radius;

      // Group of pins on Earth
      this.cityGroup = new THREE.Group();
      earthMesh.add(this.cityGroup);

      CITIES.forEach(city => {
        const pos = latLonToVector3(city.lat, city.lon, earthR * 1.01);

        // Glowing marker pin
        const pinGeo = new THREE.SphereGeometry(0.06, 12, 12);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0x00ccff });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(pos);
        pinMesh.userData = { city };

        // Outer glow ring
        const ringGeo = new THREE.RingGeometry(0.07, 0.12, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
        ringMesh.lookAt(pos.clone().multiplyScalar(2));
        pinMesh.add(ringMesh);

        this.cityGroup.add(pinMesh);
        this.cityPins.push(pinMesh);
      });
    }

    initOrbits() {
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
        const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
        this.scene.add(new THREE.Line(orbitGeo, orbitMat));
      });
    }

    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05; // Google Earth smooth inertia
      this.controls.rotateSpeed = 0.75;
      this.controls.zoomSpeed = 1.2;
      this.controls.minDistance = 2.6; // can zoom right down to Earth's satellite surface!
      this.controls.maxDistance = 1500;
      this.controls.target.set(0, 0, 0);
    }

    initEarthUI() {
      // Populate city selector
      const $citySelect = $('#earth-city-select');
      if ($citySelect.length) {
        $citySelect.empty().append('<option value="">Select city...</option>');
        CITIES.forEach(c => {
          $citySelect.append($('<option>').val(c.id).text(c.name));
        });

        $citySelect.on('change', () => {
          const cid = $citySelect.val();
          if (cid) this.flyToCity(cid);
        });
      }

      // Exit button
      $('#earth-exit-btn').on('click', () => {
        this.exitEarthMode();
      });
    }

    flyTo(planetId) {
      const p = this.planets[planetId];
      if (!p) return;
      this.currentFocus = planetId;

      const targetPos = new THREE.Vector3();
      p.mesh.getWorldPosition(targetPos);

      const targetRadius = p.config.radius;
      // Close orbit for Earth, comfortable view for others
      const offsetDist = planetId === 'earth' ? targetRadius * 2.2 : targetRadius * 3.8 + 6;

      const startCamPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();

      const dir = startCamPos.clone().sub(startTarget).normalize();
      const endCamPos = targetPos.clone().add(dir.multiplyScalar(offsetDist));

      const duration = 1200;
      const startTime = performance.now();

      const animateFly = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        this.camera.position.lerpVectors(startCamPos, endCamPos, ease);
        this.controls.target.lerpVectors(startTarget, targetPos, ease);

        if (progress < 1) {
          requestAnimationFrame(animateFly);
        } else {
          if (planetId === 'earth') {
            this.enterEarthMode();
          } else {
            this.exitEarthMode();
          }
        }
      };

      requestAnimationFrame(animateFly);
    }

    flyToCity(cityId) {
      const city = CITIES.find(c => c.id === cityId);
      if (!city || !this.planets.earth) return;

      const earthMesh = this.planets.earth.mesh;
      const earthR = PLANET_CONFIG.earth.radius;
      const targetPos = new THREE.Vector3();
      earthMesh.getWorldPosition(targetPos);

      // Rotate camera to view city directly
      const localCityPos = latLonToVector3(city.lat, city.lon, earthR);
      const worldCityPos = localCityPos.clone().applyQuaternion(earthMesh.quaternion).add(targetPos);

      const camOffset = worldCityPos.clone().sub(targetPos).normalize().multiplyScalar(earthR * 1.8);
      const endCamPos = targetPos.clone().add(camOffset);

      const startCamPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();

      const duration = 1400;
      const startTime = performance.now();

      const animateCityFly = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        this.camera.position.lerpVectors(startCamPos, endCamPos, ease);
        this.controls.target.lerpVectors(startTarget, targetPos, ease);

        if (progress < 1) {
          requestAnimationFrame(animateCityFly);
        } else {
          this.showCityPopover(city, { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
        }
      };

      requestAnimationFrame(animateCityFly);
    }

    enterEarthMode() {
      this.earthMode = true;
      $('#earth-explorer-bar').addClass('active');
      this.controls.minDistance = 2.6; // enable ultra-close surface inspection
    }

    exitEarthMode() {
      this.earthMode = false;
      $('#earth-explorer-bar').removeClass('active');
      $('#city-popover').hide();
      this.controls.minDistance = 5;

      // Fly out to general Solar System view
      const startCam = this.camera.position.clone();
      const endCam = new THREE.Vector3(0, 90, 160);
      const startTarget = this.controls.target.clone();
      const endTarget = new THREE.Vector3(0, 0, 0);

      const duration = 1200;
      const startTime = performance.now();

      const animateOut = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        this.camera.position.lerpVectors(startCam, endCam, ease);
        this.controls.target.lerpVectors(startTarget, endTarget, ease);
        if (progress < 1) requestAnimationFrame(animateOut);
      };
      requestAnimationFrame(animateOut);

      // Select sun/all in data
      this.currentFocus = 'sun';
      $('#data a').removeClass('active');
      $('#data a.sun').addClass('active');
    }

    showCityPopover(city, mouseEvent) {
      const $pop = $('#city-popover');
      $('#popover-city-name').text(city.name);
      $('#popover-city-coords').text(`${city.lat.toFixed(2)}° N, ${city.lon.toFixed(2)}° E`);
      $('#popover-city-info').text(`Timezone: ${city.tz} · Population: ${city.pop}`);

      // Google Earth link for this exact city
      const gLink = `https://earth.google.com/web/@${city.lat},${city.lon},150a,5000d,35y,0h,0t,0r?hl=ru`;
      $('#popover-google-link').attr('href', gLink);

      $pop.css({
        left: Math.min(mouseEvent.clientX + 10, window.innerWidth - 240) + 'px',
        top: Math.max(mouseEvent.clientY - 40, 60) + 'px'
      }).show();
    }

    updateEarthHUD() {
      if (!this.planets.earth) return;
      const earthMesh = this.planets.earth.mesh;
      const targetPos = new THREE.Vector3();
      earthMesh.getWorldPosition(targetPos);

      const dist = this.camera.position.distanceTo(targetPos);
      const earthRadius = PLANET_CONFIG.earth.radius;

      // Altitude scaled to realistic Earth km (Earth radius = 6,371 km)
      const altitudeRatio = Math.max(0, (dist - earthRadius) / earthRadius);
      const altitudeKm = Math.round(altitudeRatio * 6371);

      // Format altitude like Google Earth
      let altStr;
      if (altitudeKm >= 1000) {
        altStr = (altitudeKm).toLocaleString('en-US') + ' km';
      } else {
        altStr = altitudeKm + ' km';
      }
      $('#earth-altitude-val').text(altStr);

      // Calculate approximate latitude and longitude on camera center
      const camDir = this.camera.position.clone().sub(targetPos).normalize();
      const localCam = camDir.clone().applyQuaternion(earthMesh.quaternion.clone().invert());
      const lat = 90 - Math.acos(localCam.y) * (180 / Math.PI);
      const lon = (Math.atan2(localCam.z, -localCam.x) * (180 / Math.PI)) - 180;

      const latDir = lat >= 0 ? 'N' : 'S';
      const lonDir = lon >= 0 ? 'E' : 'W';
      $('#earth-coords-val').text(`${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`);

      // Update Google Earth URL matching user coordinates and altitude
      const altMeters = Math.max(500, Math.round(altitudeKm * 1000));
      const gUrl = `https://earth.google.com/web/@${lat.toFixed(6)},${lon.toFixed(6)},0a,${altMeters}d,35y,0h,0t,0r?hl=ru`;
      $('#earth-google-link').attr('href', gUrl);
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Data menu clicks
      const dataLinks = document.querySelectorAll('#data a');
      dataLinks.forEach(link => {
        link.addEventListener('click', () => {
          const cls = link.getAttribute('class') || '';
          const planetId = cls.replace('active', '').trim();
          if (this.planets[planetId]) {
            this.flyTo(planetId);
          }
        });
      });

      // Raycaster for clicking city pins
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      this.canvas.addEventListener('click', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);

        // Check city pins
        const pinHits = raycaster.intersectObjects(this.cityPins);
        if (pinHits.length > 0) {
          const pin = pinHits[0].object;
          if (pin.userData && pin.userData.city) {
            this.showCityPopover(pin.userData.city, e);
            return;
          }
        } else {
          $('#city-popover').hide();
        }

        // Check planets
        const meshes = Object.keys(this.planets).map(k => this.planets[k].mesh);
        const planetHits = raycaster.intersectObjects(meshes);
        if (planetHits.length > 0) {
          const hitMesh = planetHits[0].object;
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

      if (this.sunMesh) this.sunMesh.rotation.y += 0.001;

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
            p.moonMesh.position.x = Math.cos(mAngle) * 5.5;
            p.moonMesh.position.z = Math.sin(mAngle) * 5.5;
          }
        });
      }

      if (this.currentFocus && this.planets[this.currentFocus]) {
        const targetPos = new THREE.Vector3();
        this.planets[this.currentFocus].mesh.getWorldPosition(targetPos);
        this.controls.target.lerp(targetPos, 0.04);
      }

      this.controls.update();

      if (this.earthMode || this.currentFocus === 'earth') {
        this.updateEarthHUD();
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.solarViewer = new SolarSystemViewer();
  });

})();
