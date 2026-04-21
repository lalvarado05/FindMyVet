// Verificar que el usuario es admin, redirige si no
function verificarAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario || usuario.rol !== 'admin') {
        Swal.fire({
            title: 'Acceso Denegado',
            text: 'No tienes permisos para acceder a esta página.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        }).then(() => {
            window.location.href = 'index.html';
        });
        return false;
    }
    return true;
}

// ==================== USUARIOS ====================
async function cargarUsuarios() {
    try {
        const response = await fetchWithToken(`${API_URL}/auth/usuarios`);
        const result = await handleResponse(response);
        const tbody = document.getElementById('usuariosTable');
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        
        tbody.innerHTML = result.usuarios.map(usuario => {
            const esPropioUsuario = usuarioActual && usuarioActual.id === usuario._id;
            return `
            <tr>
                <td>${usuario.nombre}</td>
                <td>${usuario.username}</td>
                <td>${usuario.email}</td>
                <td>${usuario.cedula || '-'}</td>
                <td>
                    <span class="badge ${usuario.rol === 'admin' ? 'bg-primary' : 'bg-secondary'}">
                        ${usuario.rol}
                    </span>
                </td>
                <td>
                    <span class="badge ${usuario.activo ? 'bg-success' : 'bg-danger'}">
                        ${usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    ${esPropioUsuario ? '<span class="text-muted small">(Tu usuario)</span>' : `
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="cambiarRol('${usuario._id}')">
                        <i class="fa-solid fa-user-gear"></i> Rol
                    </button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="toggleActivo('${usuario._id}', ${usuario.activo})">
                        <i class="fa-solid ${usuario.activo ? 'fa-user-lock' : 'fa-user-check'}"></i>
                        ${usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${usuario._id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    `}
                </td>
            </tr>
        `}).join('');
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

async function cambiarRol(usuarioId) {
    const { value: nuevoRol } = await Swal.fire({
        title: 'Cambiar Rol',
        input: 'select',
        inputOptions: {
            'cliente': 'Cliente',
            'admin': 'Administrador'
        },
        inputPlaceholder: 'Selecciona el nuevo rol',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar'
    });
    
    if (nuevoRol) {
        try {
            const response = await fetchWithToken(`${API_URL}/auth/usuarios/${usuarioId}/rol`, {
                method: 'PUT',
                body: JSON.stringify({ rol: nuevoRol })
            });
            await handleResponse(response);
            Swal.fire({
                title: 'Éxito',
                text: 'Rol actualizado correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            cargarUsuarios();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }
}

async function toggleActivo(usuarioId, estadoActual) {
    const accion = estadoActual ? 'deshabilitar' : 'habilitar';
    const result = await Swal.fire({
        title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
        text: `¿Estás seguro de ${accion} este usuario?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Sí, ' + accion,
        cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetchWithToken(`${API_URL}/auth/usuarios/${usuarioId}/activo`, {
                method: 'PUT'
            });
            await handleResponse(response);
            Swal.fire({
                title: 'Éxito',
                text: `Usuario ${estadoActual ? 'deshabilitado' : 'habilitado'} correctamente.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            cargarUsuarios();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }
}

async function eliminarUsuario(usuarioId) {
    const result = await Swal.fire({
        title: '¿Eliminar usuario?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
        try {
            const response = await fetchWithToken(`${API_URL}/auth/usuarios/${usuarioId}`, {
                method: 'DELETE'
            });
            await handleResponse(response);
            Swal.fire({
                title: 'Éxito',
                text: 'Usuario eliminado correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            cargarUsuarios();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }
}

// ==================== ÓRDENES ====================
let usuariosLista = [];

async function cargarOrdenes() {
    try {
        const estado = document.getElementById('filtroEstadoOrden').value;
        const usuario = document.getElementById('filtroUsuarioOrden').value;
        
        let url = `${API_URL}/ordenes`;
        const params = [];
        if (estado) params.push(`estado=${estado}`);
        if (usuario) params.push(`usuario=${usuario}`);
        if (params.length > 0) url += '?' + params.join('&');
        
        const response = await fetchWithToken(url);
        const result = await handleResponse(response);
        const tbody = document.getElementById('ordenesTable');
        
        tbody.innerHTML = result.ordenes.map(orden => `
            <tr>
                <td>${orden._id.slice(-8)}</td>
                <td>${orden.usuario?.nombre || 'N/A'}</td>
                <td>₡${orden.total.toLocaleString()}</td>
                <td>
                    <span class="badge ${getEstadoBadgeClass(orden.estado)}">${orden.estado}</span>
                </td>
                <td>${new Date(orden.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Cambiar Estado
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="cambiarEstadoOrden('${orden._id}', 'PENDIENTE')">Pendiente</a></li>
                            <li><a class="dropdown-item" href="#" onclick="cambiarEstadoOrden('${orden._id}', 'PAGADO')">Pagado</a></li>
                            <li><a class="dropdown-item" href="#" onclick="cambiarEstadoOrden('${orden._id}', 'ENVIADO')">Enviado</a></li>
                            <li><a class="dropdown-item" href="#" onclick="cambiarEstadoOrden('${orden._id}', 'ENTREGADO')">Entregado</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="cambiarEstadoOrden('${orden._id}', 'CANCELADO')">Cancelar</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
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

async function cambiarEstadoOrden(ordenId, nuevoEstado) {
    try {
        const response = await fetchWithToken(`${API_URL}/ordenes/${ordenId}/estado`, {
            method: 'PUT',
            body: JSON.stringify({ estado: nuevoEstado })
        });
        await handleResponse(response);
        Swal.fire({
            title: 'Éxito',
            text: `Estado cambiado a ${nuevoEstado}`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        cargarOrdenes();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

async function cargarUsuariosFiltro() {
    try {
        const response = await fetchWithToken(`${API_URL}/auth/usuarios`);
        const result = await handleResponse(response);
        usuariosLista = result.usuarios;
        
        const select = document.getElementById('filtroUsuarioOrden');
        select.innerHTML = '<option value="">Todos los usuarios</option>' +
            usuariosLista.map(u => `<option value="${u._id}">${u.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error al cargar usuarios para filtro:', error);
    }
}

// ==================== CATEGORÍAS ====================
async function cargarCategorias() {
    try {
        const response = await fetchWithToken(`${API_URL}/categorias`);
        const result = await handleResponse(response);
        const tbody = document.getElementById('categoriasTable');
        
        tbody.innerHTML = result.categorias.map(categoria => `
            <tr>
                <td>${categoria.nombre}</td>
                <td>${categoria.descripcion || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editarCategoria('${categoria._id}')">
                        <i class="fa-solid fa-pen"></i> Editar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

function mostrarModalCategoria(categoriaId = null) {
    const modal = new bootstrap.Modal(document.getElementById('modalCategoria'));
    const title = document.getElementById('modalCategoriaTitle');
    const form = document.getElementById('formCategoria');
    
    if (categoriaId) {
        title.textContent = 'Editar Categoría';
    } else {
        title.textContent = 'Nueva Categoría';
        form.reset();
        document.getElementById('categoriaId').value = '';
    }
    
    modal.show();
}

async function editarCategoria(categoriaId) {
    try {
        const response = await fetchWithToken(`${API_URL}/categorias/${categoriaId}`);
        const result = await handleResponse(response);
        
        document.getElementById('categoriaId').value = result.categoria._id;
        document.getElementById('categoriaNombre').value = result.categoria.nombre;
        document.getElementById('categoriaDescripcion').value = result.categoria.descripcion || '';
        
        mostrarModalCategoria(categoriaId);
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

async function guardarCategoria() {
    const categoriaId = document.getElementById('categoriaId').value;
    const nombre = document.getElementById('categoriaNombre').value;
    const descripcion = document.getElementById('categoriaDescripcion').value;
    
    if (!nombre) {
        Swal.fire({
            title: 'Error',
            text: 'El nombre es requerido.',
            icon: 'error'
        });
        return;
    }
    
    try {
        let url = `${API_URL}/categorias`;
        let method = 'POST';
        
        if (categoriaId) {
            url += `/${categoriaId}`;
            method = 'PUT';
        }
        
        const response = await fetchWithToken(url, {
            method,
            body: JSON.stringify({ nombre, descripcion })
        });
        await handleResponse(response);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCategoria'));
        modal.hide();
        
        Swal.fire({
            title: 'Éxito',
            text: categoriaId ? 'Categoría actualizada.' : 'Categoría creada.',
            icon: 'success'
        });
        
        cargarCategorias();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

// ==================== PRODUCTOS ====================
let categoriasLista = [];

async function cargarProductos() {
    try {
        const response = await fetchWithToken(`${API_URL}/productos`);
        const result = await handleResponse(response);
        const tbody = document.getElementById('productosTable');
        
        tbody.innerHTML = result.productos.map(producto => `
            <tr>
                <td>
                    <img src="${getImageUrl(producto.imagen)}" alt="${producto.nombre}" 
                         style="width: 50px; height: 50px; object-fit: contain;">
                </td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria?.nombre || '-'}</td>
                <td>₡${producto.precio.toLocaleString()}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarProducto('${producto._id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success me-1" onclick="mostrarModalStock('${producto._id}', '${producto.nombre}')">
                        <i class="fa-solid fa-plus"></i> Stock
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

async function cargarCategoriasSelect() {
    try {
        const response = await fetchWithToken(`${API_URL}/categorias`);
        const result = await handleResponse(response);
        categoriasLista = result.categorias;
        
        const select = document.getElementById('productoCategoria');
        select.innerHTML = '<option value="">Seleccionar categoría</option>' +
            categoriasLista.map(c => `<option value="${c._id}">${c.nombre}</option>`).join('');
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

function mostrarModalProducto(productoId = null) {
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    const title = document.getElementById('modalProductoTitle');
    const form = document.getElementById('formProducto');
    
    if (productoId) {
        title.textContent = 'Editar Producto';
    } else {
        title.textContent = 'Nuevo Producto';
        form.reset();
        document.getElementById('productoId').value = '';
    }
    
    modal.show();
}

async function editarProducto(productoId) {
    try {
        const response = await fetchWithToken(`${API_URL}/productos/${productoId}`);
        const result = await handleResponse(response);
        
        const producto = result.producto;
        document.getElementById('productoId').value = producto._id;
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoCategoria').value = producto.categoria?._id || '';
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoDescripcion').value = producto.descripcion || '';
        document.getElementById('productoImagen').value = producto.imagen || '';
        
        mostrarModalProducto(productoId);
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

async function guardarProducto() {
    const productoId = document.getElementById('productoId').value;
    const nombre = document.getElementById('productoNombre').value;
    const categoriaId = document.getElementById('productoCategoria').value;
    const precio = parseFloat(document.getElementById('productoPrecio').value);
    const stock = parseInt(document.getElementById('productoStock').value);
    const descripcion = document.getElementById('productoDescripcion').value;
    const imagen = document.getElementById('productoImagen').value;
    
    if (!nombre || !categoriaId || isNaN(precio) || isNaN(stock)) {
        Swal.fire({
            title: 'Error',
            text: 'Los campos nombre, categoría, precio y stock son requeridos.',
            icon: 'error'
        });
        return;
    }
    
    try {
        let url = `${API_URL}/productos`;
        let method = 'POST';
        let body = { nombre, categoriaId, precio, stock, descripcion, imagen };
        
        if (productoId) {
            url += `/${productoId}`;
            method = 'PUT';
            body = { nombre, categoriaId, precio, stock, descripcion, imagen };
        }
        
        const response = await fetchWithToken(url, {
            method,
            body: JSON.stringify(body)
        });
        await handleResponse(response);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
        modal.hide();
        
        Swal.fire({
            title: 'Éxito',
            text: productoId ? 'Producto actualizado.' : 'Producto creado.',
            icon: 'success'
        });
        
        cargarProductos();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

function mostrarModalStock(productoId, nombre) {
    document.getElementById('stockProductoId').value = productoId;
    document.getElementById('stockProductoNombre').textContent = nombre;
    document.getElementById('stockCantidad').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('modalStock'));
    modal.show();
}

async function agregarStock() {
    const productoId = document.getElementById('stockProductoId').value;
    const cantidad = parseInt(document.getElementById('stockCantidad').value);
    
    if (isNaN(cantidad)) {
        Swal.fire({
            title: 'Error',
            text: 'La cantidad es requerida.',
            icon: 'error'
        });
        return;
    }
    
    try {
        const response = await fetchWithToken(`${API_URL}/productos/${productoId}/stock`, {
            method: 'PUT',
            body: JSON.stringify({ stock: cantidad })
        });
        await handleResponse(response);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalStock'));
        modal.hide();
        
        Swal.fire({
            title: 'Éxito',
            text: 'Stock actualizado.',
            icon: 'success'
        });
        
        cargarProductos();
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    if (!verificarAdmin()) return;
    
    // Event listeners para filtros de órdenes
    document.getElementById('filtroEstadoOrden').addEventListener('change', cargarOrdenes);
    document.getElementById('filtroUsuarioOrden').addEventListener('change', cargarOrdenes);
    
    // Cargar datos iniciales
    cargarUsuarios();
    cargarOrdenes();
    cargarCategorias();
    cargarProductos();
    cargarUsuariosFiltro();
    cargarCategoriasSelect();
});
