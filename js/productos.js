let listaArticulos = [];

// ===== Sección Productos HTML =====
const seccionArticulos = document.querySelector("#seccionProductos");

function pintarArticulos(articulos){

  if(articulos.length === 0){
    seccionArticulos.innerHTML = "<p class='text-center'>Sin resultados</p>";
    return;
  }

  const html = articulos.map((articulo, index) => {

    return `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">

          <img 
            class="card-img-top p-3"
            style="height:150px; object-fit:contain;"
            src="img/productos/${articulo.image}"
            alt="${articulo.name}"
          >

          <div class="card-body d-flex flex-column">

            <h6 class="card-title text-center">
              ${articulo.name}
            </h6>

            <p class="text-center">
              <span class="badge bg-primary">${articulo.type}</span>
              <span class="badge bg-secondary">${articulo.category}</span>
            </p>

            <p class="text-center text-muted small">
              ${articulo.marca}
            </p>

            <p class="text-center fw-bold text-success">
              ₡${articulo.price_crc.toLocaleString()}
            </p>

            <div class="mt-auto">
                <button 
                  class="btn btn-dark w-100"
                  onclick="agregarCarrito(${index})"
                >
                  Agregar al carrito
                </button>
            </div>

          </div>
        </div>
      </div>
    `;

  }).join('');

  seccionArticulos.innerHTML = html;
}

// ===== Cargar JSON =====
const cargarArticulos = () => {

  fetch("data/productos.json")
    .then((response) => response.json())
    .then((articulos) => {

      listaArticulos = articulos;
      pintarArticulos(listaArticulos);

    })
    .catch(() => {
      seccionArticulos.innerHTML = "<p>No se pudo cargar el archivo JSON</p>";
    });

};

cargarArticulos();


// ===== Filtro =====
const inputFiltro = document.querySelector("#searchInput");

inputFiltro.addEventListener("keyup", () => {

  const texto = inputFiltro.value.toLowerCase().trim();

  if(texto === ""){
    pintarArticulos(listaArticulos);
    return;
  }

  const filtrados = listaArticulos.filter(articulo =>
    articulo.name.toLowerCase().includes(texto) ||
    articulo.marca.toLowerCase().includes(texto)
  );

  pintarArticulos(filtrados);

});

// ===== Agregar al carrito =====



