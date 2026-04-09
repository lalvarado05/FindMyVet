// Verificar autenticación
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

let listaArticulos = [];
const seccionArticulos = document.querySelector("#seccionProductos");

// Cargar productos desde la API
const cargarArticulos = async () => {
  try {
    const response = await fetchWithToken(`${API_URL}/productos`);
    const result = await handleResponse(response);
    
    // Adaptar estructura de datos del backend al frontend
    listaArticulos = result.productos.map(prod => ({
      id: prod._id,
      name: prod.nombre,
      price_crc: prod.precio,
      image: prod.imagen,
      description: prod.descripcion,
      stock: prod.stock,
      categoria: prod.categoria
    }));
    
    pintarArticulos(listaArticulos);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    seccionArticulos.innerHTML = "<p>Error al cargar productos: " + error.message + "</p>";
  }
};

function pintarArticulos(articulos) {
  if (articulos.length === 0) {
    seccionArticulos.innerHTML = "<p>Sin resultados</p>";
    return;
  }

const html = articulos.map((articulo, index) => {

return `
  <div class="col-md-3 mb-4">
    <div class="card h-100 shadow-sm">
      
<a href="vistaProducto.html?id=${articulo.id}">
        <img 
          class="card-img-top p-3" 
          src="img/${articulo.image}" 
          alt="${articulo.name}"
          style="height:150px; object-fit:contain; cursor:pointer;"
        >
      </a>

      <div class="card-body d-flex flex-column">
        <h6 class="card-title text-center">${articulo.name}</h6>
        
        <p class="text-center fw-bold text-success">
          ₡${articulo.price_crc.toLocaleString()}
        </p>

        <button class="btn btn-dark w-100 mt-auto" onclick="agregarCarrito('${articulo.id}')">
          Agregar al carrito
        </button>
      </div>
    </div>
  </div>`;
}).join('');
  seccionArticulos.innerHTML = html;
}

async function agregarCarrito(productId) {
  const prod = listaArticulos.find(p => p.id === productId);
  if (!prod) return;
  
  try {
    const response = await fetchWithToken(`${API_URL}/carrito/agregar`, {
      method: 'POST',
      body: JSON.stringify({
        productoId: productId,
        cantidad: 1
      })
    });
    await handleResponse(response);
    
    actualizarContador();
    
    Swal.fire({
      title: '¡Añadido!',
      text: `${prod.name} al carrito`,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    });
  } catch (error) {
    // Fallback a localStorage si hay error
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carrito.find(item => item.name === prod.name);

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({
        id: prod.id,
        name: prod.name,
        price_crc: prod.price_crc,
        image: prod.image,
        cantidad: 1
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    
    Swal.fire({
      title: '¡Añadido!',
      text: `${prod.name} al carrito`,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    });
  }
}

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
  cargarArticulos();
  actualizarContador();
});
