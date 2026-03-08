document.addEventListener("DOMContentLoaded", () => {

    const carritoContainer = document.getElementById("carritoProductos");
    const totalContainer = document.getElementById("totalCarrito");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function renderCarrito() {

        carritoContainer.innerHTML = "";

        let total = 0;

        carrito.forEach((producto, index) => {

            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const fila = document.createElement("div");

            fila.classList.add(
                "d-flex",
                "justify-content-between",
                "align-items-center",
                "mb-3",
                "border-bottom",
                "pb-2"
            );

            fila.innerHTML = `
                <div>
                    <strong>${producto.nombre}</strong>
                    <br>
                    ₡${producto.precio.toLocaleString()}
                </div>

                <div class="d-flex align-items-center gap-2">

                    <button class="btn btn-sm btn-outline-secondary minus">
                        -
                    </button>

                    <span class="cantidad">
                        ${producto.cantidad}
                    </span>

                    <button class="btn btn-sm btn-outline-secondary plus">
                        +
                    </button>

                </div>

                <div>
                    ₡${subtotal.toLocaleString()}
                </div>

                <button class="btn btn-sm btn-danger eliminar">
                    ✕
                </button>
            `;

            const plus = fila.querySelector(".plus");
            const minus = fila.querySelector(".minus");
            const eliminar = fila.querySelector(".eliminar");

            plus.addEventListener("click", () => {

                carrito[index].cantidad++;

                actualizar();

            });

            minus.addEventListener("click", () => {

                if (carrito[index].cantidad > 1) {

                    carrito[index].cantidad--;

                } else {

                    carrito.splice(index, 1);

                }

                actualizar();

            });

            eliminar.addEventListener("click", () => {

                carrito.splice(index, 1);

                actualizar();

            });

            carritoContainer.appendChild(fila);

        });

        totalContainer.innerText = total.toLocaleString();

    }

    function actualizar() {

        localStorage.setItem("carrito", JSON.stringify(carrito));

        renderCarrito();

    }

    renderCarrito();

});