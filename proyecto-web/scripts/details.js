// Configuración de Airtable (usar las mismas credenciales)
const API_TOKEN = "patcnCBCBehNpQSAo.8b53fa7188370e696dd13cbd403b9a1ebaf705c18b46ec649842183d0db3bbab";
const BASE_ID = "appGxsnWFHUh3NckC";
const TABLE_NAME = "Videogames";
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Obtener el ID del producto desde la URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Función para obtener un producto específico por ID
async function getProductById(productId) {
    const response = await fetch(`${BASE_URL}/${productId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Producto no encontrado');
    }
    
    const data = await response.json();
    return {
        id: data.id,
        image: data.fields.image || "./img/default.png",
        name: data.fields.name || "Nombre no disponible",
        plataform: data.fields.plataform || "Plataforma no disponible",
        genre: data.fields.genre || "Género no disponible",
        price: data.fields.price || 0,
        deliveryFree: data.fields.deliveryFree === true,
        ofertas: data.fields.ofertas === true,
    };

}

const mainImage = document.querySelector(".main-image");