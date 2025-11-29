import Typewriter from "typewriter-effect/dist/core";
const typewriterSpan = document.querySelector(".typewriter");

/**
 * Se crea una instancia de Typewriter con los parámetros indicados, el primero es el elemento al que se quiere dar el efecto y el segundo son las opciones.
 */
const typewriter = new Typewriter(typewriterSpan, {
  delay: 50,
  loop: false,
});

/**
 * función inicializadora de efectos de typewriter
 */
export const typewriterInit = () => {
  typewriter
    .pauseFor(1000) // Pausa antes de iniciar el efecto
    .typeString("tu estilo") // Escribe el texto
    .pauseFor(300) // Pausa para la próxima acción
    .deleteChars(6) // Borra la cantidad caracteres indicados
    .typeString("tendencia") // Escribe el texto
    .pauseFor(300) // Pausa para la próxima acción
    .deleteChars(10) // Borra la cantidad caracteres indicados
    .typeString(" confort") // Escribe el texto
    .pauseFor(300) // Pausa para la próxima acción
    .start(); // Inicia el efecto
};
