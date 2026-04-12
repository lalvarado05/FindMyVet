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
const seccionArticulos = document.querySelector("#seccionProductos");
const searchInput = document.querySelector("#searchInput");
const filtersContainer = document.querySelector("#filtersContainer");

// Trae los productos desde la API y los guarda en listaArticulos
const cargarArticulos = async () => {
    try {
        const response = await fetchWithToken(`${API_URL}/productos`);
        const result = await handleResponse(response);
        
        // Mapea los productos al formato que usa el frontend
        listaArticulos = result.productos.map(prod => ({
            id: prod._id,
            name: prod.nombre,
            price_crc: prod.precio,
            image: prod.imagen,
            description: prod.descripcion || "",
            stock: prod.stock,
            categoria: (prod.categoria && typeof prod.categoria === 'object') 
                        ? prod.categoria.nombre 
                        : (prod.categoria || "General")
        }));
        
        pintarArticulos(listaArticulos);
        crearFiltros(); 
    } catch (error) {
        console.error('Error al cargar productos:', error);
        seccionArticulos.innerHTML = `<p class='text-center py-4'>Error al cargar productos: ${error.message}</p>`;
    }
};

// Genera el HTML de cada producto y lo muestra en pantalla
function pintarArticulos(articulos) {
    if (articulos.length === 0) {
        seccionArticulos.innerHTML = "<p class='text-center py-4'>No se encontraron productos</p>";
        return;
    }

    const html = articulos.map((articulo) => `
        <div class="col-md-4 col-xl-3 mb-4">
            <div class="card h-100 shadow-sm">
                <a href="vistaProducto.html?id=${articulo.id}">
                    <img class="card-img-top p-3" 
                         src="${getImageUrl(articulo.image)}" 
                         alt="${articulo.name}" 
                         style="height:150px; object-fit:contain; cursor:pointer;">
                </a>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-center mb-2">${articulo.name}</h6>
                    <p class="text-center fw-bold text-success mb-3">
                        ₡${articulo.price_crc.toLocaleString()}
                    </p>
                    
                    <div class="d-flex align-items-center justify-content-between mt-auto pt-3 border-top">
                        <button class="btn-agregar-redondo" onclick="agregarCarrito('${articulo.id}')">
                            <i class="bi bi-cart-plus"></i> Agregar
                        </button>
                        <div class="product-counter-mini">
                            <button class="counter-btn" onclick="decrementar('${articulo.id}')">−</button>
                            <span id="cant-${articulo.id}" class="counter-value">1</span>
                            <button class="counter-btn" onclick="incrementar('${articulo.id}')">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    seccionArticulos.innerHTML = html;
}

// Crea los botones de filtro según las categorías disponibles
function crearFiltros() {
    const categoriasUnicas = [...new Set(listaArticulos.map(p => p.categoria))]
                                .filter(c => typeof c === 'string')
                                .sort();
    
    filtersContainer.innerHTML = `
        <button class="filter-pill active" data-category="all">Todos</button>
        ${categoriasUnicas.map(cat => `
            <button class="filter-pill" data-category="${cat}">${cat}</button>
        `).join('')}
    `;

    // Agrega el evento click a cada filtro
    document.querySelectorAll('.filter-pill').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filtrarTodo();
        });
    });
}

// Filtra los productos por búsqueda y categoría seleccionada
function filtrarTodo() {
    const searchTerm = searchInput.value.toLowerCase();
    const activePill = document.querySelector('.filter-pill.active');
    const catSeleccionada = activePill ? activePill.getAttribute('data-category') : 'all';

    const filtrados = listaArticulos.filter(art => {
        const coincideBusqueda = art.name.toLowerCase().includes(searchTerm) || 
                                 art.description.toLowerCase().includes(searchTerm);
        const coincideCat = (catSeleccionada === 'all' || art.categoria === catSeleccionada);
        return coincideBusqueda && coincideCat;
    });

    pintarArticulos(filtrados);
}

// Suma 1 al contador del producto
function incrementar(id) {
    const el = document.getElementById(`cant-${id}`);
    if (el) el.innerText = parseInt(el.innerText) + 1;
}

// Resta 1 al contador, mínimo 1
function decrementar(id) {
    const el = document.getElementById(`cant-${id}`);
    if (el) {
        let val = parseInt(el.innerText);
        if (val > 1) el.innerText = val - 1;
    }
}

// Agrega el producto al carrito con la cantidad seleccionada
async function agregarCarrito(productId) {
    const cantElement = document.getElementById(`cant-${productId}`);
    const cantidadSeleccionada = cantElement ? parseInt(cantElement.innerText) : 1;
    const prod = listaArticulos.find(p => p.id === productId);
    
    if (!prod) return;

    try {
        // Intenta agregar via API
        const response = await fetchWithToken(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            body: JSON.stringify({ 
                productoId: productId, 
                cantidad: cantidadSeleccionada 
            })
        });
        await handleResponse(response);
        
        actualizarContador();
        Swal.fire({ 
            title: '¡Añadido!', 
            text: `${cantidadSeleccionada}x ${prod.name} al carrito`, 
            icon: 'success', 
            timer: 1500, 
            showConfirmButton: false 
        });
        
        if(cantElement) cantElement.innerText = "1";

    } catch (error) {
        // Si la API falla, guarda en localStorage
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const existente = carrito.find(item => item.id === productId);

        if (existente) {
            existente.cantidad += cantidadSeleccionada;
        } else {
            carrito.push({
                id: prod.id,
                name: prod.name,
                price_crc: prod.price_crc,
                image: prod.image,
                cantidad: cantidadSeleccionada
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        
        Swal.fire({ 
            title: '¡Añadido!', 
            text: `${cantidadSeleccionada}x ${prod.name} al carrito (Local)`, 
            icon: 'success', 
            timer: 1500, 
            showConfirmButton: false 
        });
        
        if(cantElement) cantElement.innerText = "1";
    }
}

// Actualiza el número que aparece en el botón flotante del carrito
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
        // Si falla la API, cuenta desde localStorage
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const total = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
        badge.innerText = total;
    }
}

// Si el carrito cambia en otra pestaña, actualiza el contador
window.addEventListener('storage', (event) => {
    if (event.key === 'carrito') {
        actualizarContador();
    }
});

// Al cargar la página, verifica sesión y carga los productos
document.addEventListener("DOMContentLoaded", () => {
    if (!verificarAutenticacion()) return;
    
    cargarArticulos();
    actualizarContador();
    
    if (searchInput) {
        searchInput.addEventListener('input', filtrarTodo);
    }
});