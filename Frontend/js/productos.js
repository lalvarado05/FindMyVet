let listaArticulos = [];
const seccionArticulos = document.querySelector("#seccionProductos");

// 1. Cargar el JSON
const cargarArticulos = () => {
  fetch("data/productos.json")
    .then((response) => response.json())
    .then((articulos) => {
      listaArticulos = articulos;
      pintarArticulos(listaArticulos);
    })
    .catch(() => {
      seccionArticulos.innerHTML = "<p>Error al cargar productos</p>";
    });
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
      
<a href="VistaProducto.html?id=${articulo.id}">
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

        <button class="btn btn-dark w-100 mt-auto" onclick="agregarCarrito(${index})">
          Agregar al carrito
        </button>
      </div>
    </div>
  </div>`;
}).join('');
  seccionArticulos.innerHTML = html;
}

function agregarCarrito(index) {
  const prod = listaArticulos[index];
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
  actualizarContador();
  
  Swal.fire({
    title: '¡Añadido!',
    text: `${prod.name} al carrito`,
    icon: 'success',
    timer: 1000,
    showConfirmButton: false
  });
}

function actualizarContador() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  badge.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarArticulos();
  actualizarContador();
});
