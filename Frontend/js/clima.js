async function cargarClimaNav() {
    const apiKey = "dfd434841de54cedb0323441261104"; 
    const textoClima = document.getElementById('clima-texto');
    const iconoClima = document.getElementById('clima-icono');

    if (!textoClima || !iconoClima) return;

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
            textoClima.classList.add("fw-medium");

        } catch (err) {
            console.error("Error en fetch:", err);
            textoClima.innerText = "Clima no disponible";
        }
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coordenadas = `${pos.coords.latitude},${pos.coords.longitude}`;
                consultarWeatherAPI(coordenadas);
            },
            (error) => {
                console.warn("Ubicación exacta rechazada, usando IP de respaldo.");
                consultarWeatherAPI("auto:ip");
            },
            { 
                enableHighAccuracy: true, 
                timeout: 10000,           
                maximumAge: 0             
            }
        );
    } else {
        consultarWeatherAPI("auto:ip");
    }
}

document.addEventListener("DOMContentLoaded", cargarClimaNav);