const contenedor = document.querySelector("#carritoProductos");
const totalElemento = document.querySelector("#totalCarrito");

// Verificar autenticación
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

async function mostrarCarrito() {
  try {
    const response = await fetchWithToken(`${API_URL}/carrito`);
    const result = await handleResponse(response);
    
    // La API devuelve el carrito con items que tienen producto y cantidad
    const carritoData = result.carrito || result;
    const items = carritoData.items || [];

    if (items.length === 0) {
      contenedor.innerHTML = "<p class='text-center py-4'>Tu carrito está vacío</p>";
      totalElemento.innerText = "₡0";
      return;
    }

    const html = items.map((item, index) => {
      const producto = item.producto || {};
      const precio = producto.precio || 0;
      const cantidad = item.cantidad || 0;
      const subtotal = precio * cantidad;

      return `
        <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
          <div class="d-flex align-items-center">
            <img src="img/${producto.imagen || 'placeholder.png'}" 
                 style="width: 50px; height: 50px; object-fit: contain;" class="me-3">
            <div>
              <h6 class="mb-0 small">${producto.nombre || 'Producto'}</h6>
              <small class="text-muted">
                ${cantidad} x ₡${precio.toLocaleString()}
              </small>
            </div>
          </div>
          <div class="text-end">
              <div class="fw-bold">₡${subtotal.toLocaleString()}</div>
              <button class="btn btn-sm text-danger p-0" onclick="eliminarProducto('${producto._id}')">
                  <i class="bi bi-trash"></i>
              </button>
          </div>
        </div>
      `;
    }).join('');

    contenedor.innerHTML = html;

    const total = items.reduce((acc, item) => {
      const p = item.producto?.precio || 0;
      const c = item.cantidad || 0;
      return acc + (p * c);
    }, 0);

    totalElemento.innerText = `₡${total.toLocaleString()}`;
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    // Si hay error, intentar usar localStorage como fallback
    mostrarCarritoLocalStorage();
  }
}

function mostrarCarritoLocalStorage() {
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
            <button class="btn btn-sm text-danger p-0" onclick="eliminarProductoLocalStorage(${index})">
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
window.procederAlPago = async () => {
    try {
        const response = await fetchWithToken(`${API_URL}/ordenes`, {
            method: 'POST'
        });
        const result = await handleResponse(response);

        Swal.fire({
            title: '¡Orden realizada!',
            text: 'Tu pedido ha sido procesado con éxito. ¡Gracias por confiar en PetZone!',
            icon: 'success',
            confirmButtonText: 'Genial',
            confirmButtonColor: '#198754'
        }).then((result) => {
            window.location.href = "productos.html"; 
        });
    } catch (error) {
        console.error('Error al crear orden:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'No se pudo procesar la orden',
            icon: 'error',
            confirmButtonColor: '#212529'
        });
    }
};

window.eliminarProducto = async (productoId) => {
    try {
        const response = await fetchWithToken(`${API_URL}/carrito/eliminar/${productoId}`, {
            method: 'DELETE'
        });
        await handleResponse(response);
        mostrarCarrito();
        actualizarContador();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
};

window.eliminarProductoLocalStorage = (index) => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarritoLocalStorage();
    actualizarContador();
};

window.vaciarCarrito = async () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se borrarán todos los productos del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#212529',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetchWithToken(`${API_URL}/carrito/vaciar`, {
                    method: 'DELETE'
                });
                await handleResponse(response);
                mostrarCarrito();
                actualizarContador();
            } catch (error) {
                console.error('Error al vaciar carrito:', error);
                // Fallback a localStorage
                localStorage.removeItem("carrito");
                mostrarCarritoLocalStorage();
                actualizarContador();
            }
        }
    });
};

async function actualizarContador() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  
  try {
    const response = await fetchWithToken(`${API_URL}/carrito`);
    const result = await handleResponse(response);
    const carritoData = result.carrito || result;
    const items = carritoData.items || [];
    const total = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    badge.innerText = total;
  } catch (error) {
    // Fallback a localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    badge.innerText = total;
  }
}

document.addEventListener("DOMContentLoaded", () => {
    if (!verificarAutenticacion()) return;
    mostrarCarrito();
});
