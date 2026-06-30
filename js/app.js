let productosOriginales = [];

function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(valor);
}

function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem("manterFavoritos")) || [];
}

function guardarFavoritos(favoritos) {
  localStorage.setItem("manterFavoritos", JSON.stringify(favoritos));
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById("contenedorProductos");
  if (!contenedor) return;
  const favoritos = obtenerFavoritos();
  if (productos.length === 0) {
    contenedor.innerHTML = `<p class="text-center">No se encontraron productos.</p>`;
    return;
  }
  contenedor.innerHTML = productos.map(producto => `
    <article class="card producto-card">
      <button class="favorito ${favoritos.includes(producto.id) ? "activo" : ""}" data-fav="${producto.id}" aria-label="Marcar favorito">♥</button>
      <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
      <div class="card-body d-flex flex-column">
        <span class="categoria">${producto.categoria}</span>
        <h3 class="h5 mt-2">${producto.nombre}</h3>
        <p class="text-muted flex-grow-1">${producto.descripcion}</p>
        <p class="precio">${formatearPrecio(producto.precio)}</p>
        <button class="btn btn-primary mt-auto" data-id="${producto.id}">Agregar al carrito</button>
      </div>
    </article>
  `).join("");
}

function activarBotonesCompra() {
  const contenedor = document.getElementById("contenedorProductos");
  contenedor?.addEventListener("click", (e) => {
    const fav = e.target.closest("button[data-fav]");
    if (fav) {
      const id = Number(fav.dataset.fav);
      const favoritos = obtenerFavoritos();
      const nuevos = favoritos.includes(id) ? favoritos.filter(item => item !== id) : [...favoritos, id];
      guardarFavoritos(nuevos);
      fav.classList.toggle("activo");
      return;
    }
    const boton = e.target.closest("button[data-id]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    const producto = productosOriginales.find(item => item.id === id);
    if (!producto) return;
    agregarAlCarrito(producto);
    renderizarCarritoRapido();
    const toastEl = document.getElementById("toastCarrito");
    if (toastEl && window.bootstrap) new bootstrap.Toast(toastEl).show();
  });
}

function renderizarCarritoRapido() {
  const lista = document.getElementById("listaCarritoRapido");
  const subtotalEl = document.getElementById("subtotalRapido");
  const ivaEl = document.getElementById("ivaRapido");
  const totalEl = document.getElementById("totalRapido");
  if (!lista || !subtotalEl || !ivaEl || !totalEl) return;
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    lista.innerHTML = `<div class="alert alert-info">Todavía no agregaste productos.</div>`;
  } else {
    lista.innerHTML = carrito.map(item => `
      <div class="offcanvas-item">
        <img src="${item.imagen}" alt="${item.nombre}">
        <div>
          <strong>${item.nombre}</strong>
          <p class="mb-1 small text-muted">${item.cantidad} x ${formatearPrecio(item.precio)}</p>
          <button class="btn btn-sm btn-outline-danger" data-rapido-eliminar="${item.id}">Eliminar</button>
        </div>
      </div>
    `).join("");
  }
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.21;
  subtotalEl.textContent = formatearPrecio(subtotal);
  ivaEl.textContent = formatearPrecio(iva);
  totalEl.textContent = formatearPrecio(subtotal + iva);
}

function activarCarritoRapido() {
  document.getElementById("listaCarritoRapido")?.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-rapido-eliminar]");
    if (!boton) return;
    eliminarDelCarrito(Number(boton.dataset.rapidoEliminar));
    renderizarCarritoRapido();
  });
}

function activarBuscador() {
  const buscador = document.getElementById("buscadorProductos");
  buscador?.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();
    const filtrados = productosOriginales.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
    mostrarProductos(filtrados);
  });
}

function activarModoOscuro() {
  const boton = document.getElementById("modoOscuro");
  const activo = localStorage.getItem("manterDarkMode") === "true";
  document.body.classList.toggle("dark-mode", activo);
  if (boton) boton.textContent = activo ? "☀️" : "🌙";
  boton?.addEventListener("click", () => {
    const nuevoEstado = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", nuevoEstado);
    localStorage.setItem("manterDarkMode", String(nuevoEstado));
    boton.textContent = nuevoEstado ? "☀️" : "🌙";
  });
}

function validarFormulario() {
  const form = document.getElementById("formContacto");
  const aviso = document.getElementById("mensajeFormulario");
  form?.addEventListener("submit", (e) => {
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (nombre.length < 2 || !emailValido || mensaje.length < 10) {
      e.preventDefault();
      aviso.textContent = "Revisá los datos: nombre, correo válido y mensaje de al menos 10 caracteres.";
      aviso.className = "small fw-semibold text-danger";
    } else {
      aviso.textContent = "Formulario listo para enviar.";
      aviso.className = "small fw-semibold text-success";
    }
  });
}

function iniciarSlick() {
  if (window.jQuery && $('.autoplay').length) {
    $('.autoplay').slick({slidesToShow:3,slidesToScroll:1,autoplay:true,autoplaySpeed:2200,arrows:false,dots:false,infinite:true,responsive:[{breakpoint:1024,settings:{slidesToShow:3,dots:true}},{breakpoint:600,settings:{slidesToShow:2}},{breakpoint:480,settings:{slidesToShow:1}}]});
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  activarModoOscuro();
  productosOriginales = await obtenerProductos();
  mostrarProductos(productosOriginales);
  activarBotonesCompra();
  activarCarritoRapido();
  activarBuscador();
  validarFormulario();
  iniciarSlick();
  renderizarCarritoRapido();
});
