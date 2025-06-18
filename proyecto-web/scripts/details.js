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
        description: data.fields.description || "Descripción no disponible",
        genre: data.fields.genre || "Género no disponible",
        price: data.fields.price || 0,
        deliveryFree: data.fields.deliveryFree === true,
        ofertas: data.fields.ofertas === true,
    };

}

function renderProductDetails(product) {
    const mainImage = document.querySelector(".main-image");
    if(mainImage){
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }

    const productTitle= document.querySelector(".product-header h1");
    if(productTitle){
        productTitle.textContent = product.name;
    }

    const currentPrice = document.querySelector(".current-price");
    if (currentPrice) {
        if (product.ofertas) {
            const originalPrice = Math.round(product.price * 1.3);
            document.querySelector('.original-price').textContent = `$${originalPrice}`;
            document.querySelector('.original-price').style.display = 'block';
            currentPrice.innerHTML = `$${product.price} <span class="discount-badge">23% OFF</span>`;
        } else {
            const firstPrice = document.querySelector('.original-price');
            if (firstPrice) firstPrice.style.display = 'none';
            currentPrice.textContent = `$${product.price}`;
        }
    }

    const description = document.querySelector(".description-content");
    if (description) {
        description.textContent = product.description || "Descripción no disponible";
    }
}

function setAccionButtons(product) {
    const cartButton = document.querySelector(".btn btn-secondary");
    if (cartButton) {
        cartButton.addEventListener("click", () => {
            // Aquí puedes implementar la lógica para agregar al carrito
            addToCart(product);
        });
    }

    const buyButton = document.querySelector(".btn btn-primary");
    if (buyButton) {
        buyButton.addEventListener("click", () => {
            // Aquí puedes implementar la lógica para comprar ahora
            alert(`Comprando ahora: ${product.name}`);
        });
    }

    if(cartButton){
        cartButton.addEventListener("click", () => {
            addToCart(product);
        });
    }
}
function addToCart(product) {
    const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cartProducts.find(p => p.id === product.id);
    
    if (!existingProduct) {
        cartProducts.push(product);
        localStorage.setItem("cart", JSON.stringify(cartProducts));
        const cartButton = document.querySelector('.btn-secondary');
        cartButton.textContent = '✓ Agregado al carrito';
        cartButton.style.backgroundColor = '#00a650';
        console.log("Producto agregado al carrito");
    } else {
        console.log("El producto ya está en el carrito");
    }
}

async function init() {
    const productId = getProductIdFromUrl();
    if (!productId) {
        console.error("ID del producto no encontrado en la URL");
        return;
    }
    const product = await getProductById(productId);
    renderProductDetails(product);
}

init();