const contenedor = document.querySelector("#carritoProductos");
const totalElemento = document.querySelector("#totalCarrito");

async function mostrarCarrito() {
    let items = [];

    try {
        const response = await fetchWithToken(`${API_URL}/carrito`);
        const result = await handleResponse(response);
        items = result.carrito.items || [];
    } catch (error) {
        items = JSON.parse(localStorage.getItem("carrito")) || [];
    }

    if (items.length === 0) {
        contenedor.innerHTML = "<p class='text-center py-4'>Tu carrito está vacío</p>";
        totalElemento.innerText = "₡0";
        return;
    }

    const html = items.map((item, i) => {
        const prod = item.producto || item;
        const precio = prod.price_crc || prod.precio || 0;
        const cantidad = item.cantidad || 1;
        const subtotal = precio * cantidad;
        const id = prod._id || prod.id;
        const imagen = prod.image || prod.imagen || "img/placeholder.png";

        return `
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <div class="d-flex align-items-center">
                <img src="${imagen}" style="width:50px; height:50px; object-fit:contain;" class="me-3"
                     onerror="this.src='img/petZone-logo.png'">
                <div>
                    <h6 class="mb-0 small">${prod.name || prod.nombre || 'Producto'}</h6>
                    <small class="text-muted">₡${precio.toLocaleString()} c/u</small>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidad('${id}', ${i}, -1, ${cantidad})">−</button>
                        <span>${cantidad}</span>
                        <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidad('${id}', ${i}, 1, ${cantidad})">+</button>
                    </div>
                </div>
            </div>
            <div class="text-end">
                <div class="fw-bold">₡${subtotal.toLocaleString()}</div>
                <button class="btn btn-sm text-danger p-0 mt-1" onclick="eliminarProducto('${id}', ${i})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');

    contenedor.innerHTML = html;

    let total = 0;
    items.map((item) => {
        const prod = item.producto || item;
        const precio = prod.price_crc || prod.precio || 0;
        const cantidad = item.cantidad || 0;
        total += precio * cantidad;
    });

    totalElemento.innerText = `₡${total.toLocaleString()}`;
    actualizarContador();
}

async function cambiarCantidad(id, index, delta, cantidadActual) {
if (cantidadActual <= 1 && delta === -1) {
    eliminarProducto(id, index);
    return;
}

    try {
        await fetchWithToken(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            body: JSON.stringify({ productoId: id, cantidad: delta })
        });
    } catch (error) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito[index].cantidad = cantidadActual + delta;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    mostrarCarrito();
}

async function eliminarProducto(id, index) {
    try {
        await fetchWithToken(`${API_URL}/carrito/eliminar/${id}`, { method: 'DELETE' });
    } catch (error) {
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    mostrarCarrito();
}

async function procederAlPago() {
    let items = [];

    try {
        const response = await fetchWithToken(`${API_URL}/carrito`);
        const result = await handleResponse(response);
        items = result.carrito.items || [];
    } catch (error) {
        items = JSON.parse(localStorage.getItem("carrito")) || [];
    }

    if (items.length === 0) {
        Swal.fire({ title: 'Carrito vacío', icon: 'warning' });
        return;
    }

    Swal.fire({
        title: '¡Orden realizada!',
        text: '¡Gracias por confiar en PetZone!',
        icon: 'success',
        confirmButtonText: 'Genial',
        confirmButtonColor: '#198754'
    }).then(async () => {
        try {
            await fetchWithToken(`${API_URL}/ordenes`, { method: 'POST' });
            await fetchWithToken(`${API_URL}/carrito/vaciar`, { method: 'DELETE' });
        } catch (e) {}
        localStorage.removeItem("carrito");
        window.location.href = "productos.html";
    });
}

async function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se borrarán todos los productos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await fetchWithToken(`${API_URL}/carrito/vaciar`, { method: 'DELETE' });
            } catch (error) {
                localStorage.removeItem("carrito");
            }
            mostrarCarrito();
        }
    });
}

document.addEventListener("DOMContentLoaded", mostrarCarrito);