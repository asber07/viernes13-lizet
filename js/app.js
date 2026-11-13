/**
 * APLICACIÓN PRINCIPAL - VIERNES 13 (MODO SPOTIFY)
 * Dedicado a Lizet: "eres mi viernes 13... TE AMO LIZET"
 * Compatible 100% con GitHub Pages y ejecución local.
 */

// Letra sincronizada oficial (37 versos con marcas exactas de tiempo de letra.lrc)
const LYRICS_DATA = [
  { time: 1.10, text: "Tú tienes todo lo que busco" },
  { time: 3.35, text: "Conocerte para mí es todo un gusto" },
  { time: 6.19, text: "Tienes algo en particular, algo que te hace más" },
  { time: 9.89, text: "Algo que no entiendo, que no me para de enamorar" },
  { time: 14.07, text: "Tú sabes bien quién eres, la que me mancha de labial" },
  { time: 17.75, text: "La que se duerme sin despedir y sin avisar" },
  { time: 20.91, text: "La que le encanta molestar y fregar" },
  { time: 24.26, text: "La más bella del lugar" },
  { time: 26.64, text: "Y me llevas lentamente a imaginar" },
  { time: 33.07, text: "A una vida donde tú puedas estar" },
  { time: 39.43, text: "Y me llevas lentamente a imaginar" },
  { time: 46.25, text: "A una vida donde te pueda cuidar" },
  { time: 52.81, text: "Yo sé que te he dicho mil veces" },
  { time: 55.39, text: "Que nadie te va a querer, como yo lo voy a hacer" },
  { time: 58.11, text: "Que tú pones buena suerte en mi viernes 13" },
  { time: 61.02, text: "Que tengo tu nombre tatuado en mi piel" },
  { time: 62.92, text: "Que ya te extraño, aunque te haya visto ayer" },
  { time: 65.18, text: "Sostente fuerte, yo siento lo mismo que tú sientes" },
  { time: 67.84, text: "Miradas que no mienten, sonrisas que muestran dientes" },
  { time: 70.70, text: "Contigo todo es más que suficiente" },
  { time: 73.64, text: "No ocupo de alguien más, solo a ti presente" },
  { time: 78.17, text: "Y me llevas lentamente a imaginar" },
  { time: 83.85, text: "A una vida donde tú puedas estar" },
  { time: 89.06, text: "Y me llevas lentamente a imaginar" },
  { time: 95.06, text: "A una vida donde te pueda cuidar" },
  { time: 101.29, text: "Porque si no es contigo, no es con nadie más" },
  { time: 104.68, text: "Es algo que tú nunca, nunca entenderás" },
  { time: 107.51, text: "Con alguien más, yo no me puedo conformar" },
  { time: 110.20, text: "Sabiendo que alguien va a tomar mi lugar" },
  { time: 113.12, text: "Nadie te verá, como yo te voy a ver" },
  { time: 116.01, text: "Quiero cumplir las cosas que acordamos en hacer" },
  { time: 118.81, text: "Y si la vida me da a escoger" },
  { time: 121.29, text: "Te escojo a ti, otra vez" },
  { time: 146.08, text: "Y me llevas lentamente a imaginar" },
  { time: 152.53, text: "A una vida donde tú puedas estar" },
  { time: 159.40, text: "Y me llevas lentamente a imaginar" },
  { time: 165.33, text: "A una vida donde te pueda cuidar" }
];

// Rutas de audio con alternativas de respaldo seguro
const AUDIO_SOURCES = [
  "musica/cancion.mp3",
  "musica/viernes-13.mp3",
  "musica/Marcos Menchaca - Viernes 13 (Letra).mp3"
];

