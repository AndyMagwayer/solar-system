// Planetary Time & Interplanetary Distance Calculator
// Designed to seamlessly fit AndyMagwayer's original Solar System aesthetic
(function($) {
  'use strict';

  var PLANET_DATA = {
    sun: {
      name: 'Sun',
      orbitRadiusKm: 0,
      orbitPeriodDays: 0,
      orbitalSpeedKmh: 828000,
      dayHours: 609.6
    },
    mercury: {
      name: 'Mercury',
      orbitRadiusKm: 57910000,
      orbitPeriodDays: 88,
      orbitalSpeedKmh: 170503,
      dayHours: 4222.6
    },
    venus: {
      name: 'Venus',
      orbitRadiusKm: 108200000,
      orbitPeriodDays: 224.7,
      orbitalSpeedKmh: 126074,
      dayHours: 2802.0
    },
    earth: {
      name: 'Earth',
      orbitRadiusKm: 149598262,
      orbitPeriodDays: 365.25,
      orbitalSpeedKmh: 107218,
      dayHours: 24.0
    },
    mars: {
      name: 'Mars',
      orbitRadiusKm: 227943824,
      orbitPeriodDays: 687,
      orbitalSpeedKmh: 86677,
      dayHours: 24.6597
    },
    jupiter: {
      name: 'Jupiter',
      orbitRadiusKm: 778340821,
      orbitPeriodDays: 4333,
      orbitalSpeedKmh: 47002,
      dayHours: 9.925
    },
    saturn: {
      name: 'Saturn',
      orbitRadiusKm: 1426666422,
      orbitPeriodDays: 10759,
      orbitalSpeedKmh: 34701,
      dayHours: 10.55
    },
    uranus: {
      name: 'Uranus',
      orbitRadiusKm: 2870658186,
      orbitPeriodDays: 30685,
      orbitalSpeedKmh: 24477,
      dayHours: 17.24
    },
    neptune: {
      name: 'Neptune',
      orbitRadiusKm: 4498396441,
      orbitPeriodDays: 60190,
      orbitalSpeedKmh: 19566,
      dayHours: 16.11
    }
  };

  function getPlanetaryTime(id) {
    var now = new Date();
    var ms = now.getTime();

    if (id === 'earth') {
      var h = String(now.getUTCHours()).padStart(2, '0');
      var m = String(now.getUTCMinutes()).padStart(2, '0');
      var s = String(now.getUTCSeconds()).padStart(2, '0');
      return {
        time: h + ':' + m + ':' + s + ' UTC',
        sub: 'Solar Day: 24h 00m'
      };
    }

    if (id === 'mars') {
      // NASA Martian Sol Time calculation
      var jd = (ms / 86400000) + 2440587.5;
      var msd = (jd - 2405522.0028779) / 1.0274912517;
      var totalHours = (msd % 1) * 24;
      var mh = Math.floor(totalHours);
      var mm = Math.floor((totalHours - mh) * 60);
      var msSec = Math.floor((((totalHours - mh) * 60) - mm) * 60);
      var sol = Math.floor(msd);
      return {
        time: String(mh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':' + String(msSec).padStart(2, '0') + ' (Sol ' + sol + ')',
        sub: 'Martian Sol: 24h 39m'
      };
    }

    var p = PLANET_DATA[id];
    if (p && p.dayHours) {
      if (p.dayHours > 48) {
        // Long rotation planets (Mercury, Venus, Sun)
        var daysFraction = ((ms / 1000) / (p.dayHours * 3600)) % 1;
        var curDay = Math.floor(daysFraction * (p.dayHours / 24));
        var totalDays = Math.round(p.dayHours / 24);
        var phase = daysFraction < 0.5 ? 'Daylight' : 'Night';
        return {
          time: 'Day ' + curDay + ' / ' + totalDays + ' (' + phase + ')',
          sub: 'Rotation: ' + totalDays + ' Earth Days'
        };
      } else {
        // Fast rotation giants (Jupiter, Saturn, Uranus, Neptune)
        var cycleSecs = p.dayHours * 3600;
        var curSecs = (ms / 1000) % cycleSecs;
        var normHours = (curSecs / cycleSecs) * 24;
        var gh = Math.floor(normHours);
        var gm = Math.floor((normHours - gh) * 60);
        var gs = Math.floor((((normHours - gh) * 60) - gm) * 60);
        var hLen = Math.floor(p.dayHours);
        var mLen = Math.round((p.dayHours % 1) * 60);
        return {
          time: String(gh).padStart(2, '0') + ':' + String(gm).padStart(2, '0') + ':' + String(gs).padStart(2, '0'),
          sub: 'Rotation: ' + hLen + 'h ' + String(mLen).padStart(2, '0') + 'm'
        };
      }
    }

    return { time: '--:--', sub: '' };
  }

  // Update live time on each planet's .infos callout
  function updateAllPlanetsTime() {
    var planetKeys = Object.keys(PLANET_DATA);
    for (var i = 0; i < planetKeys.length; i++) {
      var id = planetKeys[i];
      var t = getPlanetaryTime(id);
      var $dd = $('#' + id + ' dl.infos dd');
      var $span = $dd.find('span');
      $dd.attr('data-time', t.time);
      $span.attr('data-time-sub', t.sub);
    }
  }

  // Calculate dynamic interplanetary distance
  function calcDistance(idA, idB) {
    var pA = PLANET_DATA[idA];
    var pB = PLANET_DATA[idB];
    if (!pA || !pB) return null;

    if (idA === idB) {
      return { curKm: 0, minKm: 0, maxKm: 0, au: 0 };
    }

    var rA = pA.orbitRadiusKm;
    var rB = pB.orbitRadiusKm;

    if (rA === 0) return { curKm: rB, minKm: rB, maxKm: rB, au: (rB / 149598262).toFixed(2) };
    if (rB === 0) return { curKm: rA, minKm: rA, maxKm: rA, au: (rA / 149598262).toFixed(2) };

    var nowDays = Date.now() / (1000 * 86400);
    var thetaA = (2 * Math.PI * nowDays) / (pA.orbitPeriodDays || 365.25);
    var thetaB = (2 * Math.PI * nowDays) / (pB.orbitPeriodDays || 365.25);

    var xA = rA * Math.cos(thetaA);
    var yA = rA * Math.sin(thetaA);
    var xB = rB * Math.cos(thetaB);
    var yB = rB * Math.sin(thetaB);

    var curKm = Math.round(Math.hypot(xA - xB, yA - yB));
    var minKm = Math.abs(rA - rB);
    var maxKm = rA + rB;
    var au = (curKm / 149598262).toFixed(2);

    return { curKm: curKm, minKm: minKm, maxKm: maxKm, au: au };
  }

  function formatTimeDuration(hours) {
    if (hours <= 0) return '0 hours';
    var days = hours / 24;
    var years = days / 365.25;

    if (years >= 1) {
      var y = Math.floor(years);
      var d = Math.round((years - y) * 365.25);
      return y + ' yrs ' + (d > 0 ? d + ' days' : '');
    }
    if (days >= 1) {
      var dInt = Math.floor(days);
      var hInt = Math.round((days - dInt) * 24);
      return dInt + ' days ' + (hInt > 0 ? hInt + ' hrs' : '');
    }
    var hOnly = Math.floor(hours);
    var mOnly = Math.round((hours - hOnly) * 60);
    return hOnly + ' hrs ' + mOnly + ' mins';
  }

  function formatKmNumber(num) {
    return num.toLocaleString('en-US') + ' km';
  }

  function updateCalculatorUI() {
    var fromId = $('#calc-from').val() || 'earth';
    var toId = $('#calc-to').val() || 'mars';
    var speed = parseFloat($('#calc-speed-input').val()) || 40000;

    var dist = calcDistance(fromId, toId);
    if (!dist) return;

    $('#calc-dist-km').text(formatKmNumber(dist.curKm));
    $('#calc-dist-au').text(dist.au + ' AU (Astronomical Units)');
    $('#calc-min-km').text(formatKmNumber(dist.minKm));
    $('#calc-max-km').text(formatKmNumber(dist.maxKm));

    // Speed of light delay
    var lightSecs = dist.curKm / 299792;
    if (lightSecs < 60) {
      $('#calc-light-delay').text(lightSecs.toFixed(1) + ' sec');
    } else {
      var mins = Math.floor(lightSecs / 60);
      var secs = Math.round(lightSecs % 60);
      $('#calc-light-delay').text(mins + 'm ' + secs + 's');
    }

    // Travel time
    var travelHours = dist.curKm / speed;
    $('#calc-travel-time').text(formatTimeDuration(travelHours));

    // Footer info
    var pFrom = PLANET_DATA[fromId];
    var pTo = PLANET_DATA[toId];
    var tDest = getPlanetaryTime(toId);

    var html = 'Orbital speed: <strong>' + pFrom.name + '</strong> ' + formatKmNumber(pFrom.orbitalSpeedKmh) + '/h &bull; ' +
               '<strong>' + pTo.name + '</strong> ' + formatKmNumber(pTo.orbitalSpeedKmh) + '/h<br>' +
               'Current time on <strong>' + pTo.name + '</strong>: ' + tDest.time;
    $('#calc-planet-times-info').html(html);
  }

  function initCalculator() {
    var $from = $('#calc-from');
    var $to = $('#calc-to');
    if (!$from.length || !$to.length) return;

    $from.empty();
    $to.empty();

    var planetKeys = Object.keys(PLANET_DATA);
    for (var i = 0; i < planetKeys.length; i++) {
      var k = planetKeys[i];
      var name = PLANET_DATA[k].name;
      $from.append($('<option>').val(k).text(name));
      $to.append($('<option>').val(k).text(name));
    }

    $from.val('earth');
    $to.val('mars');

    $('#calc-from, #calc-to, #calc-speed-input').on('change input', function() {
      updateCalculatorUI();
    });

    $('.calc-preset-btn').on('click', function(e) {
      e.preventDefault();
      $('.calc-preset-btn').removeClass('active');
      $(this).addClass('active');
      var spd = $(this).data('speed');
      $('#calc-speed-input').val(spd);
      updateCalculatorUI();
    });

    $('#close-calc-btn, #calc-backdrop').on('click', function() {
      $('#calc-panel, #calc-backdrop').removeClass('open');
      // Restore checked radio in controls
      $('.set-speed').prop('checked', true).trigger('click');
    });

    updateCalculatorUI();
  }

  $(function() {
    updateAllPlanetsTime();
    initCalculator();

    // Live update every second
    setInterval(function() {
      updateAllPlanetsTime();
      if ($('#calc-panel').hasClass('open')) {
        updateCalculatorUI();
      }
    }, 1000);
  });

})(jQuery);
