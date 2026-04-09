require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/producto');
const Categoria = require('./models/categoria');

// Datos de productos del frontend
const productosData = [
  {
    "id": 1,
    "name": "Cat and Kitten Chicken, Salmon and Liver",
    "marca": "NutriSource",
    "type": "Gato",
    "category": "Alimento",
    "peso": "2kg",
    "price_crc": 11702,
    "description": "Comida sana para gatos y gatitos.",
    "image": "nutrisourceCatandKittenChicken.png"
  }, 
  {
    "id": 2,
    "name": "Adulto Gato Pollo",
    "marca": "Balance",
    "type": "Gato",
    "category": "Alimento",
    "peso": "3.7kg",
    "price_crc": 6021,
    "description": "Balance - Adulto Gato Pollo",
    "image": "Balance-Adulto-10kg.png"
  },
  {
    "id": 3,
    "name": "Alimento Húmedo Atún",
    "marca": "Fancy Feast",
    "type": "Gato",
    "category": "Atún",
    "peso": "200gr",
    "price_crc": 1140,
    "description": "El amor se sirve todos los días. Eleva la experiencia gastronómica de tu gato con el nuevo Purina® Fancy Feast® Casserole Atún y Salmón",
    "image": "fancy-feast-casserole-con-atun-y-salmon_0.png"
  },
  {
    "id": 4,
    "name": "Indoor Arroz y Pollo",
    "marca": "Diamond",
    "type": "Gato",
    "category": "Alimento",
    "peso": "2kg",
    "price_crc": 15797,
    "description": "Comida sana para gatos y gatitos.",
    "image": "DNindoorcat_rev.png"
  },
  {
    "id": 5,
    "name": "Alimento de Pollo para gatos bebéa",
    "marca": "Hills",
    "type": "Gato",
    "category": "Alimento",
    "peso": "1.5kg",
    "price_crc": 15400,
    "description": "El alimento seco Hill's™ Science Diet™ Kitten está cuidadosamente formulado para las necesidades de desarrollo de los gatitos",
    "image": "sd-feline-kitten-dry-productShot_zoom.png"
  },
  {
    "id": 6,
    "name": "Collar de cono de gato",
    "marca": "Isabelino",
    "type": "Gato",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 13000,
    "description": "Collar de cono de gato, lindo collar de recuperación impermeable para gatos, antimordeduras, cicatrización de heridas, collar isabelino para gatos, diseño de flores moradas para todas las estaciones",
    "image": "cuelloGato.jpg"
  },
  {
    "id": 7,
    "name": "Golosinas para gatos",
    "marca": "Wildly Natural",
    "type": "Gato",
    "category": "Snacks",
    "peso": "2.5oz",
    "price_crc": 2500,
    "description": "Wildly Natural Golosinas para gatos, 2.5 onzas, sabor a salmón",
    "image": "treatsGatos.png"
  },
  {
    "id": 8,
    "name": "Biscuits de Gato Salmón",
    "marca": "Petgüel",
    "type": "Gato",
    "category": "Snacks",
    "peso": "180gr",
    "price_crc": 1500,
    "description": "Las Petgüel Biscuits de Gato Salmón son el snack perfecto para gatos de todas las edades. Ricas en proteína y con un delicioso sabor natural, son ideales para premiar y entrenar a tu mascota.",
    "image": "Petguel-Biscuits-de-Gato-Salmon.png"
  },
  {
    "id": 9,
    "name": "Juego de arnés y correa",
    "marca": "Halypet",
    "type": "Gato",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 12500,
    "description": "Halypet Juego de arnés y correa para gatos – MAX Safety 4ª generación mejorado, a prueba de escapes, ajustable, cómodo chaleco suave, fácil de llevar arnés para gatito con tira reflectante para gatos",
    "image": "gatoarnes.png"
  },
  {
    "id": 10,
    "name": "Collar de gato con AirTag reflectante",
    "marca": "Happy Paws",
    "type": "Gato",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 5000,
    "description": "Collar de gato con AirTag reflectante, collar integrado con rastreador de gato y soporte para AirTag con campanilla, collares GPS de gato con banda elástica de seguridad para gatos niñas y niños",
    "image": "collarGato.png"
  },
  {
    "id": 11,
    "name": "Rascador Baltimore",
    "marca": "MPets",
    "type": "Gato",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 13000,
    "description": "Rascador de cartón y fibras 100% recicladas y reciclables. Evita los rasguños en cortinas, muebles y alfombras.",
    "image": "rascadorFormaGato.png"
  },
  {
    "id": 12,
    "name": "Raton Caballero con Silvervine",
    "marca": "Mimo",
    "type": "Gato",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 4078,
    "description": "Los juguetes Mimo garantizan diversión mientras no estemos con ellas. Los juguetes Mimo animan a tu mascota a canalizar energía, entretenerse y divertirse.",
    "image": "PP236_02.png"
  },
  {
    "id": 13,
    "name": "Alimento de dieta Adult +7",
    "marca": "Hill's Science Diet",
    "type": "Perro",
    "category": "Alimento",
    "peso": "15kg",
    "price_crc": 70000,
    "description": "Hill's Science Diet Adult 7+",
    "image": "713uvvCtRXL._AC_UL640_QL65_.png"
  },
  {
    "id": 14,
    "name": "Alimento de dieta Diet Adulto 1-6",
    "marca": "Hill's Science Diet",
    "type": "Perro",
    "category": "Alimento",
    "peso": "15kg",
    "price_crc": 60000,
    "description": "Hill's Science Diet Adulto 1-6, Adulto 1-6 Premium Nutrition, Alimento seco para perros",
    "image": "hillsPerro2.png"
  },
  {
    "id": 15,
    "name": "Alimento Prescripción w/d Alimento Húmedo",
    "marca": "Hill's Prescription Diet",
    "type": "Perro",
    "category": "Alimento",
    "peso": "13 onzas",
    "price_crc": 5000,
    "description": "Hill's Prescription Diet w/d Alimento húmedo para perros digestivo/peso/glucosa/urinario multibeneficio con pollo",
    "image": "alimentohumedoPerro.png"
  },
  {
    "id": 16,
    "name": "Hill's Prescription Diet Golosinas",
    "marca": "Hill's Prescription Diet",
    "type": "Perro",
    "category": "Alimento",
    "peso": "13 onzas",
    "price_crc": 5000,
    "description": "Las golosinas metabólicas para perros de Prescription Diet son delicias sabrosas, saludables y gratificantes para perros adultos para apoyar la pérdida de peso saludable y el mantenimiento del peso.",
    "image": "treatsPerro.png"
  },
  {
    "id": 17,
    "name": "Juguete bola para perros",
    "marca": "HDSX",
    "type": "Perro",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 2000,
    "description": "Juguetes chirriantes para perros, pelotas chirriantes de goma de látex suave para cachorros",
    "image": "71U+xv6HHRL._AC_UL640_QL65_.png"
  },
  {
    "id": 18,
    "name": "Best Pet Supplies Juguete Interactivo",
    "marca": "Best Pet Supplies",
    "type": "Perro",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 8000,
    "description": "Best Pet Supplies Juguete Chirriante Interactivo para Masticar para Perros, Juguetes Ideales para Perros Masticadores, Perros Pequeños, Medianos y Grandes, y Amantes del Fetch - Pollo Crujiente",
    "image": "juguetePerro1.png"
  },
  {
    "id": 19,
    "name": "Dispensador de alimento para gatos",
    "marca": "PitPet",
    "type": "Gato",
    "category": "Accesorio",
    "peso": null,
    "price_crc": 70000,
    "description": "Alimentador automático inteligente para gatos, dispensador automático confiable de alimentos para gatos de 6 litros con pantalla LCD para una fácil instalación, (blanco)",
    "image": "dispensador.png"
  },
  {
    "id": 20,
    "name": "Alimento seco para gatos adultos 1-6",
    "marca": "Hill's Science Diet",
    "type": "Gato",
    "category": "Alimento",
    "peso": "4kg",
    "price_crc": 37000,
    "description": "Tu gato adulto necesita un alimento para mascotas que apoye un pelaje digestivo saludable, brillante, músculos magros y un sistema inmunológico saludable.",
    "image": "hillsGato.png"
  }
];

