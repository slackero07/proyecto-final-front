function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(valor);
}

function activarModoOscuroCarrito() {
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

function renderizarCarrito() {
  const contenedor = document.getElementById("contenedorCarrito");
  const totalEl = document.getElementById("totalCarrito");
  const subtotalEl = document.getElementById("subtotalCarrito");
  const ivaEl = document.getElementById("ivaCarrito");
  const cantidadEl = document.getElementById("cantidadProductos");
  const carrito = obtenerCarrito();
  if (!contenedor || !totalEl) return;
  const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = subtotal * 0.21;
  if (cantidadEl) cantidadEl.textContent = cantidad;
  if (subtotalEl) subtotalEl.textContent = formatearPrecio(subtotal);
  if (ivaEl) ivaEl.textContent = formatearPrecio(iva);
  totalEl.textContent = formatearPrecio(subtotal + iva);
  if (carrito.length === 0) {
    contenedor.innerHTML = `<div class="alert alert-info">El carrito está vacío. Volvé al catálogo para agregar productos.</div>`;
    return;
  }
  contenedor.innerHTML = carrito.map(item => `
    <article class="card shadow-sm mb-3"><div class="card-body item-carrito">
      <img src="${item.imagen}" alt="${item.nombre}">
      <div><h2 class="h5 mb-1">${item.nombre}</h2><p class="mb-1 text-muted">${item.categoria}</p><strong>${formatearPrecio(item.precio)}</strong></div>
      <div class="acciones d-flex align-items-center gap-3">
        <div class="cantidad-control"><button class="btn btn-outline-secondary" data-accion="restar" data-id="${item.id}">-</button><span>${item.cantidad}</span><button class="btn btn-outline-secondary" data-accion="sumar" data-id="${item.id}">+</button></div>
        <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
        <button class="btn btn-outline-danger" data-accion="eliminar" data-id="${item.id}">Eliminar</button>
      </div>
    </div></article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  activarModoOscuroCarrito();
  renderizarCarrito();
  document.getElementById("contenedorCarrito")?.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;
    const id = Number(boton.dataset.id);
    if (boton.dataset.accion === "sumar") cambiarCantidad(id, 1);
    if (boton.dataset.accion === "restar") cambiarCantidad(id, -1);
    if (boton.dataset.accion === "eliminar") eliminarDelCarrito(id);
    renderizarCarrito();
  });
  document.getElementById("vaciarCarrito")?.addEventListener("click", () => {
    vaciarCarritoCompleto();
    renderizarCarrito();
  });
});
