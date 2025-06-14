let lector;
let leyendo = false;
let modoAccesible = false;

function leerTexto(texto) {
  speechSynthesis.cancel();
  lector = new SpeechSynthesisUtterance(texto);
  lector.lang = "es-ES";
  speechSynthesis.speak(lector);
  leyendo = true;
}

function manejarTecla(event) {
  const key = event.key.toLowerCase();

  if (event.code === "Space") {
    event.preventDefault(); // evita scroll u otras acciones
    modoAccesible = !modoAccesible;

    if (modoAccesible) {
      leerTexto("Modo accesible activado. Usa tabulador para navegar. Presiona efe para leer una sección. Enter para pausar o continuar. Jota para detener la lectura.");
    } else {
      speechSynthesis.cancel();
      leerTexto("Modo accesible desactivado.");
    }
  }

  if (modoAccesible && key === "f") {
    const seccionActiva = document.activeElement.closest("section");
    if (seccionActiva) {
      leerTexto(seccionActiva.innerText);
    } else {
      leerTexto("Usa tabulador para seleccionar una sección.");
    }
  }

  if (modoAccesible && key === "j") {
    speechSynthesis.cancel();
    leyendo = false;
  }

  if (modoAccesible && key === "enter") {
    if (leyendo) {
      speechSynthesis.pause();
      leyendo = false;
    } else {
      speechSynthesis.resume();
      leyendo = true;
    }
  }
}

document.addEventListener("keydown", manejarTecla);

document.addEventListener("focusin", (event) => {
  if (!modoAccesible) return;

  const el = event.target;

  // Leer enlaces del menú u otras partes
  if (el.tagName === "A") {
    const texto = el.innerText.trim();
    if (texto) {
      leerTexto(`${texto}. Presiona efe para leer esta sección completa.`);
      return;
    }
  }

  // Leer imágenes con alt
  if (el.tagName === "IMG") {
    const alt = el.getAttribute("alt");
    if (alt) {
      leerTexto(`Libro: ${alt}`);
    } else {
      leerTexto("Imagen sin descripción.");
    }
    return;
  }

  // Leer secciones con títulos
  const seccion = el.closest("section");
  if (seccion) {
    const titulo = seccion.querySelector("h1, h2");
    if (titulo) {
      leerTexto(`${titulo.innerText}. Presiona efe para leer esta sección completa.`);
    }
  }
});

