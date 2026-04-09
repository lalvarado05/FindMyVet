// Verificar autenticación
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Función para cargar producto desde API o JSON local
async function cargarProducto(idProducto) {
    try {
        const response = await fetchWithToken(`${API_URL}/productos/${idProducto}`);
        const result = await handleResponse(response);
        return result.producto;
    } catch (error) {
        console.error("Error:", error);
        // Fallback a JSON local si hay error
        return cargarProductoDesdeJSON(idProducto);
    }
}

// Función para cargar producto desde JSON local
function cargarProductoDesdeJSON(idProducto) {
    return fetch("data/productos.json") 
        .then(response => {
            if (!response.ok) throw new Error("No se encontró el archivo productos.json");
            return response.json();
        })
        .then(productos => {
            return productos.find(p => p.id === parseInt(idProducto));
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// Función para agregar producto al carrito
async function agregarAlCarrito(prod) {
    try {
        const response = await fetchWithToken(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            body: JSON.stringify({
                productoId: prod._id,
                cantidad: 1
            })
        });
        await handleResponse(response);
        
        // Actualiza el número en el icono del carrito
        if (typeof actualizarContador === "function") {
            actualizarContador();
        }

        Swal.fire({
            title: '¡Añadido!',
            text: `${prod.nombre} al carrito`,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        // Fallback a localStorage
        agregarAlCarritoDesdeDetalleLocal({
            name: prod.nombre,
            price_crc: prod.precio,
            image: prod.imagen
        });
    }
}

// Función para agregar producto al carrito desde detalle local
function agregarAlCarritoDesdeDetalleLocal(prod) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find(item => item.name === prod.name);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            name: prod.name,
            price_crc: prod.price_crc,
            image: prod.image,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    // Actualiza el número en el icono del carrito
    if (typeof actualizarContador === "function") {
        actualizarContador();
    }

    Swal.fire({
        title: '¡Añadido!',
        text: `${prod.name} al carrito`,
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!verificarAutenticacion()) return;
    
    // 1. Verificamos si hay un ID en la URL
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get("id");
    let productoActual = null; 

    if (!idProducto) {
        alert("ERROR: No hay ningún ID en la URL. Entra desde productos.html haciendo clic en una imagen.");
        return;
    }

    productoActual = await cargarProducto(idProducto);

    if (productoActual) {
        document.getElementById("detalleNombre").innerText = productoActual.nombre;
        document.getElementById("detallePrecio").innerText = "₡" + productoActual.precio.toLocaleString();
        document.getElementById("detalleMarca").innerText = "Marca: " + (productoActual.marca || 'N/A');
        document.getElementById("detalleDescripcion").innerText = productoActual.descripcion;
        document.getElementById("detalleImagen").src = "img/" + productoActual.imagen;

        const btnAgregar = document.getElementById("btnAgregar");
        
        btnAgregar.onclick = () => {
            agregarAlCarrito(productoActual);
        };
    } else {
        alert("ERROR: El ID " + idProducto + " no existe.");
    }
});