
// CONTADOR DE PRODUCTOS

document.querySelectorAll('.product-main-card').forEach(card => {

    const plus = card.querySelector('.plus');
    const minus = card.querySelector('.minus');
    const number = card.querySelector('.counter-number');

    let value = parseInt(number.innerText);

    plus.addEventListener('click', () => {

        value++;
        number.innerText = value;

    });

    minus.addEventListener('click', () => {

        if (value > 0) {

            value--;
            number.innerText = value;

        }

    });

});


// BUSCADOR

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const filtersContainer = document.getElementById("filtersContainer");

    if (!searchInput) return;

    searchInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            const value = searchInput.value.trim();

            if (value === "") return;

            const badge = document.createElement("span");

            badge.className =
                "badge bg-light text-dark filter-badge";

            badge.textContent = value + " ✕";

            badge.addEventListener("click", () => {

                badge.remove();

            });

            filtersContainer.appendChild(badge);

            searchInput.value = "";

        }

    });

});


// AGREGAR AL CARRITO

const btnAgregar = document.getElementById("btnAgregar");

if (btnAgregar) {

    btnAgregar.addEventListener("click", () => {

        const nombre =
            document.querySelector(".product-name").innerText;

        const precio =
            parseInt(document.querySelector(".product-price").dataset.price);

        const cantidad =
            parseInt(document.querySelector(".counter-number").innerText);

        if (cantidad === 0) {

            alert("Selecciona al menos una cantidad");
            return;

        }

        let carrito =
            JSON.parse(localStorage.getItem("carrito")) || [];

        const productoExistente =
            carrito.find(p => p.nombre === nombre);

        if (productoExistente) {

            productoExistente.cantidad += cantidad;

        } else {

            carrito.push({
                nombre,
                precio,
                cantidad
            });

        }

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

        alert("Producto agregado al carrito");

    });

}

function actualizarContadorCarrito(){

    const cartCount = document.getElementById("cartCount");

    if(!cartCount) return;

    let carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];

    let totalProductos = 0;

    carrito.forEach(producto => {
        totalProductos += producto.cantidad;
    });

    cartCount.innerText = totalProductos;

}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);