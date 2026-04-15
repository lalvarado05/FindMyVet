// Verifica que el usuario tenga sesión activa
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

let listaArticulos = [];
let categoriasDisponibles = [];
let categoriaSeleccionada = '';
let carritoActual = [];
const seccionArticulos = document.querySelector("#seccionProductos");
const searchInput = document.querySelector("#searchInput");
const filtersContainer = document.querySelector("#filtersContainer");
const categoriaDropdown = document.querySelector("#categoriaDropdown");

// Cargar categorías desde la API
const cargarCategorias = async () => {
  try {
    const response = await fetchWithToken(`${API_URL}/categorias`);
    const result = await handleResponse(response);
    categoriasDisponibles = result.categorias;
    
    // Llenar el dropdown con las categorías
    const dropdownHTML = categoriasDisponibles.map(cat => `
      <li><a class="dropdown-item" href="#" data-categoria="${cat._id}">${cat.nombre}</a></li>
    `).join('');
    
    categoriaDropdown.innerHTML = `
      <li><a class="dropdown-item" href="#" data-categoria="">Todas las categorías</a></li>
      ${dropdownHTML}
    `;
    
    // Agregar event listeners a los items del dropdown
    document.querySelectorAll('#categoriaDropdown .dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        categoriaSeleccionada = e.target.dataset.categoria;
        filtrarProductos();
        
        // Actualizar estado activo del dropdown
        document.querySelectorAll('#categoriaDropdown .dropdown-item').forEach(i => {
          i.classList.remove('active');
        });
        e.target.classList.add('active');
      });
    });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
};

// Cargar carrito actual para saber qué productos están agregados
const cargarCarrito = async () => {
  try {
    const response = await fetchWithToken(`${API_URL}/carrito`);
    const result = await handleResponse(response);
    const carritoData = result.carrito || result;
    carritoActual = carritoData.items || [];
  } catch (error) {
    // Fallback a localStorage
    carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  }
};

// Trae los productos desde la API y los guarda en listaArticulos
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
      categoriaId: prod.categoria?._id || prod.categoria,
      categoriaNombre: prod.categoria?.nombre || prod.categoria
    }));
    
    await pintarArticulos(listaArticulos);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    seccionArticulos.innerHTML = "<p>Error al cargar productos: " + error.message + "</p>";
  }
};

// Genera el HTML de cada producto y lo muestra en pantalla
async function pintarArticulos(articulos) {
  if (articulos.length === 0) {
    seccionArticulos.innerHTML = "<p class='text-center py-4'>No se encontraron productos</p>";
    return;
  }

  // Recargar carrito para asegurar estado actualizado
  await cargarCarrito();

const html = articulos.map((articulo, index) => {
  // Verificar si el producto está en el carrito
  const itemEnCarrito = carritoActual.find(item => 
    (item.productoId === articulo.id) || (item.producto?._id === articulo.id)
  );
  const cantidad = itemEnCarrito ? itemEnCarrito.cantidad : 0;

return `
  <div class="col-md-3 mb-4">
    <div class="card h-100 shadow-sm">
      
<a href="vistaProducto.html?id=${articulo.id}">
        <img 
          class="card-img-top p-3" 
          src="${getImageUrl(articulo.image)}" 
          alt="${articulo.name}"
          style="height:150px; object-fit:contain; cursor:pointer;"
        >
      </a>

      <div class="card-body d-flex flex-column">
        <h6 class="card-title text-center">${articulo.name}</h6>
        
        <p class="text-center fw-bold text-success">
          ₡${articulo.price_crc.toLocaleString()}
        </p>

        ${cantidad > 0 ? `
        <div class="d-flex align-items-center justify-content-center mt-auto">
          <button class="btn btn-outline-secondary btn-sm" onclick="decrementarProducto('${articulo.id}')">-</button>
          <span class="mx-3 fw-bold">${cantidad}</span>
          <button class="btn btn-outline-secondary btn-sm" onclick="incrementarProducto('${articulo.id}')">+</button>
        </div>
        ` : `
        <button class="btn btn-dark w-100 mt-auto" onclick="agregarCarrito('${articulo.id}')">
          Agregar al carrito
        </button>
        `}
      </div>
    </div>
  </div>`;
}).join('');
  seccionArticulos.innerHTML = html;
}

