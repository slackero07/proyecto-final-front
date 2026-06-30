const CLAVE_CARRITO = "manterCarrito";

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const encontrado = carrito.find(item => item.id === producto.id);
  if (encontrado) {
    encontrado.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito(carrito);
}

function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(item => item.id !== id);
  guardarCarrito(carrito);
}

function cambiarCantidad(id, cambio) {
  const carrito = obtenerCarrito();
  const producto = carrito.find(item => item.id === id);
  if (!producto) return;
  producto.cantidad += cambio;
  if (producto.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }
  guardarCarrito(carrito);
}

function vaciarCarritoCompleto() {
  guardarCarrito([]);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("contadorCarrito");
  if (!contador) return;
  const cantidad = obtenerCarrito().reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = cantidad;
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
