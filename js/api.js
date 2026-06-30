const API_PRODUCTOS = "data/productos.json";

async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_PRODUCTOS);
    if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo");
    return await respuesta.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
