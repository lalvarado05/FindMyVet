// Al cargar la página, obtiene el ID del producto desde la URL
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const idUrl = params.get("id");

    // Actualiza el contador del carrito
    actualizarContador();

    if (!idUrl) {
        Swal.fire("Error", "No se encontró el ID del producto", "error");
        return;
    }

    try {
        // Trae el producto desde la API
        const response = await fetchWithToken(`${API_URL}/productos/${idUrl}`);
        const result = await handleResponse(response);
        const producto = result.producto;

        if (!producto) return;

        // Llena los datos en el HTML
        document.getElementById("detalleNombre").innerText = producto.nombre;
        document.getElementById("detallePrecio").innerText = "₡" + producto.precio.toLocaleString();
        document.getElementById("detalleDescripcion").innerText = producto.descripcion;

        const catLabel = document.getElementById("detalleCategoria");
        if (catLabel) catLabel.innerText = producto.categoria?.nombre || "General";

        // Asigna la imagen, si falla muestra el placeholder
        const imgElement = document.getElementById("detalleImagen");
        imgElement.src = getImageUrl(producto.imagen || producto.image);
        imgElement.onerror = () => { imgElement.src = "img/placeholder.png"; };

        // Botón de agregar al carrito
        document.getElementById("btnAgregar").onclick = () => {
            agregarAlCarritoAPI(producto._id, producto.nombre);
        };

    } catch (error) {
        console.error("Error:", error);
    }
});

// Agrega el producto al carrito via API
async function agregarAlCarritoAPI(productoId, nombre) {
    try {
        const response = await fetchWithToken(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            body: JSON.stringify({ productoId: productoId, cantidad: 1 })
        });

        await handleResponse(response);

        // Actualiza el contador del carrito
        actualizarContador();

        Swal.fire({
            title: '¡Añadido!',
            text: `${nombre} se agregó al carrito`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });

    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        Swal.fire("Error", "No se pudo añadir al carrito", "error");
    }
}

// Añade esto al final de vistaProducto.js
async function actualizarContador() {
    const badge = document.getElementById("cartCount");
    if (!badge) return;
    
    try {
        const response = await fetchWithToken(`${API_URL}/carrito`);
        const result = await handleResponse(response);
        const items = (result.carrito || result).items || [];
        const total = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
        badge.innerText = total;
    } catch (error) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const total = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
        badge.innerText = total;
    }
}