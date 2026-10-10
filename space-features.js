// Space Features: Planetary Time, Distance Calculator, Orbital Speeds, and 3D Drag
(function($) {
  'use strict';

  // --- Astronomical Dataset ---
  const PLANETS = {
    sun: {
      id: 'sun',
      name: { ru: 'Солнце', en: 'Sun' },
      type: { ru: 'Жёлтый карлик (Звезда)', en: 'Yellow Dwarf (Star)' },
      color: '#ffc107',
      emoji: '☀️',
      diameterKm: 1392700,
      massKg: '1.989 × 10³⁰ кг (333 000 Земель)',
      gravity: 274.0, // m/s2
      gravityRatio: 27.9,
      orbitalSpeedKmh: 828000, // around galactic center
      orbitalSpeedKms: 230,
      distanceFromSunKm: 0,
      orbitPeriodDays: 0,
      dayLengthHours: 609.6, // ~25.4 earth days
      temp: '+5 500 °C (ядро +15 000 000 °C)',
      moons: 8, // planets
      description: {
        ru: 'Центральная звезда нашей системы, содержащая 99.86% всей её массы. Источник жизни, света и гравитационный якорь для всех планет.',
        en: 'The star at the center of the Solar System, containing 99.86% of its mass. Source of life and gravity anchor for all planets.'
      }
    },
    mercury: {
      id: 'mercury',
      name: { ru: 'Меркурий', en: 'Mercury' },
      type: { ru: 'Планета земной группы', en: 'Terrestrial Planet' },
      color: '#a0a0a0',
      emoji: '🪐',
      diameterKm: 4879,
      massKg: '3.30 × 10²³ кг',
      gravity: 3.7,
      gravityRatio: 0.38,
      orbitalSpeedKmh: 170500,
      orbitalSpeedKms: 47.36,
      distanceFromSunKm: 57910000,
      orbitPeriodDays: 88,
      dayLengthHours: 4222.6, // 176 earth days
      temp: 'от -180 °C до +430 °C',
      moons: 0,
      description: {
        ru: 'Самая близкая к Солнцу и самая быстрая планета. Из-за отсутствия плотной атмосферы перепады температуры здесь самые экстремальные.',
        en: 'The closest planet to the Sun and the fastest. Has extreme temperature fluctuations from -180°C to +430°C.'
      }
    },
    venus: {
      id: 'venus',
      name: { ru: 'Венера', en: 'Venus' },
      type: { ru: 'Планета земной группы', en: 'Terrestrial Planet' },
      color: '#e0a96d',
      emoji: '🟡',
      diameterKm: 12104,
      massKg: '4.87 × 10²⁴ кг',
      gravity: 8.87,
      gravityRatio: 0.90,
      orbitalSpeedKmh: 126070,
      orbitalSpeedKms: 35.02,
      distanceFromSunKm: 108200000,
      orbitPeriodDays: 224.7,
      dayLengthHours: 2802.0, // 116.75 earth days (retrograde)
      temp: '+465 °C (адский парник)',
      moons: 0,
      description: {
        ru: '«Сестра Земли» по размеру, но самая горячая планета из-за плотной атмосферы углекислого газа и дождей из серной кислоты.',
        en: 'Earth’s twin in size, but the hottest planet due to a runaway greenhouse effect and sulfuric acid clouds.'
      }
    },
    earth: {
      id: 'earth',
      name: { ru: 'Земля', en: 'Earth' },
      type: { ru: 'Планета земной группы', en: 'Terrestrial Planet' },
      color: '#2196f3',
      emoji: '🌍',
      diameterKm: 12742,
      massKg: '5.97 × 10²⁴ кг',
      gravity: 9.81,
      gravityRatio: 1.0,
      orbitalSpeedKmh: 107200,
      orbitalSpeedKms: 29.78,
      distanceFromSunKm: 149600000,
      orbitPeriodDays: 365.25,
      dayLengthHours: 24.0,
      temp: 'от -89 °C до +58 °C (средняя +15 °C)',
      moons: 1,
      description: {
        ru: 'Наш общий космический дом — единственное известное место во Вселенной, где существует жизнь и жидкая вода на поверхности.',
        en: 'Our cosmic home world — the only known place in the universe harboring life and liquid surface water.'
      }
    },
    mars: {
      id: 'mars',
      name: { ru: 'Марс', en: 'Mars' },
      type: { ru: 'Планета земной группы', en: 'Terrestrial Planet' },
      color: '#e55934',
      emoji: '🔴',
      diameterKm: 6779,
      massKg: '6.42 × 10²³ кг',
      gravity: 3.72,
      gravityRatio: 0.38,
      orbitalSpeedKmh: 86870,
      orbitalSpeedKms: 24.13,
      distanceFromSunKm: 227920000,
      orbitPeriodDays: 687,
      dayLengthHours: 24.6597, // 24h 39m 35s (1 Sol)
      temp: 'от -140 °C до +20 °C (средняя -63 °C)',
      moons: 2,
      description: {
        ru: 'Красная планета с гигантским вулканом Олимп (высотой 21 км) и каньонами Долины Маринер. Главная цель будущей колонизации.',
        en: 'The Red Planet with the solar system’s tallest volcano (Olympus Mons, 21km). The primary target for future exploration.'
      }
    },
    jupiter: {
      id: 'jupiter',
      name: { ru: 'Юпитер', en: 'Jupiter' },
      type: { ru: 'Газовый гигант', en: 'Gas Giant' },
      color: '#d4a373',
      emoji: '🪐',
      diameterKm: 139820,
      massKg: '1.90 × 10²⁷ кг (318 Земель)',
      gravity: 24.79,
      gravityRatio: 2.53,
      orbitalSpeedKmh: 47000,
      orbitalSpeedKms: 13.07,
      distanceFromSunKm: 778570000,
      orbitPeriodDays: 4333, // 11.86 years
      dayLengthHours: 9.925, // 9h 55m 30s
      temp: '-110 °C',
      moons: 95,
      description: {
        ru: 'Крупнейшая планета Солнечной системы. Знаменитое Большое Красное Пятно — гигантский шторм, бушующий сотни лет.',
        en: 'The largest planet in the solar system. Famous for the Great Red Spot, a storm larger than Earth raging for centuries.'
      }
    },
    saturn: {
      id: 'saturn',
      name: { ru: 'Сатурн', en: 'Saturn' },
      type: { ru: 'Газовый гигант', en: 'Gas Giant' },
      color: '#f4e04d',
      emoji: '🪐',
      diameterKm: 116460,
      massKg: '5.68 × 10²⁶ кг (95 Земель)',
      gravity: 10.44,
      gravityRatio: 1.06,
      orbitalSpeedKmh: 34880,
      orbitalSpeedKms: 9.69,
      distanceFromSunKm: 1433530000,
      orbitPeriodDays: 10759, // 29.45 years
      dayLengthHours: 10.55, // 10h 33m
      temp: '-140 °C',
      moons: 146,
      description: {
        ru: 'Властелин колец из миллиардов ледяных глыб и пыли. Плотность Сатурна меньше плотности воды — в гигантском океане он плавал бы!',
        en: 'Lord of the rings composed of ice chunks and cosmic dust. Less dense than water — it would float in a giant ocean!'
      }
    },
    uranus: {
      id: 'uranus',
      name: { ru: 'Уран', en: 'Uranus' },
      type: { ru: 'Ледяной гигант', en: 'Ice Giant' },
      color: '#70d6ff',
      emoji: '🌐',
      diameterKm: 50724,
      massKg: '8.68 × 10²⁵ кг (14.5 Земель)',
      gravity: 8.69,
      gravityRatio: 0.89,
      orbitalSpeedKmh: 24500,
      orbitalSpeedKms: 6.81,
      distanceFromSunKm: 2872460000,
      orbitPeriodDays: 30685, // 84 years
      dayLengthHours: 17.24, // 17h 14m
      temp: '-195 °C (рекорд -224 °C)',
      moons: 28,
      description: {
        ru: '«Лежачая планета» — наклон оси вращения 98°, из-за чего он буквально катится по своей орбите вокруг Солнца.',
        en: 'Tilted by 98 degrees on its axis, rolling around the Sun like a giant ball with a pale cyan methane atmosphere.'
      }
    },
    neptune: {
      id: 'neptune',
      name: { ru: 'Нептун', en: 'Neptune' },
      type: { ru: 'Ледяной гигант', en: 'Ice Giant' },
      color: '#3a86ff',
      emoji: '🔵',
      diameterKm: 49244,
      massKg: '1.02 × 10²⁶ кг (17 Земель)',
      gravity: 11.15,
      gravityRatio: 1.14,
      orbitalSpeedKmh: 19550,
      orbitalSpeedKms: 5.43,
      distanceFromSunKm: 4495060000,
      orbitPeriodDays: 60190, // 164.8 years
      dayLengthHours: 16.11, // 16h 06m
      temp: '-200 °C',
      moons: 16,
      description: {
        ru: 'Самая дальняя планета. Здесь зафиксированы самые яростные ветра в Солнечной системе — сверхзвуковые порывы до 2 100 км/ч.',
        en: 'The outermost major planet. Features the fastest supersonic winds in the Solar System, reaching over 2,100 km/h.'
      }
    }
  };

  let currentPlanetId = 'earth';
  let currentLang = 'ru';
  let userWeightKg = 70;
  let customSpeedKmh = 40000;
  let timeWarpScale = 1;
  let isOrbitPaused = false;

  // --- Real-Time Planetary Time Calculation ---
  function getPlanetaryTime(planetId) {
    const now = new Date();
    const unixMs = now.getTime();

    if (planetId === 'earth') {
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      return {
        clock: `${hours}:${mins}:${secs}`,
        sub: `UTC ${utcHours}:${mins}`,
        phase: now.getHours() >= 6 && now.getHours() < 20 ? (currentLang === 'ru' ? '☀️ День' : '☀️ Day') : (currentLang === 'ru' ? '🌌 Ночь' : '🌌 Night'),
        dayName: currentLang === 'ru' ? 'Сутки: 24ч 00м' : 'Day: 24h 00m'
      };
    }

    if (planetId === 'mars') {
      // NASA GISS formula for Mars Sol Time (MTC)
      // JD = (unixMs / 86400000) + 2440587.5
      // MSD = (JD - 2405522.0028779) / 1.0274912517
      // MTC = (MSD % 1) * 24 hours
      const jd = (unixMs / 86400000) + 2440587.5;
      const msd = (jd - 2405522.0028779) / 1.0274912517;
      const totalMarsHours = (msd % 1) * 24;
      const mHours = Math.floor(totalMarsHours);
      const mMins = Math.floor((totalMarsHours - mHours) * 60);
      const mSecs = Math.floor((((totalMarsHours - mHours) * 60) - mMins) * 60);
      const solCount = Math.floor(msd);
      const clockStr = `${String(mHours).padStart(2, '0')}:${String(mMins).padStart(2, '0')}:${String(mSecs).padStart(2, '0')}`;
      const isDay = mHours >= 6 && mHours < 18;

      return {
        clock: clockStr,
        sub: `MTC · Сол ${solCount}`,
        phase: isDay ? (currentLang === 'ru' ? '☀️ Марсианский день' : '☀️ Martian Day') : (currentLang === 'ru' ? '🌌 Марсианская ночь' : '🌌 Martian Night'),
        dayName: currentLang === 'ru' ? '1 Сол = 24ч 39м' : '1 Sol = 24h 39m'
      };
    }

    // Generic rotational calculation for gas/ice giants
    const p = PLANETS[planetId];
    if (p && p.dayLengthHours) {
      const cycleSeconds = p.dayLengthHours * 3600;
      const curSeconds = (unixMs / 1000) % cycleSeconds;
      const normalizedHours = (curSeconds / cycleSeconds) * 24;
      const h = Math.floor(normalizedHours);
      const m = Math.floor((normalizedHours - h) * 60);
      const s = Math.floor((((normalizedHours - h) * 60) - m) * 60);
      const clockStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      const isDay = h >= 6 && h < 18;

      const dayHoursFmt = p.dayLengthHours >= 24 
        ? (p.dayLengthHours / 24).toFixed(1) + (currentLang === 'ru' ? ' земн. дн.' : ' earth days')
        : Math.floor(p.dayLengthHours) + 'ч ' + Math.round((p.dayLengthHours % 1) * 60) + 'м';

      return {
        clock: clockStr,
        sub: `${p.name[currentLang]} Meridian`,
        phase: isDay ? (currentLang === 'ru' ? '☀️ Дневная сторона' : '☀️ Day side') : (currentLang === 'ru' ? '🌌 Ночная сторона' : '🌌 Night side'),
        dayName: (currentLang === 'ru' ? 'Сутки: ' : 'Day: ') + dayHoursFmt
      };
    }

    return { clock: '--:--:--', sub: '', phase: '', dayName: '' };
  }

  // --- Dynamic Distance Calculation ---
  function calculateInterplanetaryDistance(idA, idB) {
    const pA = PLANETS[idA];
    const pB = PLANETS[idB];
    if (!pA || !pB) return null;

    if (idA === idB) {
      return {
        curKm: 0,
        minKm: 0,
        maxKm: 0,
        avgKm: 0,
        curAu: 0
      };
    }

    // Orbits in km
    const rA = pA.distanceFromSunKm;
    const rB = pB.distanceFromSunKm;

    if (rA === 0) { // Sun
      return {
        curKm: rB,
        minKm: rB,
        maxKm: rB,
        avgKm: rB,
        curAu: (rB / 149600000).toFixed(3)
      };
    }
    if (rB === 0) {
      return {
        curKm: rA,
        minKm: rA,
        maxKm: rA,
        avgKm: rA,
        curAu: (rA / 149600000).toFixed(3)
      };
    }

    // Orbital positions based on current time
    const nowDays = Date.now() / (1000 * 86400);
    const thetaA = (2 * Math.PI * nowDays) / (pA.orbitPeriodDays || 365);
    const thetaB = (2 * Math.PI * nowDays) / (pB.orbitPeriodDays || 365);

    const xA = rA * Math.cos(thetaA);
    const yA = rA * Math.sin(thetaA);
    const xB = rB * Math.cos(thetaB);
    const yB = rB * Math.sin(thetaB);

    const curKm = Math.round(Math.hypot(xA - xB, yA - yB));
    const minKm = Math.abs(rA - rB);
    const maxKm = rA + rB;
    const avgKm = Math.round((minKm + maxKm) / 2);
    const curAu = (curKm / 149600000).toFixed(3);

    return { curKm, minKm, maxKm, avgKm, curAu };
  }

  // Format Travel Time
  function formatTravelTime(hours) {
    if (hours <= 0) return currentLang === 'ru' ? '0 секунд' : '0 seconds';
    
    const days = hours / 24;
    const years = days / 365.25;

    if (years >= 1) {
      const fullYears = Math.floor(years);
      const remDays = Math.round((years - fullYears) * 365.25);
      if (currentLang === 'ru') {
        return `${fullYears} г. ${remDays > 0 ? remDays + ' дн.' : ''}`;
      }
      return `${fullYears} yrs ${remDays > 0 ? remDays + ' days' : ''}`;
    }

    if (days >= 1) {
      const fullDays = Math.floor(days);
      const remHours = Math.round((days - fullDays) * 24);
      if (currentLang === 'ru') {
        return `${fullDays} дн. ${remHours > 0 ? remHours + ' ч.' : ''}`;
      }
      return `${fullDays} days ${remHours > 0 ? remHours + ' hrs' : ''}`;
    }

    const fullHours = Math.floor(hours);
    const mins = Math.round((hours - fullHours) * 60);
    if (currentLang === 'ru') {
      return `${fullHours} ч. ${mins} мин.`;
    }
    return `${fullHours} hrs ${mins} mins`;
  }

  // Format Distance
  function formatKm(km) {
    if (km >= 1000000) {
      return (km / 1000000).toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + (currentLang === 'ru' ? ' млн км' : ' million km');
    }
    return km.toLocaleString('ru-RU') + (currentLang === 'ru' ? ' км' : ' km');
  }

  // --- UI Elements Injection ---
  function initAddonUI() {
    // 1. Add extra buttons to #navbar
    const $navbar = $('#navbar');
    const extraNavHtml = `
      <div class="nav-extra-actions">
        <button id="btn-open-dist-calc" class="hud-btn gold" title="Рассчитать расстояние и время полета">
          <span>🛰️</span> <span class="nav-btn-text">${currentLang === 'ru' ? 'Расстояния & км/ч' : 'Distance & Speed'}</span>
        </button>
        <button id="btn-open-planet-hud" class="hud-btn" title="Подробные данные и планетарное время">
          <span>🪐</span> <span class="nav-btn-text">${currentLang === 'ru' ? 'Время планет' : 'Planet Time'}</span>
        </button>
        <button id="btn-toggle-lang" class="hud-btn" style="padding: 5px 8px;">
          ${currentLang === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
        </button>
      </div>
    `;
    $navbar.append(extraNavHtml);

    // 2. Add Floating HUD Pill (Top Right)
    const hudPillHtml = `
      <div id="live-hud-pill" title="Кликните для открытия полной энциклопедии">
        <div class="pill-header">
          <span class="pill-title" id="hud-pill-name">Земля</span>
          <span class="pill-badge" id="hud-pill-phase">☀️ День</span>
        </div>
        <div class="pill-clock" id="hud-pill-clock">--:--:--</div>
        <div class="pill-detail">
          <span id="hud-pill-speed">107 200 км/ч</span>
          <span id="hud-pill-day">Сутки: 24ч</span>
        </div>
      </div>
    `;
    $('body').append(hudPillHtml);

    // 3. Add Time Warp Floating Bar (Bottom Center)
    const timeWarpHtml = `
      <div id="time-warp-bar">
        <span class="time-label">${currentLang === 'ru' ? 'Время:' : 'Time:'}</span>
        <button class="time-btn" data-warp="pause" id="time-btn-pause">⏸️</button>
        <button class="time-btn active" data-warp="1">1x</button>
        <button class="time-btn" data-warp="2">2x</button>
        <button class="time-btn" data-warp="5">5x</button>
        <button class="time-btn" data-warp="10">10x</button>
        <button class="time-btn" data-warp="reverse" title="Обратное вращение орбит">⏪</button>
      </div>
    `;
    $('body').append(timeWarpHtml);

    // 4. Add Drag to Rotate Hint & Reset Camera button (Bottom Left)
    const dragHintHtml = `
      <div id="drag-hint">
        <span>🖱️ ${currentLang === 'ru' ? 'Тяни фон для 3D вращения' : 'Drag background to rotate'}</span>
        <button id="reset-camera-btn">${currentLang === 'ru' ? 'Сброс 3D' : 'Reset'}</button>
      </div>
    `;
    $('body').append(dragHintHtml);

    // 5. Add Asteroid Belt to #solar-system
    if ($('#solar-system').length && !$('#asteroid-belt').length) {
      $('#solar-system').append('<div id="asteroid-belt"></div>');
    }

    // 6. Modal Overlays (Distance Calculator & Planet Info Modal)
    const modalsHtml = `
      <!-- Modal: Distance Calculator -->
      <div class="space-modal-overlay" id="modal-dist-calc">
        <div class="space-modal">
          <div class="modal-header">
            <h2><span>🛰️</span> <span id="dist-modal-title">${currentLang === 'ru' ? 'Калькулятор межпланетных расстояний и времени пути' : 'Interplanetary Distance & Speed Calculator'}</span></h2>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="calc-selectors">
              <div class="planet-select-box">
                <label id="lbl-planet-a">${currentLang === 'ru' ? 'Старт (Планета А)' : 'From (Planet A)'}</label>
                <select id="select-planet-a"></select>
              </div>
              <button class="calc-swap-btn" id="btn-swap-planets" title="Поменять местами">⇄</button>
              <div class="planet-select-box">
                <label id="lbl-planet-b">${currentLang === 'ru' ? 'Цель (Планета Б)' : 'To (Planet B)'}</label>
                <select id="select-planet-b"></select>
              </div>
            </div>

            <div class="calc-result-hero">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--space-muted);" id="lbl-cur-dist">
                ${currentLang === 'ru' ? 'Текущее динамическое расстояние' : 'Current Dynamic Distance'}
              </div>
              <div class="calc-distance-value" id="calc-res-km">---</div>
              <div class="calc-distance-sub" id="calc-res-au">--- AU</div>
              
              <div class="calc-stats-grid">
                <div class="stat-card">
                  <div class="stat-label" id="lbl-min-dist">${currentLang === 'ru' ? 'Минимум (сближение)' : 'Min (Closest)'}</div>
                  <div class="stat-val" id="calc-min-km">---</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label" id="lbl-max-dist">${currentLang === 'ru' ? 'Максимум (противостояние)' : 'Max (Furthest)'}</div>
                  <div class="stat-val" id="calc-max-km">---</div>
                </div>
                <div class="stat-card">
                  <div class="stat-label" id="lbl-radio-delay">${currentLang === 'ru' ? 'Задержка радио (свет)' : 'Radio Signal Delay'}</div>
                  <div class="stat-val" id="calc-light-time">---</div>
                </div>
              </div>
            </div>

            <!-- Speed & Travel Time -->
            <div class="speed-control-section">
              <label style="display:block; font-size: 12px; font-weight:600; color:#fff; margin-bottom: 6px;" id="lbl-flight-speed">
                ${currentLang === 'ru' ? 'Скорость перемещения (км/ч):' : 'Travel Speed (km/h):'}
              </label>
              <div style="display: flex; gap: 8px;">
                <input type="number" id="input-custom-speed" class="speed-custom-input" value="40000" min="1" step="1000">
                <span style="display: flex; align-items:center; color: var(--space-cyan); font-weight:700; font-size:13px;">км/ч</span>
              </div>
              
              <div class="speed-presets">
                <button class="preset-chip active" data-speed="40000">🚀 Apollo / Марс (40 000 км/ч)</button>
                <button class="preset-chip" data-speed="58536">🛸 New Horizons (58 536 км/ч)</button>
                <button class="preset-chip" data-speed="61200">🛰️ Voyager-1 (61 200 км/ч)</button>
                <button class="preset-chip" data-speed="2500">✈️ Сверхзвук (2 500 км/ч)</button>
                <button class="preset-chip" data-speed="120">🏎️ Автомобиль (120 км/ч)</button>
                <button class="preset-chip" data-speed="1079252848">💡 Скорость света (1.08 млрд км/ч)</button>
              </div>

              <div class="travel-time-banner">
                <div>
                  <div class="travel-time-title" id="lbl-est-time">${currentLang === 'ru' ? 'Время полета в одну сторону:' : 'One-way Travel Time:'}</div>
                  <div style="font-size: 11px; color: var(--space-muted); margin-top:2px;" id="calc-speed-summary">при 40 000 км/ч</div>
                </div>
                <div class="travel-time-val" id="calc-travel-time-res">---</div>
              </div>
            </div>

            <!-- Orbit Speed Comparison -->
            <div style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: var(--space-muted);" id="calc-orbit-comparison">
              ...
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Planet Info & Planetary Time HUD -->
      <div class="space-modal-overlay" id="modal-planet-hud">
        <div class="space-modal">
          <div class="modal-header">
            <h2><span>🪐</span> <span id="planet-hud-title">${currentLang === 'ru' ? 'Планетарная карточка & Местное время' : 'Planetary Card & Local Time'}</span></h2>
            <button class="modal-close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="planet-hero">
              <div class="planet-avatar" id="planet-modal-avatar">🌍</div>
              <div class="planet-hero-title">
                <h3 id="planet-modal-name">Земля</h3>
                <p id="planet-modal-type">Планета земной группы</p>
              </div>
            </div>

            <!-- Live Planetary Time -->
            <div class="planet-time-card">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:700; color:var(--space-cyan); text-transform:uppercase;" id="lbl-live-time">
                  ${currentLang === 'ru' ? '🕒 Живое планетарное время' : '🕒 Live Planetary Time'}
                </span>
                <span class="pill-badge" id="planet-modal-phase">☀️ День</span>
              </div>
              <div class="planet-time-grid">
                <div class="time-box-item">
                  <div class="title" id="lbl-planet-clock">${currentLang === 'ru' ? 'Местное время на планете' : 'Local Planetary Clock'}</div>
                  <div class="clock" id="planet-modal-clock">--:--:--</div>
                  <div class="sub" id="planet-modal-clock-sub">UTC</div>
                </div>
                <div class="time-box-item">
                  <div class="title" id="lbl-planet-daylen">${currentLang === 'ru' ? 'Продолжительность суток' : 'Day Length'}</div>
                  <div class="clock" style="font-size:16px; color:#ffd166;" id="planet-modal-daylen">24.0 ч</div>
                  <div class="sub" id="planet-modal-yearlen">Год: 365.25 дней</div>
                </div>
              </div>
            </div>

            <!-- Astronomical Props Grid -->
            <div class="props-grid">
              <div class="prop-row">
                <span class="prop-name" id="lbl-orb-speed">${currentLang === 'ru' ? 'Орбитальная скорость' : 'Orbital Speed'}</span>
                <span class="prop-value" id="planet-modal-speed">107 200 км/ч (29.8 км/с)</span>
              </div>
              <div class="prop-row">
                <span class="prop-name" id="lbl-dist-sun">${currentLang === 'ru' ? 'Расстояние до Солнца' : 'Distance from Sun'}</span>
                <span class="prop-value" id="planet-modal-dist">149.6 млн км</span>
              </div>
              <div class="prop-row">
                <span class="prop-name" id="lbl-gravity">${currentLang === 'ru' ? 'Гравитация' : 'Gravity'}</span>
                <span class="prop-value" id="planet-modal-gravity">9.81 м/с² (1.00g)</span>
              </div>
              <div class="prop-row">
                <span class="prop-name" id="lbl-temp">${currentLang === 'ru' ? 'Температура' : 'Temperature'}</span>
                <span class="prop-value" id="planet-modal-temp">+15 °C</span>
              </div>
              <div class="prop-row">
                <span class="prop-name" id="lbl-diameter">${currentLang === 'ru' ? 'Диаметр' : 'Diameter'}</span>
                <span class="prop-value" id="planet-modal-diameter">12 742 км</span>
              </div>
              <div class="prop-row">
                <span class="prop-name" id="lbl-moons">${currentLang === 'ru' ? 'Спутники' : 'Moons'}</span>
                <span class="prop-value" id="planet-modal-moons">1 (Луна)</span>
              </div>
            </div>

            <!-- Weight Calculator -->
            <div class="weight-card">
              <div style="font-size:12px; font-weight:700; color:#ffd166;" id="lbl-weight-title">
                ${currentLang === 'ru' ? '⚖️ Сколько ты весишь на этой планете?' : '⚖️ How much do you weigh here?'}
              </div>
              <div class="weight-calc-flex">
                <div style="width: 140px;" class="weight-box">
                  <input type="number" id="input-user-weight" value="70" min="1" max="500">
                </div>
                <span style="font-size:12px; color:var(--space-muted);">${currentLang === 'ru' ? 'кг на Земле' : 'kg on Earth'}</span>
                <div class="weight-calc-result" id="weight-calc-res">70.0 кг</div>
              </div>
              <div style="font-size:11px; color:var(--space-muted); margin-top:8px;" id="weight-calc-note">
                ${currentLang === 'ru' ? 'Прыжок в высоту будет такой же, как на Земле' : 'Your vertical jump will be standard'}
              </div>
            </div>

            <p style="font-size:12px; line-height:1.6; color:var(--space-muted); margin-top:16px;" id="planet-modal-desc">
              ...
            </p>
          </div>
        </div>
      </div>
    `;
    $('body').append(modalsHtml);

    populatePlanetSelects();
    updateDistanceCalculator();
    updatePlanetHudModal(currentPlanetId);
  }

  // Populate Planet Select Dropdowns
  function populatePlanetSelects() {
    const $selectA = $('#select-planet-a');
    const $selectB = $('#select-planet-b');
    $selectA.empty();
    $selectB.empty();

    const planetKeys = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

    planetKeys.forEach(k => {
      const p = PLANETS[k];
      const optA = $('<option>').val(k).text(`${p.emoji} ${p.name[currentLang]}`);
      const optB = $('<option>').val(k).text(`${p.emoji} ${p.name[currentLang]}`);
      $selectA.append(optA);
      $selectB.append(optB);
    });

    $selectA.val('earth');
    $selectB.val('mars');
  }

  // Update Distance Calculator Values
  function updateDistanceCalculator() {
    const idA = $('#select-planet-a').val() || 'earth';
    const idB = $('#select-planet-b').val() || 'mars';
    const pA = PLANETS[idA];
    const pB = PLANETS[idB];
    if (!pA || !pB) return;

    const data = calculateInterplanetaryDistance(idA, idB);
    if (!data) return;

    $('#calc-res-km').text(formatKm(data.curKm));
    $('#calc-res-au').text(`≈ ${data.curAu} AU (астрономических единиц)`);
    $('#calc-min-km').text(formatKm(data.minKm));
    $('#calc-max-km').text(formatKm(data.maxKm));

    // Radio signal time (speed of light: 299 792 km/s)
    const lightSecs = data.curKm / 299792;
    if (lightSecs < 60) {
      $('#calc-light-time').text(`${lightSecs.toFixed(1)} ${currentLang === 'ru' ? 'сек' : 'sec'}`);
    } else {
      const mins = Math.floor(lightSecs / 60);
      const remSecs = Math.round(lightSecs % 60);
      $('#calc-light-time').text(`${mins} ${currentLang === 'ru' ? 'мин' : 'min'} ${remSecs} ${currentLang === 'ru' ? 'сек' : 'sec'}`);
    }

    // Travel Time
    const hours = data.curKm / customSpeedKmh;
    $('#calc-travel-time-res').text(formatTravelTime(hours));
    $('#calc-speed-summary').text(
      currentLang === 'ru' 
        ? `при скорости ${customSpeedKmh.toLocaleString('ru-RU')} км/ч` 
        : `at speed ${customSpeedKmh.toLocaleString('en-US')} km/h`
    );

    // Orbital speeds comparison
    const speedDiff = Math.abs(pA.orbitalSpeedKmh - pB.orbitalSpeedKmh);
    const compText = currentLang === 'ru'
      ? `Орбитальная скорость ${pA.name.ru}: <strong>${pA.orbitalSpeedKmh.toLocaleString('ru-RU')} км/ч</strong> | ${pB.name.ru}: <strong>${pB.orbitalSpeedKmh.toLocaleString('ru-RU')} км/ч</strong>. Разница: <strong>${speedDiff.toLocaleString('ru-RU')} км/ч</strong>.`
      : `Orbital speed of ${pA.name.en}: <strong>${pA.orbitalSpeedKmh.toLocaleString('en-US')} km/h</strong> | ${pB.name.en}: <strong>${pB.orbitalSpeedKmh.toLocaleString('en-US')} km/h</strong>. Difference: <strong>${speedDiff.toLocaleString('en-US')} km/h</strong>.`;
    $('#calc-orbit-comparison').html(compText);
  }

  // Update Planet HUD Modal
  function updatePlanetHudModal(planetId) {
    const p = PLANETS[planetId] || PLANETS.earth;
    currentPlanetId = planetId;

    $('#planet-modal-avatar').text(p.emoji);
    $('#planet-modal-name').text(p.name[currentLang]);
    $('#planet-modal-type').text(p.type[currentLang]);

    const timeData = getPlanetaryTime(planetId);
    $('#planet-modal-phase').text(timeData.phase);
    $('#planet-modal-clock').text(timeData.clock);
    $('#planet-modal-clock-sub').text(timeData.sub);

    const dayText = p.dayLengthHours >= 24
      ? (p.dayLengthHours / 24).toFixed(1) + (currentLang === 'ru' ? ' земных дней' : ' Earth days')
      : Math.floor(p.dayLengthHours) + 'ч ' + Math.round((p.dayLengthHours % 1) * 60) + 'м';
    $('#planet-modal-daylen').text(dayText);

    const yearText = p.orbitPeriodDays > 0 
      ? (currentLang === 'ru' ? `Год: ${p.orbitPeriodDays} земн. дн.` : `Year: ${p.orbitPeriodDays} earth days`)
      : (currentLang === 'ru' ? 'Галактический год: ~230 млн лет' : 'Galactic year: ~230M yrs');
    $('#planet-modal-yearlen').text(yearText);

    $('#planet-modal-speed').text(`${p.orbitalSpeedKmh.toLocaleString('ru-RU')} км/ч (${p.orbitalSpeedKms} км/с)`);
    $('#planet-modal-dist').text(formatKm(p.distanceFromSunKm));
    $('#planet-modal-gravity').text(`${p.gravity} м/с² (${p.gravityRatio}g)`);
    $('#planet-modal-temp').text(p.temp);
    $('#planet-modal-diameter').text(`${p.diameterKm.toLocaleString('ru-RU')} км`);
    $('#planet-modal-moons').text(String(p.moons));
    $('#planet-modal-desc').text(p.description[currentLang]);

    updateWeightCalc(planetId);
  }

  // Update Weight Calculation
  function updateWeightCalc(planetId) {
    const p = PLANETS[planetId] || PLANETS.earth;
    const calcWeight = (userWeightKg * p.gravityRatio).toFixed(1);
    $('#weight-calc-res').text(`${calcWeight} ${currentLang === 'ru' ? 'кг' : 'kg'}`);

    let note = '';
    if (p.gravityRatio < 0.9) {
      const jumpRatio = (1 / p.gravityRatio).toFixed(1);
      note = currentLang === 'ru' 
        ? `Твоя легкость позволит прыгнуть в ${jumpRatio} раз выше, чем на Земле!`
        : `Low gravity allows you to jump ${jumpRatio}x higher than on Earth!`;
    } else if (p.gravityRatio > 1.2) {
      note = currentLang === 'ru'
        ? `Колоссальная гравитация! Поднять собственную руку будет невероятно тяжело.`
        : `Intense gravity! Even lifting your arm will require immense effort.`;
    } else {
      note = currentLang === 'ru'
        ? `Гравитация почти как на Земле — привычное ощущение веса.`
        : `Gravity is very close to Earth — standard weight sensation.`;
    }
    $('#weight-calc-note').text(note);
  }

  // Update Top Right Floating Pill
  function updateFloatingHudPill() {
    const p = PLANETS[currentPlanetId] || PLANETS.earth;
    const t = getPlanetaryTime(currentPlanetId);

    $('#hud-pill-name').text(`${p.emoji} ${p.name[currentLang]}`);
    $('#hud-pill-phase').text(t.phase);
    $('#hud-pill-clock').text(t.clock);
    $('#hud-pill-speed').text(`${p.orbitalSpeedKmh.toLocaleString('ru-RU')} км/ч`);
    $('#hud-pill-day').text(t.dayName);
  }

  // Apply Time Warp to CSS Animations
  function setTimeWarp(warp) {
    const $orbits = $('.orbit, .pos, .planet, .satelite, .ring');
    if (warp === 'pause') {
      isOrbitPaused = !isOrbitPaused;
      if (isOrbitPaused) {
        $orbits.css('animation-play-state', 'paused');
        $('#time-btn-pause').text('▶️').addClass('active');
      } else {
        $orbits.css('animation-play-state', 'running');
        $('#time-btn-pause').text('⏸️').removeClass('active');
      }
      return;
    }

    if (isOrbitPaused) {
      isOrbitPaused = false;
      $orbits.css('animation-play-state', 'running');
      $('#time-btn-pause').text('⏸️').removeClass('active');
    }

    if (warp === 'reverse') {
      const curDir = $orbits.css('animation-direction') || 'normal';
      $orbits.css('animation-direction', curDir === 'reverse' ? 'normal' : 'reverse');
      return;
    }

    const factor = parseFloat(warp) || 1;
    timeWarpScale = factor;

    // Scale animation durations
    const baseDurations = {
      mercury: 2.89016,
      venus: 7.38237,
      earth: 12.00021,
      mars: 22.57017,
      jupiter: 142.35138,
      saturn: 353.36998,
      uranus: 1008.20215,
      neptune: 1977.49584
    };

    Object.keys(baseDurations).forEach(k => {
      const dur = (baseDurations[k] / factor).toFixed(5) + 's';
      $(`#${k}.orbit, #${k} .pos, #${k} .planet`).css('animation-duration', dur);
    });
  }

  // Free 3D Drag-To-Rotate
  function init3DDrag() {
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentRotateX = 75; // initial view-3D angle
    let currentRotateZ = 0;

    const $solarSys = $('#solar-system');

    $(document).on('mousedown touchstart', function(e) {
      // Don't drag if clicking buttons, modals, navbar or controls
      if ($(e.target).closest('#navbar, #controls, #data, .space-modal-overlay, #live-hud-pill, #time-warp-bar, #drag-hint').length) {
        return;
      }
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
    });

    $(document).on('mousemove touchmove', function(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      currentRotateZ += deltaX * 0.3;
      currentRotateX -= deltaY * 0.3;

      // Clamp X tilt between 10deg and 90deg
      currentRotateX = Math.max(10, Math.min(90, currentRotateX));

      $solarSys.css('transform', `rotateX(${currentRotateX}deg) rotateZ(${currentRotateZ}deg)`);

      startX = clientX;
      startY = clientY;
    });

    $(document).on('mouseup touchend', function() {
      isDragging = false;
    });

    $('#reset-camera-btn').on('click', function() {
      currentRotateX = 75;
      currentRotateZ = 0;
      $solarSys.css('transform', `rotateX(75deg) rotateZ(0deg)`);
    });
  }

  // Populate Asteroids in the Belt
  function populateAsteroids() {
    const $belt = $('#asteroid-belt');
    if (!$belt.length) return;
    $belt.empty();

    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360 + (Math.random() * 8 - 4);
      const rad = (angle * Math.PI) / 180;
      const dist = 31 + (Math.random() * 2 - 1); // em
      const x = Math.cos(rad) * dist;
      const y = Math.sin(rad) * dist;
      const size = (Math.random() * 3 + 2).toFixed(1);
      const opacity = (Math.random() * 0.5 + 0.4).toFixed(2);

      const $ast = $('<div>').css({
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: '#dcdcdc',
        opacity: opacity,
        transform: `translate(${x}em, ${y}em)`,
        boxShadow: '0 0 4px rgba(255,255,255,0.8)'
      });
      $belt.append($ast);
    }
  }

  // --- Event Bindings ---
  function bindEvents() {
    // Nav Modal Toggles
    $('#btn-open-dist-calc').on('click', function(e) {
      e.preventDefault();
      updateDistanceCalculator();
      $('#modal-dist-calc').addClass('open');
    });

    $('#btn-open-planet-hud, #live-hud-pill').on('click', function(e) {
      e.preventDefault();
      updatePlanetHudModal(currentPlanetId);
      $('#modal-planet-hud').addClass('open');
    });

    // Close Modals
    $('.modal-close-btn, .space-modal-overlay').on('click', function(e) {
      if ($(e.target).hasClass('space-modal-overlay') || $(e.target).hasClass('modal-close-btn')) {
        $('.space-modal-overlay').removeClass('open');
      }
    });

    // Planet select changes
    $('#select-planet-a, #select-planet-b').on('change', function() {
      updateDistanceCalculator();
    });

    // Swap planets button
    $('#btn-swap-planets').on('click', function() {
      const a = $('#select-planet-a').val();
      const b = $('#select-planet-b').val();
      $('#select-planet-a').val(b);
      $('#select-planet-b').val(a);
      updateDistanceCalculator();
    });

    // Speed Preset Chips
    $('.preset-chip').on('click', function() {
      $('.preset-chip').removeClass('active');
      $(this).addClass('active');
      const spd = parseInt($(this).data('speed'), 10);
      customSpeedKmh = spd;
      $('#input-custom-speed').val(spd);
      updateDistanceCalculator();
    });

    // Custom Speed Input
    $('#input-custom-speed').on('input change', function() {
      const val = parseInt($(this).val(), 10) || 1;
      customSpeedKmh = val;
      $('.preset-chip').removeClass('active');
      updateDistanceCalculator();
    });

    // User Weight Input
    $('#input-user-weight').on('input change', function() {
      const val = parseFloat($(this).val()) || 1;
      userWeightKg = val;
      updateWeightCalc(currentPlanetId);
    });

    // Time Warp Buttons
    $('.time-btn').on('click', function() {
      const warp = $(this).data('warp');
      if (warp !== 'pause' && warp !== 'reverse') {
        $('.time-btn').not('#time-btn-pause').removeClass('active');
        $(this).addClass('active');
      }
      setTimeWarp(warp);
    });

    // Language Toggle
    $('#btn-toggle-lang').on('click', function() {
      currentLang = currentLang === 'ru' ? 'en' : 'ru';
      $(this).text(currentLang === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN');
      populatePlanetSelects();
      updateDistanceCalculator();
      updatePlanetHudModal(currentPlanetId);
      updateFloatingHudPill();

      // Update button text in navbar
      $('.nav-extra-actions #btn-open-dist-calc .nav-btn-text').text(
        currentLang === 'ru' ? 'Расстояния & км/ч' : 'Distance & Speed'
      );
      $('.nav-extra-actions #btn-open-planet-hud .nav-btn-text').text(
        currentLang === 'ru' ? 'Время планет' : 'Planet Time'
      );
      $('#drag-hint span').text(
        currentLang === 'ru' ? '🖱️ Тяни фон для 3D вращения' : '🖱️ Drag background to rotate'
      );
      $('#reset-camera-btn').text(
        currentLang === 'ru' ? 'Сброс 3D' : 'Reset'
      );
    });

    // Hook into planet selection in #data menu
    $('#data a').on('click', function() {
      const cls = $(this).attr('class') || '';
      const planetKey = cls.replace('active', '').trim();
      if (PLANETS[planetKey]) {
        currentPlanetId = planetKey;
        updateFloatingHudPill();
        updatePlanetHudModal(planetKey);
      }
    });

    // Also clicking on planet orbits selects the planet
    $('.orbit, .pos, .planet').on('click', function(e) {
      const $orbit = $(this).closest('.orbit');
      const id = $orbit.attr('id');
      if (id && PLANETS[id]) {
        $(`#data a.${id}`).trigger('click');
      }
    });
  }

  // --- Main Tick Timer ---
  function startTickLoop() {
    setInterval(() => {
      updateFloatingHudPill();

      // If planet modal is open, tick its clock too
      if ($('#modal-planet-hud').hasClass('open')) {
        const timeData = getPlanetaryTime(currentPlanetId);
        $('#planet-modal-clock').text(timeData.clock);
        $('#planet-modal-clock-sub').text(timeData.sub);
        $('#planet-modal-phase').text(timeData.phase);
      }

      // If distance modal is open, update dynamic distance
      if ($('#modal-dist-calc').hasClass('open')) {
        updateDistanceCalculator();
      }
    }, 1000);
  }

  // Initialize once DOM is ready
  $(function() {
    initAddonUI();
    bindEvents();
    init3DDrag();
    populateAsteroids();
    startTickLoop();
  });

})(jQuery);
