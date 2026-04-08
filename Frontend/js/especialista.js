let productosData = [];

// Función para cargar los productos
async function cargarProductos() {
    try {
        console.log("Cargando productos...");
        const response = await fetch('productos.json'); 
        
        if (!response.ok) {
            throw new Error(`No se pudo encontrar productos.json (Error ${response.status})`);
        }

        productosData = await response.json();
        console.log("Productos cargados:", productosData);
        renderizarProductos(productosData);
    } catch (error) {
        console.error("Error crítico:", error);
        document.getElementById("seccionProductos").innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Error al cargar productos. Revisa la consola (F12).</p>
            </div>`;
    }
}

// Función para mostrar los productos en el HTML
function renderizarProductos(lista) {
    const contenedor = document.getElementById("seccionProductos");
    if (!contenedor) return;
    
    contenedor.innerHTML = "";

    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card h-100 product-main-card" data-id="${prod.id}">
                <img src="img/${prod.image}" class="card-img-top p-3" alt="${prod.name}" style="height: 200px; object-fit: contain;">
                <div class="card-body d-flex flex-column">
                    <h5 class="product-name card-title" style="font-size: 1.1rem;">${prod.name}</h5>
                    <p class="card-text text-muted small" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${prod.description}
                    </p>
                    <div class="mt-auto">
                        <span class="fw-bold product-price" data-price="${prod.price_crc}">
                            ₡${prod.price_crc.toLocaleString()}
                        </span>
                        <div class="product-counter mt-2 d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-dark minus">-</button>
                            <span class="counter-number">0</span>
                            <button class="btn btn-sm btn-outline-dark plus">+</button>
                        </div>
                        <button class="btn btn-dark w-100 mt-3 btn-agregar-individual">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    asignarEventosContadores();
}

// Lógica de botones y carrito
function asignarEventosContadores() {
    document.querySelectorAll('.product-main-card').forEach(card => {
        const plus = card.querySelector('.plus');
        const minus = card.querySelector('.minus');
        const number = card.querySelector('.counter-number');
        const btnAgregar = card.querySelector('.btn-agregar-individual');

        plus.onclick = () => {
            let val = parseInt(number.innerText);
            number.innerText = val + 1;
        };

        minus.onclick = () => {
            let val = parseInt(number.innerText);
            if (val > 0) number.innerText = val - 1;
        };

        btnAgregar.onclick = () => {
            const nombre = card.querySelector(".product-name").innerText;
            const precio = parseInt(card.querySelector(".product-price").dataset.price);
            const cantidad = parseInt(number.innerText);

            if (cantidad === 0) {
                alert("Por favor, selecciona al menos una unidad.");
                return;
            }

            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            const existente = carrito.find(p => p.nombre === nombre);

            if (existente) {
                existente.cantidad += cantidad;
            } else {
                carrito.push({ nombre, precio, cantidad });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContadorCarrito();
            number.innerText = "0";
            alert(`${nombre} añadido.`);
        };
    });
}

function actualizarContadorCarrito() {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    cartCount.innerText = total;
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarContadorCarrito();
});