// Función para filtrar productos
async function filtrarProductos() {
  const searchTerm = searchInput.value.toLowerCase();

  const productosFiltrados = listaArticulos.filter(articulo => {
    const cumpleBusqueda = articulo.name.toLowerCase().includes(searchTerm) ||
                          articulo.description.toLowerCase().includes(searchTerm);
    
    const cumpleCategoria = !categoriaSeleccionada || 
                           articulo.categoriaId === categoriaSeleccionada;
    
    return cumpleBusqueda && cumpleCategoria;
  });

  await pintarArticulos(productosFiltrados);
}

// Incrementar cantidad de un producto en el carrito
async function incrementarProducto(productId) {
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
    await cargarCarrito();
    pintarArticulos(listaArticulos);
    actualizarContador();
  } catch (error) {
    // Fallback a localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find(item => item.id === productId || item.productoId === productId);
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
    carritoActual = carrito;
    pintarArticulos(listaArticulos);
    actualizarContador();
  }
}

// Decrementar cantidad de un producto en el carrito
async function decrementarProducto(productId) {
  try {
    // Primero obtener el item actual del carrito
    const itemEnCarrito = carritoActual.find(item => 
      (item.productoId === productId) || (item.producto?._id === productId)
    );
    
    if (!itemEnCarrito || itemEnCarrito.cantidad <= 1) {
      // Si no existe o cantidad es 1, eliminar del carrito
      const response = await fetchWithToken(`${API_URL}/carrito/eliminar/${productId}`, {
        method: 'DELETE'
      });
      await handleResponse(response);
    } else {
      // Si cantidad > 1, restar 1 usando agregar con cantidad negativa
      const response = await fetchWithToken(`${API_URL}/carrito/agregar`, {
        method: 'POST',
        body: JSON.stringify({
          productoId: productId,
          cantidad: -1
        })
      });
      await handleResponse(response);
    }
    
    await cargarCarrito();
    pintarArticulos(listaArticulos);
    actualizarContador();
  } catch (error) {
    // Fallback a localStorage
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find(item => item.id === productId || item.productoId === productId);
    if (existente && existente.cantidad > 1) {
      existente.cantidad--;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      carritoActual = carrito;
      pintarArticulos(listaArticulos);
      actualizarContador();
    } else if (existente && existente.cantidad === 1) {
      // Si la cantidad es 1, eliminar del carrito
      const index = carrito.indexOf(existente);
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      carritoActual = carrito;
      pintarArticulos(listaArticulos);
      actualizarContador();
    }
  }
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
    
    await cargarCarrito();
    pintarArticulos(listaArticulos);
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
    carritoActual = carrito;
    pintarArticulos(listaArticulos);
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

// Event listener para recargar carrito cuando la página se muestra (incluye navegación atrás/adelante)
window.addEventListener('pageshow', async (event) => {
  if (listaArticulos.length === 0) {
    // Si listaArticulos está vacío, la página viene del caché, recargar todo
    await cargarArticulos();
    await cargarCategorias();
    await cargarCarrito();
    actualizarContador();
  } else {
    // Si ya tiene productos, solo recargar el carrito y repintar
    await cargarCarrito();
    await pintarArticulos(listaArticulos);
    actualizarContador();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (!verificarAutenticacion()) return;
  cargarArticulos();
  cargarCategorias();
  cargarCarrito();
  actualizarContador();
  
  // Event listener para búsqueda
  if (searchInput) {
    searchInput.addEventListener('input', filtrarProductos);
  }
});