// Estado global
let currentLyrics = [...LYRICS_DATA];
let activeLyricIndex = -1;
let isSeeking = false;
let isLooping = false;

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar Canvas de Fondo
  initCanvasParticles();

  // Etapas
  const stageLogin = document.getElementById("stage-login");
  const stageWelcome = document.getElementById("stage-welcome");
  const stageMusic = document.getElementById("stage-music");
  const stageFinale = document.getElementById("stage-finale");

  // Login
  const loginForm = document.getElementById("login-form");
  const passwordInput = document.getElementById("password-input");
  const togglePwdBtn = document.getElementById("toggle-pwd-btn");
  const loginError = document.getElementById("login-error");

  // Welcome
  const btnStartMusic = document.getElementById("btn-start-music");

  // Spotify Player
  const audio = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-btn");
  const playIcon = document.getElementById("icon-play");
  const pauseIcon = document.getElementById("icon-pause");
  const rewindBtn = document.getElementById("rewind-btn");
  const forwardBtn = document.getElementById("forward-btn");
  const loopBtn = document.getElementById("loop-btn");
  const likeBtn = document.getElementById("like-btn");
  const progressWrap = document.getElementById("progress-wrap");
  const progressFill = document.getElementById("progress-fill");
  const currentTimeEl = document.getElementById("current-time");
  const durationTimeEl = document.getElementById("duration-time");
  const lyricsViewport = document.getElementById("lyrics-viewport");
  const toFinaleBtn = document.getElementById("to-finale-btn");

  // Finale
  const btnReplaySong = document.getElementById("btn-replay-song");
  const btnRestartApp = document.getElementById("btn-restart-app");

  // ==========================================
  // NAVEGACIÓN ENTRE ETAPAS
  // ==========================================
  function goToStage(stageId) {
    [stageLogin, stageWelcome, stageMusic, stageFinale].forEach(stage => {
      stage.classList.remove("is-active");
    });

    const target = document.getElementById(stageId);
    if (target) {
      target.classList.add("is-active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ==========================================
  // CONFIGURACIÓN DE AUDIO
  // ==========================================
  function setupAudioSources() {
    let sourceIndex = 0;

    function tryNextSource() {
      if (sourceIndex < AUDIO_SOURCES.length) {
        audio.src = AUDIO_SOURCES[sourceIndex];
        sourceIndex++;
      }
    }

    audio.addEventListener("error", () => {
      console.warn("Fallo al cargar fuente de audio, intentando siguiente...");
      tryNextSource();
    });

    tryNextSource();
  }

  setupAudioSources();

  // ==========================================
  // 1. PANTALLA DE ENTRADA (LOGIN)
  // ==========================================
  togglePwdBtn.addEventListener("click", () => {
    const isPass = passwordInput.type === "password";
    passwordInput.type = isPass ? "text" : "password";
    togglePwdBtn.setAttribute("aria-label", isPass ? "Ocultar clave" : "Mostrar clave");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = passwordInput.value.trim().toLowerCase();

    // Contraseña requerida: viernes13
    if (val === "viernes13") {
      loginError.textContent = "";
      passwordInput.classList.remove("has-error");
      goToStage("stage-welcome");
    } else {
      loginError.textContent = "Contraseña incorrecta. Pista: nuestro día especial";
      passwordInput.classList.add("has-error");
      
      const card = document.getElementById("login-card");
      card.style.animation = "shakeError 0.45s ease";
      setTimeout(() => {
        card.style.animation = "";
      }, 500);
    }
  });

  // ==========================================
  // 2. BIENVENIDA -> MÚSICA
  // ==========================================
  btnStartMusic.addEventListener("click", () => {
    goToStage("stage-music");
    audio.play().then(() => {
      updatePlayPauseUI(true);
    }).catch(err => {
      console.warn("Autoplay prevenido por el navegador:", err);
      updatePlayPauseUI(false);
    });
  });

  // ==========================================
  // 3. REPRODUCTOR SPOTIFY & CONTROLES
  // ==========================================
  function updatePlayPauseUI(isPlaying) {
    if (isPlaying) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  }

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => updatePlayPauseUI(true));
    } else {
      audio.pause();
      updatePlayPauseUI(false);
    }
  });

  rewindBtn.addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  forwardBtn.addEventListener("click", () => {
    audio.currentTime = Math.min(audio.duration || 9999, audio.currentTime + 10);
  });

  loopBtn.addEventListener("click", () => {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopBtn.classList.toggle("active", isLooping);
    loopBtn.title = isLooping ? "Repetir activado" : "Repetir desactivado";
  });

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.toggle("is-liked");
    triggerHeartConfetti();
  });

  toFinaleBtn.addEventListener("click", () => {
    goToStage("stage-finale");
  });

  // Barra de progreso interactiva (Seeker)
  progressWrap.addEventListener("click", (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * (audio.duration || 0);
    if (!isNaN(targetTime)) {
      audio.currentTime = targetTime;
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatDuration(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (!isSeeking && audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;
      currentTimeEl.textContent = formatDuration(audio.currentTime);
    }

    syncLyricsWithTime(audio.currentTime);
  });

  audio.addEventListener("play", () => updatePlayPauseUI(true));
  audio.addEventListener("pause", () => updatePlayPauseUI(false));

  audio.addEventListener("ended", () => {
    updatePlayPauseUI(false);
    if (!isLooping) {
      setTimeout(() => {
        goToStage("stage-finale");
      }, 1500);
    }
  });

  // ==========================================
  // 4. LETRA SINCRONIZADA ESTILO SPOTIFY
  // ==========================================
  function renderLyrics() {
    lyricsViewport.innerHTML = "";

    currentLyrics.forEach((line, index) => {
      const lineEl = document.createElement("div");
      lineEl.className = "lyric-line";
      lineEl.dataset.index = index;
      lineEl.dataset.time = line.time;
      lineEl.textContent = line.text;

      lineEl.addEventListener("click", () => {
        audio.currentTime = line.time;
        if (audio.paused) {
          audio.play().then(() => updatePlayPauseUI(true));
        }
      });

      lyricsViewport.appendChild(lineEl);
    });
  }

  function syncLyricsWithTime(time) {
    if (!currentLyrics || currentLyrics.length === 0) return;

    // Buscar el índice del verso actual
    let newIndex = -1;
    for (let i = 0; i < currentLyrics.length; i++) {
      if (currentLyrics[i].time <= time) {
        newIndex = i;
      } else {
        break;
      }
    }

    if (newIndex !== activeLyricIndex) {
      activeLyricIndex = newIndex;

      const lines = lyricsViewport.querySelectorAll(".lyric-line");
      lines.forEach((el, idx) => {
        el.classList.remove("is-active");
        if (idx < activeLyricIndex) {
          el.classList.add("is-passed");
        } else {
          el.classList.remove("is-passed");
        }

        if (idx === activeLyricIndex) {
          el.classList.add("is-active");
          // Centrar automáticamente en el contenedor de letras (efecto Spotify)
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }
  }

  // Render inicial de letras
  renderLyrics();

  // Intentar cargar dinámicamente letra/letra.lrc si está disponible
  fetch("letra/letra.lrc")
    .then(r => r.ok ? r.text() : Promise.reject())
    .catch(() => fetch("LETRA/letra.lrc").then(r => r.ok ? r.text() : Promise.reject()))
    .then(text => {
      if (text) {
        parseLrcContent(text);
      }
    })
    .catch(() => {
      console.log("Usando letra precargada integrada.");
    });

  function parseLrcContent(lrcText) {
    const timeRegex = /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/;
    const rawLines = lrcText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const parsed = [];

    rawLines.forEach(line => {
      if (/^\[(ti|ar|al|by|offset):/i.test(line)) return;
      const match = line.match(timeRegex);
      if (match) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const frac = match[3] ? parseFloat("0." + match[3]) : 0;
        const time = mins * 60 + secs + frac;
        const cleanText = line.replace(timeRegex, "").trim();
        parsed.push({ time, text: cleanText || "♪" });
      }
    });

    if (parsed.length > 0) {
      currentLyrics = parsed;
      renderLyrics();
    }
  }

  // ==========================================
  // 5. CARTA FINAL & ACCIONES
  // ==========================================
  btnReplaySong.addEventListener("click", () => {
    goToStage("stage-music");
    audio.currentTime = 0;
    audio.play().then(() => updatePlayPauseUI(true));
  });

  btnRestartApp.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    updatePlayPauseUI(false);
    passwordInput.value = "";
    goToStage("stage-login");
  });

  // Atajos de teclado generales (Espacio para play/pause, etc.)
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.code === "Space") {
      e.preventDefault();
      if (!audio.paused) {
        audio.pause();
        updatePlayPauseUI(false);
      } else {
        audio.play().then(() => updatePlayPauseUI(true));
      }
    } else if (e.code === "ArrowLeft") {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    } else if (e.code === "ArrowRight") {
      audio.currentTime = Math.min(audio.duration || 9999, audio.currentTime + 5);
    }
  });

});

