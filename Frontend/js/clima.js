
async function cargarClimaNav() {
    const apiKey = "1f2390c1bda74d7a8dd22457261104"; 
    const textoClima = document.getElementById('clima-texto');
    const iconoClima = document.getElementById('clima-icono');

    if (!textoClima || !iconoClima) return;

    // Función principal para conectar con la API
    const consultarWeatherAPI = async (query) => {
        try {
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}&lang=es`;
            const res = await fetch(url);
            const datos = await res.json();

            if (!res.ok) throw new Error(datos.error.message);

            textoClima.innerText = `${Math.round(datos.current.temp_c)}°C ${datos.location.name}`;
            iconoClima.src = "https:" + datos.current.condition.icon;
            iconoClima.style.setProperty("display", "inline-block", "important");
            textoClima.classList.replace("text-muted", "text-dark");
        } catch (err) {
            console.error("Error en fetch:", err);
            textoClima.innerText = "Clima no disponible";
        }
    };

    // GEOLOCALIZACIÓN
    if (navigator.geolocation) {

        setTimeout(() => { // Retraso para evitar conflictos con otras funciones al cargar
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    // ÉXITO: Tenemos coordenadas exactas
                    const coordenadas = `${pos.coords.latitude},${pos.coords.longitude}`;
                    consultarWeatherAPI(coordenadas);
                },
                (error) => {
                    // FALLO O RECHAZO: Usamos ubicación por IP como "Plan B"
                    console.warn("Geo denegada, usando auto:ip como respaldo.");
                    consultarWeatherAPI("auto:ip");
                },
                { 
                    enableHighAccuracy: false, // No necesitamos precisión extrema para el clima
                    timeout: 5000 
                }
            );
        }, 500);
    } else {
        // Navegador sin GPS: Usar IP
        consultarWeatherAPI("auto:ip");
    }
}

document.addEventListener("DOMContentLoaded", cargarClimaNav);