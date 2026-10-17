
/* ========================================
   PRESENTACIÓN DE ANIME
   11 DIAPOSITIVAS + 2 CANCIONES YOUTUBE
======================================== */

// ========================================
// 1. CONFIGURACIÓN DE LAS CANCIONES
// ========================================

// COLOCA AQUÍ TUS DOS ENLACES DE YOUTUBE

const canciones = [
    {
        nombre: "Demon Slayer",
        url: "https://www.youtube.com/watch?v=pmanD_s7G3U"
    },
    {
        nombre: "Fullmetal Alchemist",
        url: "https://www.youtube.com/watch?v=1HOhxibhCWg&list=RD1HOhxibhCWg&start_radio=1"
    }
];

// Diapositivas 1 a 6: Demon Slayer
// Diapositivas 7 a 11: Fullmetal Alchemist

const diapositivaCambio = 7;


// ========================================
// 2. VARIABLES DE LA PRESENTACIÓN
// ========================================

let currentSlide = 0;

const slides = document.querySelectorAll('.slide');
const counter = document.getElementById('counter');
const playPauseBtn = document.getElementById('play-pause-btn');
const trackName = document.getElementById('track-name');

let youtubePlayer = null;
let reproductorListo = false;
let cancionActual = 0;
let reproduciendo = false;
let inicioSolicitado = false;


// ========================================
// 3. EXTRAER ID DE YOUTUBE
// ========================================

function extraerIdYoutube(url) {
    try {
        const enlace = new URL(url);

        if (
            enlace.hostname === "youtu.be" ||
            enlace.hostname === "www.youtu.be"
        ) {
            return enlace.pathname.split('/')[1];
        }

        if (
            enlace.pathname.startsWith('/shorts/') ||
            enlace.pathname.startsWith('/embed/')
        ) {
            return enlace.pathname.split('/')[2];
        }

        return enlace.searchParams.get('v');

    } catch (error) {
        console.error("Enlace de YouTube inválido:", error);
        return null;
    }
}


// ========================================
// 4. CARGAR API OFICIAL DE YOUTUBE
// ========================================

const youtubeScript = document.createElement('script');

youtubeScript.src = "https://www.youtube.com/iframe_api";

document.head.appendChild(youtubeScript);


// ========================================
// 5. CREAR REPRODUCTOR DE YOUTUBE
// ========================================

window.onYouTubeIframeAPIReady = function() {

    const primerVideo = extraerIdYoutube(canciones[0].url);

    if (!primerVideo) {
        trackName.textContent = "Configura los enlaces de YouTube";
        return;
    }

    youtubePlayer = new YT.Player('youtube-player', {

        height: '180',
        width: '320',

        videoId: primerVideo,

        playerVars: {
            autoplay: 0,
            controls: 1,
            playsinline: 1,
            rel: 0
        },

        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onAutoplayBlocked: onAutoplayBlocked,
            onError: onPlayerError
        }
    });
};


// ========================================
// 6. CUANDO EL REPRODUCTOR ESTÁ LISTO
// ========================================

function onPlayerReady() {

    reproductorListo = true;

    playPauseBtn.disabled = false;

    actualizarNombreCancion();

    if (inicioSolicitado) {
        youtubePlayer.playVideo();
    }
}


// ========================================
// 7. DETECTAR ESTADO DEL REPRODUCTOR
// ========================================

function onPlayerStateChange(event) {

    reproduciendo =
        event.data === YT.PlayerState.PLAYING;

    playPauseBtn.textContent = reproduciendo
        ? "⏸ Pausar"
        : "▶ Reproducir";

    // Repetir la canción si termina.
    if (event.data === YT.PlayerState.ENDED) {

        youtubePlayer.seekTo(0, true);

        youtubePlayer.playVideo();
    }
}


function onAutoplayBlocked() {

    reproduciendo = false;

    playPauseBtn.textContent = "▶ Activar música";

    console.log(
        "El navegador requiere una interacción para reproducir audio."
    );
}


function onPlayerError(event) {

    console.error(
        "Error al reproducir YouTube:",
        event.data
    );

    trackName.textContent =
        "No se pudo reproducir el video de YouTube";
}


// ========================================
// 8. ACTUALIZAR NOMBRE DE LA CANCIÓN
// ========================================

function actualizarNombreCancion() {

    trackName.textContent =
        "🎵 " + canciones[cancionActual].nombre;
}


// ========================================
// 9. REPRODUCIR Y PAUSAR
// ========================================

function togglePlay() {

    if (!reproductorListo) {
        console.log("El reproductor está cargando...");
        return;
    }

    const estado = youtubePlayer.getPlayerState();

    if (estado === YT.PlayerState.PLAYING) {

        youtubePlayer.pauseVideo();

    } else {

        youtubePlayer.playVideo();
    }
}


// ========================================
// 10. CAMBIAR CANCIÓN
// ========================================

function cambiarCancion(numero) {

    if (numero < 0 || numero >= canciones.length) {
        return;
    }

    if (numero === cancionActual) {
        return;
    }

    cancionActual = numero;

    actualizarNombreCancion();

    if (!reproductorListo) {
        return;
    }

    const videoId = extraerIdYoutube(
        canciones[numero].url
    );

    if (!videoId) {

        console.error("ID de YouTube inválido");

        return;
    }

    // Cambiar video sin reproducirlo si estaba pausado
    if (reproduciendo) {

        youtubePlayer.loadVideoById(videoId);

    } else {

        youtubePlayer.cueVideoById(videoId);
    }
}


// ========================================
// 11. MOSTRAR DIAPOSITIVA
// ========================================

function showSlide(index) {

    slides.forEach((slide, i) => {

        slide.classList.remove('active');

        if (i === index) {

            slide.classList.add('active');
        }
    });

    counter.textContent =
        `${index + 1} / ${slides.length}`;

    // Actualizar música según diapositiva
    actualizarMusicaPorDiapositiva(index + 1);
}


// ========================================
// 12. CAMBIAR DIAPOSITIVA
// ========================================

function changeSlide(direction) {

    currentSlide += direction;

    if (currentSlide < 0) {

        currentSlide = 0;

    } else if (currentSlide >= slides.length) {

        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}


// ========================================
// 13. CAMBIO AUTOMÁTICO DE CANCIÓN
// ========================================

function actualizarMusicaPorDiapositiva(numero) {

    if (numero >= diapositivaCambio) {

        cambiarCancion(1);

    } else {

        cambiarCancion(0);
    }
}


// ========================================
// 14. INICIAR MÚSICA
// ========================================

function iniciarMusica() {

    inicioSolicitado = true;

    if (reproductorListo) {

        youtubePlayer.playVideo();
    }
}


// ========================================
// 15. NAVEGACIÓN CON TECLADO
// ========================================

document.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowRight') {

        changeSlide(1);

    } else if (e.key === 'ArrowLeft') {

        changeSlide(-1);
    }
});


// ========================================
// 16. INICIAR PRESENTACIÓN
// ========================================

showSlide(currentSlide);
