import './style.css'
import { scrollEffectsInit } from './efectos/scrollreavel';
import { typewriterInit } from './efectos/typewriter';
import { productos } from './data/data';

let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector("#items");
const botonesFiltro = document.querySelectorAll('.filtro');
const DOMbotonConfirmar = document.querySelector('#confirmar-compra');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const form = document.getElementById("contactForm");
const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");
  const invalidoNombre = document.getElementById("invalidoNombre");
  const invalidoCorreo = document.querySelector(".invalidoCorreo");
  const invalidoMensaje = document.getElementById("invalidoMensaje");

let valido = true;
const miLocalStorage = window.localStorage;


//FUNCIÓN PARA ENDERIZAR NUESTROS PRODUCTOS
function renderizarProductos(category = 'todos'){
    //limpiar
    DOMitems.innerHTML = '';
    //filtramos los productos
    const productosFiltrados = category === 'todos'? productos : productos.filter(p => p.category === category);

     productosFiltrados.forEach((producto) => {
        // Estructura
        const miNodo = document.createElement('div');
        miNodo.classList.add('card', 'col-sm-4');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('card-body');
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('card-title', 'text-center');
        miNodoTitle.textContent = producto.name;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('img-fluid');
        miNodoImagen.setAttribute('src', producto.cardImg);
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('card-text');
        miNodoPrecio.textContent = `${divisa}${producto.bid}`;
        // Boton
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-primary', 'comp');
        miNodoBoton.textContent = 'Agregar';
        miNodoBoton.setAttribute('marcador', producto.id);
        miNodoBoton.addEventListener('click', addProductoAlCarrito);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}

//agregamos funcionalidad a los botones de filtro
function filtroBotones (){
    botonesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
      
      // 1. Remover estilos de todos
      botonesFiltro.forEach(b => {
        b.classList.remove('activo');
        b.classList.add('btn');
      });

      // 2. Agregar estilo activo al botón seleccionado
      btn.classList.remove('btn');
      btn.classList.add('activo');

      // 3. Renderizar productos de la categoría
      const category = btn.dataset.cat;
      renderizarProductos(category);
    });
  });
}


/**
 * Evento para añadir un producto al carrito de la compra
 */
function addProductoAlCarrito(evento) {
    // Anyadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'));
    // ALERT SWEETALERT2
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 1500
    });

    // Actualizamos el carrito
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
}

function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem('carrito') !== null) {
    // Carga la información
    carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

/**
 * Dibuja todos los productos guardados en el carrito
 */
function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = productos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].name} - ${miItem[0].bid}${divisa}`;
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'Borrar';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
}

//Evento para borrar un elemento del carrito
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;

    // CONFIRMACIÓN CON SWEETALERT2
    Swal.fire({
        title: "¿Eliminar producto?",
        text: "Este producto será quitado del carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Elimina
            carrito = carrito.filter((carritoId) => carritoId !== id);

            renderizarCarrito();
            guardarCarritoEnLocalStorage();

            Swal.fire({
                title: "Eliminado",
                text: "El producto fue eliminado del carrito",
                icon: "success",
                timer: 1200
            });
        }
    });
}

//Calcula el precio total teniendo en cuenta los productos repetidos
function calcularTotal() {
    // Recorremos el array del carrito
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = productos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].bid;
    }, 0).toFixed(2);
}

//Varia el carrito y vuelve a dibujarlo
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();
}

//Funcion para confirmar la compra
function confirmarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Carrito vacío",
            text: "Debes agregar algún producto antes de confirmar la compra."
        });
        return;
    }

    Swal.fire({
        title: "¿Confirmar compra?",
        text: "Recibirás tu factura en tu correo electrónico",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, comprar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {

            // ALERTA FINAL
            Swal.fire({
                icon: "success",
                title: "¡Gracias por su compra!",
                text: "Le enviamos su recibo y link de seguimiento.",
                confirmButtonText: "Aceptar"
            });

            // Vaciar carrito
            carrito = [];
            guardarCarritoEnLocalStorage();
            renderizarCarrito();
        }
    });
}


//Función para enviar validar datos y enviar un mensaje en caso de ingresar los datos correctamente
function sendForm(){
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validación nombre
  if (nombre.value.trim() === "") {
    invalidoNombre.textContent = "Por favor ingresá tu nombre.";
    invalidoNombre.style.display = "block";
    valido = false;
  } else {
    invalidoNombre.style.display = "none";
  }

  // Validación email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value.trim())) {
    invalidoCorreo.textContent = "Ingresá un correo válido.";
    invalidoCorreo.style.display = "block";
    valido = false;
  } else {
    invalidoCorreo.style.display = "none";
  }

  // Validación mensaje
  if (mensaje.value.trim() === "") {
    invalidoMensaje.textContent = "Escribí tu mensaje.";
    invalidoMensaje.style.display = "block";
    valido = false;
  } else {
    invalidoMensaje.style.display = "none";
  }

  // Si hay errores, frena acá
  if (!valido) return;

  // ALERTA DE EXITO
  Swal.fire({
    title: "¡Mensaje enviado!",
    text: "Gracias por contactarnos. Te responderemos pronto.",
    icon: "success",
    confirmButtonColor: "#c33b80",
    confirmButtonText: "Aceptar"
  });

  form.reset();
});


}


// Eventos al vaciar carrito
DOMbotonConfirmar.addEventListener('click', confirmarCompra);
DOMbotonVaciar.addEventListener('click', () => {
    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Esta acción eliminará todos los productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
            Swal.fire("Carrito vacío", "", "success");
        }
    });
});


//PUERTA DE ENTRADA A LA APP
function init(){
    scrollEffectsInit();
    typewriterInit();
renderizarProductos();
renderizarCarrito();
cargarCarritoDeLocalStorage();
filtroBotones();
sendForm();
}

init();
