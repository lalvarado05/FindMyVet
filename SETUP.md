# Guía de Configuración y Ejecución - PetZone

Este documento proporciona instrucciones paso a paso para configurar y ejecutar el proyecto PetZone en una nueva computadora.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

### Software Necesario
- **Node.js** (versión 14 o superior) - [Descargar aquí](https://nodejs.org/)
- **MongoDB** (versión 4.4 o superior) - [Descargar aquí](https://www.mongodb.com/try/download/community)
- **Git** (opcional, para clonar el repositorio) - [Descargar aquí](https://git-scm.com/downloads)
- **Editor de código** (VS Code recomendado) - [Descargar aquí](https://code.visualstudio.com/)

### Cuenta de MongoDB Atlas
- Necesitas una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- O puedes usar MongoDB localmente

---

## 🚀 Instalación Paso a Paso

### 1. Obtener el Proyecto

#### Opción A: Clonar desde Git (Recomendado)
```bash
git clone <URL_DEL_REPOSITORIO>
cd FindMyVet
```

#### Opción B: Descargar ZIP
1. Descarga el archivo ZIP del repositorio
2. Descomprime el archivo en una carpeta
3. Navega a la carpeta del proyecto

### 2. Configurar el Backend

El backend se encuentra en la carpeta `Backend/`.

#### 2.1. Instalar Dependencias
```bash
cd Backend
npm install
```

#### 2.2. Configurar Variables de Entorno
1. Copia el archivo `.env.example`:
```bash
copy .env.example .env
```

2. Abre el archivo `.env` y configura las siguientes variables:

```env
# MongoDB Atlas URI
MONGODB_URI=mongodb://<USERNAME>:<PASSWORD>@<CLUSTER_URL>/mongodb.net,ac-golhtu0-shard-00-01.0glo5xz.mongodb.net:27017,ac-golhtu0-shard-00-02.0glo5xz.mongodb.net:27017/?ssl=true&replicaSet=<REPLICA_SET>&authSource=admin&appName=<APP_NAME>

# Secreto para JWT (cámbialo por algo seguro)
JWT_SECRET="tu_secreto_super_seguro_aqui"
```

**Importante:** Reemplaza los valores entre `<>` con tus credenciales reales de MongoDB Atlas.

#### 2.3. Poblar la Base de Datos con Productos de Ejemplo
```bash
node seed.js
```

Este script creará automáticamente:
- 4 categorías de productos (Alimento, Atún, Snacks, Accesorio)
- 20 productos de ejemplo con stock de 50 unidades cada uno

#### 2.4. Iniciar el Servidor Backend
```bash
node server.js
```

El servidor backend se iniciará en `http://localhost:3000`

**Verificación:** Deberías ver el mensaje:
```
Conexión con la base de datos exitosa
Servidor corriendo en http://localhost:3000
```

### 3. Configurar el Frontend

El frontend se encuentra en la carpeta `Frontend/`.

#### 3.1. Instalar Dependencias
```bash
cd Frontend
npm install
```

#### 3.2. Compilar Sass (si es necesario)
```bash
npm run sass
```

#### 3.3. Ejecutar el Frontend
El frontend no requiere un servidor de desarrollo específico. Puedes abrir los archivos HTML directamente en tu navegador, pero se recomienda usar un servidor como:

**Opción A: Usar Live Server en VS Code**
1. Instala la extensión "Live Server" en VS Code
2. Abre `index.html`
3. Haz clic derecho y selecciona "Open with Live Server"

**Opción B: Usar Python (si está instalado)**
```bash
cd Frontend
python -m http.server 5500
```

Luego abre `http://localhost:5500` en tu navegador.

---

## 📁 Estructura del Proyecto

```
FindMyVet/
├── Backend/                    # Servidor Node.js + Express
│   ├── models/                # Modelos de Mongoose
│   │   ├── usuario.js
│   │   ├── producto.js
│   │   ├── categoria.js
│   │   ├── carrito.js
│   │   └── orden.js
│   ├── routes/                # Rutas de la API
│   │   ├── auth.route.js
│   │   ├── productos.route.js
│   │   ├── carrito.route.js
│   │   └── ordenes.route.js
│   ├── middleware/            # Middlewares
│   │   └── auth.js
│   ├── server.js              # Archivo principal del servidor
│   ├── seed.js                # Script para poblar la BD
│   ├── .env                   # Variables de entorno (NO SUBIR A GIT)
│   ├── .env.example           # Ejemplo de variables de entorno
│   └── package.json
├── Frontend/                   # Aplicación Web
│   ├── index.html             # Página de inicio
│   ├── login.html             # Página de login/registro
│   ├── productos.html         # Catálogo de productos
│   ├── vistaProducto.html     # Detalles de producto
│   ├── carrito.html           # Carrito de compras
│   ├── js/                    # Archivos JavaScript
│   │   ├── main.js            # Funcionalidad global
│   │   ├── login.js           # Autenticación
│   │   ├── productos.js       # Gestión de productos
│   │   ├── detalle.js         # Detalles de producto
│   │   └── carrito.js         # Gestión del carrito
│   ├── img/                   # Imágenes del sitio
│   ├── dist/css/              # CSS compilado
│   ├── data/                  # Datos estáticos (legacy)
│   └── package.json
├── REPO_CONTEXT.md            # Documentación del repositorio
└── SETUP.md                   # Este archivo
```

---

## 🔧 Configuración de MongoDB Atlas

### Crear una Cuenta y Cluster
1. Regístrate en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster gratuito
3. Espera a que el cluster esté listo (puede tomar 5-10 minutos)

### Configurar Acceso
1. Ve a "Database Access" → "Add New Database User"
2. Crea un usuario con username y contraseña
3. Selecciona "Read and write to any database"

### Configurar Conexión de Red
1. Ve a "Network Access" → "Add IP Address"
2. Para desarrollo local, selecciona "Allow Access from Anywhere" (0.0.0.0/0)
3. Para producción, agrega solo las IPs necesarias

### Obtener la Connection String
1. Ve a "Clusters" → "Connect"
2. Selecciona "Connect your application"
3. Copia la connection string
4. Reemplaza `<password>` con la contraseña del usuario
5. Agrega `&authSource=admin` al final de la connection string

### Ejemplo de Connection String
```
mongodb://usuario:password@cluster0-shard-00-00.xxxxx.mongodb.net:27017,cluster0-shard-00-01.xxxxx.mongodb.net:27017,cluster0-shard-00-02.xxxxx.mongodb.net:27017/?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&appName=Cluster0
```

---

## 🎯 Flujo de Trabajo para Desarrolladores

### Backend (Node.js + Express)

#### Estructura de un Endpoint
```javascript
// routes/nuevaRuta.route.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/ruta-protegida', auth, (req, res) => {
    res.json({ message: 'Acceso concedido', usuario: req.usuario });
});

module.exports = router;
```

#### Agregar Nueva Ruta
1. Crea el archivo en `Backend/routes/`
2. Importa en `Backend/server.js`
3. Agrega el middleware de autenticación si es necesario

### Frontend (JavaScript + Bootstrap)

#### Estructura de una Página
```html
<!DOCTYPE html>
<html>
<head>
    <title>PetZone</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <!-- CSS Personalizado -->
    <link rel="stylesheet" href="dist/css/main.css">
</head>
<body>
    <!-- Contenido -->
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="js/main.js"></script>
    <script src="js/tu-archivo.js"></script>
</body>
</html>
```

#### Llamadas a la API
```javascript
// Ejemplo en tu archivo JS
async function obtenerDatos() {
    try {
        const response = await fetchWithToken(`${API_URL}/ruta`);
        const result = await handleResponse(response);
        // Procesar result
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

## 🧪 Pruebas y Verificación

### Verificar Backend
1. Asegúrate de que el servidor esté corriendo: `node server.js`
2. Abre `http://localhost:3000/api/productos` en el navegador
3. Deberías ver un JSON con los productos

### Verificar Frontend
1. Abre `index.html` en tu navegador
2. Intenta registrarte e iniciar sesión
3. Navega a productos y verifica que carguen
4. Agrega productos al carrito
5. Verifica el carrito

### Verificar Conexión a MongoDB
- Si el servidor muestra "Conexión con la base de datos exitosa", la conexión funciona
- Si hay error, verifica las credenciales en `.env`

---

## 🔐 Seguridad

### Variables de Entorno
- **Nunca** subas el archivo `.env` a un repositorio público
- Usa siempre `.env.example` como plantilla
- Cambia el `JWT_SECRET` en producción

### Autenticación
- Las rutas protegidas usan el middleware `auth`
- Los tokens JWT tienen una duración limitada
- Los usuarios tienen roles: `cliente` y `admin`

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module 'dotenv'"
```bash
cd Backend
npm install
```

### Error: "MongoServerError: bad auth : Authentication failed"
- Verifica las credenciales en `.env`
- Asegúrate de que `authSource=admin` esté en la connection string
- Verifica que el usuario tenga permisos en MongoDB Atlas

### Error: "ECONNREFUSED" al conectar a MongoDB
- Verifica que MongoDB Atlas esté permitiendo tu IP
- Revisa la connection string
- Asegúrate de que el cluster esté activo en Atlas

### El frontend no carga productos
- Asegúrate de que el backend esté corriendo
- Verifica que `API_URL` en los archivos JS sea correcta
- Abre la consola del navegador para ver errores

### El contador del carrito no se actualiza
- Asegúrate de estar autenticado
- Verifica que `main.js` esté cargado en la página
- Revisa la consola para errores

---

## 📚 Documentación Adicional

- **Backend README:** `Backend/README.md` - Documentación detallada del backend
- **Frontend README:** `Frontend/README.md` - Documentación detallada del frontend
- **REPO_CONTEXT.md:** Documentación completa del repositorio y cambios recientes

---

## 🤝 Contribuir al Proyecto

### Flujo de Trabajo Sugerido
1. Crea una rama para tu feature: `git checkout -b feature/tu-feature`
2. Haz tus cambios
3. Prueba thoroughly
4. Commitea tus cambios: `git commit -m "Descripción del cambio"`
5. Push a la rama: `git push origin feature/tu-feature`
6. Crea un Pull Request

### Estándares de Código
- Usa JavaScript ES6+ para el frontend
- Usa async/await para operaciones asíncronas
- Agrega comentarios para código complejo
- Usa nombres de variables descriptivos

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas:
1. Revisa la sección de Solución de Problemas
2. Consulta los archivos README en Backend y Frontend
3. Revisa REPO_CONTEXT.md para información del proyecto

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado (versión 14+)
- [ ] MongoDB instalado o cuenta Atlas configurada
- [ ] Proyecto clonado o descargado
- [ ] Dependencias del backend instaladas (`cd Backend && npm install`)
- [ ] Archivo `.env` configurado con credenciales MongoDB
- [ ] Base de datos poblada con productos (`node seed.js`)
- [ ] Servidor backend corriendo (`node server.js`)
- [ ] Dependencias del frontend instaladas (`cd Frontend && npm install`)
- [ ] Frontend accesible en el navegador
- [ ] Registro de usuario funcional
- [ ] Login funcional
- [ ] Productos cargando correctamente
- [ ] Carrito funcional

¡Felicidades! 🎉 Tu proyecto PetZone está listo para usar.
