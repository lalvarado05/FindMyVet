const API_URL = 'http://localhost:3000/api';

// Función helper para hacer peticiones con token
async function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, {
        ...options,
        headers
    });
}

// Función helper para manejar errores de respuesta
async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
    }
    return data;
}

// Función helper para obtener URL de imagen (soporta URLs externas y locales)
function getImageUrl(imagen) {
    if (!imagen) return 'img/placeholder.png';
    // Si es una URL externa (http:// o https://), usarla directamente
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
        return imagen;
    }
    // Si es una ruta local, agregar el prefijo img/
    return 'img/' + imagen;
}

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const navbarLinks = document.querySelectorAll('.navbar-link');

navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Navegación al link
    });
});

// Verificar autenticación y mostrar elementos según rol
function verificarAutenticacion() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    const loginItem = document.querySelector('#loginItem');
    const loginLink = document.querySelector('#loginLink');
    const logoutItem = document.querySelector('#logoutItem');
    const logoutBtnItem = document.querySelector('#logoutBtnItem');
    const usuarioNombre = document.querySelector('#usuarioNombre');
    const adminPanel = document.querySelector('#adminPanel');

    if (usuario) {
        // Usuario autenticado
        if (loginItem) loginItem.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';
        if (logoutItem) logoutItem.style.display = 'block';
        if (logoutBtnItem) logoutBtnItem.style.display = 'block';
        if (usuarioNombre) usuarioNombre.textContent = `Hola, ${usuario.nombre}`;
        
        // Mostrar panel de admin si es admin
        if (adminPanel && usuario.rol === 'admin') {
            adminPanel.style.display = 'block';
        }
    } else {
        // Usuario no autenticado
        if (loginItem) loginItem.style.display = 'block';
        if (loginLink) loginLink.style.display = 'block';
        if (logoutItem) logoutItem.style.display = 'none';
        if (logoutBtnItem) logoutBtnItem.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'none';
        if (usuarioNombre) usuarioNombre.textContent = '';
    }
}

// Función de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioActual');
    window.location.href = 'login.html';
}

// Agregar event listener para logout
const logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

async function actualizarContador() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  
  try {
      const response = await fetchWithToken(`${API_URL}/carrito`);
      const result = await handleResponse(response);
      const carritoData = result.carrito || result;
      const items = carritoData.items || [];
      badge.innerText = items.reduce((acc, item) => acc + item.cantidad, 0);
  } catch (error) {
      // Fallback a localStorage si hay error o no hay token
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      badge.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  verificarAutenticacion();
  actualizarContador();
});