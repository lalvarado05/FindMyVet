// Configuración de la API
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
