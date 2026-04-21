function requireLogin() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function getEstadoBadgeClass(estado) {
    const clases = {
        'PENDIENTE': 'bg-warning',
        'PAGADO': 'bg-info',
        'ENVIADO': 'bg-primary',
        'ENTREGADO': 'bg-success',
        'CANCELADO': 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
}

async function cargarMisOrdenes() {
    try {
        const response = await fetchWithToken(`${API_URL}/ordenes/mis-ordenes`);
        const result = await handleResponse(response);
        const tbody = document.getElementById('misOrdenesTable');

        if (!result.ordenes || result.ordenes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        Todavía no has realizado ninguna orden.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = result.ordenes.map(orden => `
            <tr>
                <td>${orden._id.slice(-8)}</td>
                <td>₡${orden.total.toLocaleString()}</td>
                <td>
                    <span class="badge ${getEstadoBadgeClass(orden.estado)}">${orden.estado}</span>
                </td>
                <td>${new Date(orden.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="verDetalleOrden('${orden._id}')">
                        <i class="fa-solid fa-eye me-1"></i> Ver Detalle
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
    }
}

async function verDetalleOrden(ordenId) {
    const modalEl = document.getElementById('modalDetalleOrden');
    const body = document.getElementById('detalleOrdenBody');
    body.innerHTML = '<p class="text-center">Cargando...</p>';
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    try {
        const response = await fetchWithToken(`${API_URL}/ordenes/${ordenId}`);
        const result = await handleResponse(response);
        const orden = result.orden;

        const fecha = new Date(orden.createdAt).toLocaleString();
        const itemsHtml = orden.items.map(item => `
            <tr>
                <td>${item.nombre}</td>
                <td class="text-center">${item.cantidad}</td>
                <td class="text-end">₡${item.precio.toLocaleString()}</td>
                <td class="text-end">₡${(item.precio * item.cantidad).toLocaleString()}</td>
            </tr>
        `).join('');

        body.innerHTML = `
            <div class="row mb-3">
                <div class="col-md-6">
                    <p class="mb-1"><strong>ID:</strong> ${orden._id}</p>
                    <p class="mb-1"><strong>Fecha:</strong> ${fecha}</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-1"><strong>Estado:</strong>
                        <span class="badge ${getEstadoBadgeClass(orden.estado)}">${orden.estado}</span>
                    </p>
                    <p class="mb-1"><strong>Total:</strong> ₡${orden.total.toLocaleString()}</p>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-sm table-bordered align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Producto</th>
                            <th class="text-center">Cantidad</th>
                            <th class="text-end">Precio</th>
                            <th class="text-end">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                    <tfoot>
                        <tr class="table-light">
                            <td colspan="3" class="text-end"><strong>Total</strong></td>
                            <td class="text-end"><strong>₡${orden.total.toLocaleString()}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    } catch (error) {
        body.innerHTML = `<p class="text-danger text-center">${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!requireLogin()) return;
    cargarMisOrdenes();
});
