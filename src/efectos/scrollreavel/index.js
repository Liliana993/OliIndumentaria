import ScrollReveal from "scrollreveal";
const heroSection = document.querySelector(".hero");
const elementUnoNosotros = document.getElementById("nosotros");
const containercategori = document.querySelector(".categorias");
const containerFormu = document.getElementById('contacto');
const servicesCard = document.querySelector(".servicio");

//HERO
const revealSection = (section) => {
  ScrollReveal().reveal(section, {
    delay: 200, // Lo que tarda en iniciar el efecto
    distance: "100px", // Distancia que recorre el elemento
    duration: 1500, // Duración del efecto
    origin: "bottom", // Desde donde aparece el elemento
    reset: false, // Si se debe reiniciar el efecto y volver a ejecutarse
  });
};

//NOCSOTROS
const efectSection = (section) => {
  ScrollReveal().reveal(section, {
    delay: 200, // Lo que tarda en iniciar el efecto
    distance: "50px", // Distancia que recorre el elemento
    duration: 1500, // Duración del efecto
    origin: "right", // Desde donde aparece el elemento
    reset: false, // Si se debe reiniciar el efecto y volver a ejecutarse
  });
};



// función inicializadora de efectos de scroll
export const scrollEffectsInit = () => {
  revealSection(heroSection);
  revealSection(containercategori);
  revealSection(elementUnoNosotros);
  revealSection(containerFormu);
  efectSection(servicesCard)
};
