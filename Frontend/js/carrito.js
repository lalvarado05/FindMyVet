const contenedor = document.querySelector("#carritoProductos");
const totalElemento = document.querySelector("#totalCarrito");

function mostrarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p class='text-center py-4'>Tu carrito está vacío</p>";
    totalElemento.innerText = "₡0";
    return;
  }

  const html = carrito.map((prod, index) => {
    const precio = prod.price_crc || 0; 
    const cantidad = prod.cantidad || 0;
    const subtotal = precio * cantidad;

    return `
      <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <div class="d-flex align-items-center">
          <img src="img/${prod.image}" 
               style="width: 50px; height: 50px; object-fit: contain;" class="me-3">
          <div>
            <h6 class="mb-0 small">${prod.name || 'Producto'}</h6>
            <small class="text-muted">
              ${cantidad} x ₡${precio.toLocaleString()}
            </small>
          </div>
        </div>
        <div class="text-end">
            <div class="fw-bold">₡${subtotal.toLocaleString()}</div>
            <button class="btn btn-sm text-danger p-0" onclick="eliminarProducto(${index})">
                <i class="bi bi-trash"></i>
            </button>
        </div>
      </div>
    `;
  }).join('');

  contenedor.innerHTML = html;

  const total = carrito.reduce((acc, item) => {
    const p = item.price_crc || 0;
    const c = item.cantidad || 0;
    return acc + (p * c);
  }, 0);

  totalElemento.innerText = `₡${total.toLocaleString()}`;
}

// --- PROCEDER AL PAGO ---
window.procederAlPago = () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'No tienes productos para comprar',
            icon: 'warning',
            confirmButtonColor: '#212529'
        });
        return;
    }

    // SweetAlert
    Swal.fire({
        title: '¡Orden realizada!',
        text: 'Tu pedido ha sido procesado con éxito. ¡Gracias por confiar en PetZone!',
        icon: 'success',
        confirmButtonText: 'Genial',
        confirmButtonColor: '#198754'
    }).then((result) => {
        // Cuando el usuario cierre el alert, limpiamos el carrito
        localStorage.removeItem("carrito");
        // Redireccionamos a la tienda o refrescamos
        window.location.href = "productos.html"; 
    });
};

window.eliminarProducto = (index) => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
};

window.vaciarCarrito = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se borrarán todos los productos del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#212529',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carrito");
            mostrarCarrito();
        }
    });
};

document.addEventListener("DOMContentLoaded", mostrarCarrito);
