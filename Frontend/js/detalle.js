document.addEventListener("DOMContentLoaded", () => {
    // 1. Verificamos si hay un ID en la URL
    const params = new URLSearchParams(window.location.search);
    const idProducto = parseInt(params.get("id"));
    let productoActual = null; 

    if (!idProducto) {
        alert("ERROR: No hay ningún ID en la URL. Entra desde productos.html haciendo clic en una imagen.");
        return;
    }

    fetch("data/productos.json") 
        .then(response => {
            if (!response.ok) throw new Error("No se encontró el archivo productos.json");
            return response.json();
        })
        .then(productos => {
            productoActual = productos.find(p => p.id === idProducto);

            if (productoActual) {
                document.getElementById("detalleNombre").innerText = productoActual.name;
                document.getElementById("detallePrecio").innerText = "₡" + productoActual.price_crc.toLocaleString();
                document.getElementById("detalleMarca").innerText = "Marca: " + productoActual.marca;
                document.getElementById("detalleDescripcion").innerText = productoActual.description;
                document.getElementById("detalleImagen").src = "img/" + productoActual.image;

                const btnAgregar = document.getElementById("btnAgregar");
                
                btnAgregar.onclick = () => {
                    agregarAlCarritoDesdeDetalle(productoActual);
                };

            } else {
                alert("ERROR: El ID " + idProducto + " no existe.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

function agregarAlCarritoDesdeDetalle(prod) {
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
    
    // Actualiza el número en el icono del carrito
    if (typeof actualizarContador === "function") {
        actualizarContador();
    }

    Swal.fire({
        title: '¡Añadido!',
        text: `${prod.name} al carrito`,
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
    });
}