// Formateador de tiempo mm:ss
function formatDuration(sec) {
  if (isNaN(sec) || sec === null || sec === undefined) return "0:00";
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// ==========================================================================
// EFECTO CONFETI DE CORAZONES ROMÁNTICOS
// ==========================================================================
function triggerHeartConfetti() {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.innerHTML = Math.random() > 0.4 ? "❤️" : (Math.random() > 0.5 ? "🌻" : "💖");
    heart.style.position = "fixed";
    heart.style.left = `${50 + (Math.random() * 20 - 10)}vw`;
    heart.style.bottom = `${30 + (Math.random() * 20)}vh`;
    heart.style.fontSize = `${1.2 + Math.random() * 1.5}rem`;
    heart.style.zIndex = "9999";
    heart.style.pointerEvents = "none";
    heart.style.transform = `scale(0.5) translate(0, 0)`;
    heart.style.transition = `all ${1.2 + Math.random() * 0.8}s cubic-bezier(0.1, 1, 0.1, 1)`;
    heart.style.opacity = "1";
    document.body.appendChild(heart);

    setTimeout(() => {
      const angle = (Math.random() - 0.5) * 350;
      const dist = 120 + Math.random() * 200;
      heart.style.transform = `scale(1.2) translate(${Math.sin(angle) * dist}px, ${-dist}px) rotate(${Math.random() * 360}deg)`;
      heart.style.opacity = "0";
    }, 20);

    setTimeout(() => {
      heart.remove();
    }, 2200);
  }
}

// ==========================================================================
// CANVAS DE FONDO: PÉTALOS DE GIRASOL Y DESTELLOS DORADOS
// ==========================================================================
function initCanvasParticles() {
  const canvas = document.getElementById("canvas-backdrop");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const PARTICLE_COUNT = 38;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 4 + Math.random() * 8,
      speedY: 0.6 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.7,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04,
      isPetal: i % 2 === 0,
      opacity: 0.2 + Math.random() * 0.5,
      hue: Math.random() > 0.3 ? 42 : 350 // Oro de girasol y carmesí suave
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * p.speedX;
      p.angle += p.spin;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;

      if (p.isPetal) {
        // Pétalo de girasol estilizado
        ctx.fillStyle = `hsl(${p.hue}, 95%, 60%)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Destello dorado suave
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#fbbf24";
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}