async function seedDatabase() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Limpiar datos existentes (opcional)
        // await Producto.deleteMany({});
        // await Categoria.deleteMany({});
        // console.log(' Datos existentes eliminados');

        // Obtener categorías únicas de los productos
        const categoriasUnicas = [...new Set(productosData.map(p => p.category))];
        console.log(` Categorías a crear: ${categoriasUnicas.join(', ')}`);

        // Crear categorías
        const categoriaMap = {};
        for (const nombre of categoriasUnicas) {
            let categoria = await Categoria.findOne({ nombre });
            if (!categoria) {
                categoria = await Categoria.create({
                    nombre,
                    descripcion: `Productos de categoría ${nombre}`
                });
                console.log(` Categoría creada: ${nombre}`);
            } else {
                console.log(`  Categoría ya existe: ${nombre}`);
            }
            categoriaMap[nombre] = categoria._id;
        }

        // Crear productos
        console.log(' Creando productos...');
        for (const prod of productosData) {
            const categoriaId = categoriaMap[prod.category];
            
            // Verificar si el producto ya existe
            const productoExistente = await Producto.findOne({ nombre: prod.name });
            if (productoExistente) {
                console.log(`  Producto ya existe: ${prod.name}`);
                continue;
            }

            await Producto.create({
                nombre: prod.name,
                categoria: categoriaId,
                precio: prod.price_crc,
                descripcion: prod.description,
                imagen: prod.image,
                stock: 50,
                activo: true
            });
            console.log(` Producto creado: ${prod.name}`);
        }

        console.log('\n Seed completado exitosamente');
        console.log(` Total productos creados: ${productosData.length}`);
        console.log(` Total categorías creadas: ${categoriasUnicas.length}`);

    } catch (error) {
        console.error(' Error en seed:', error);
    } finally {
        await mongoose.connection.close();
        console.log(' Conexión cerrada');
    }
}

seedDatabase();
