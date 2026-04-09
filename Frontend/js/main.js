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
    const loginLink = document.querySelector('#loginLink');
    const logoutLink = document.querySelector('#logoutLink');
    const adminPanel = document.querySelector('#adminPanel');
    const usuarioNombre = document.querySelector('#usuarioNombre');

    if (usuario) {
        // Usuario autenticado
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (usuarioNombre) usuarioNombre.textContent = `Hola, ${usuario.nombre}`;
        
        // Mostrar panel de admin si es admin
        if (adminPanel && usuario.rol === 'admin') {
            adminPanel.style.display = 'block';
        }
    } else {
        // Usuario no autenticado
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
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