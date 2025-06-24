
//token de acceso: patcnCBCBehNpQSAo.8b53fa7188370e696dd13cbd403b9a1ebaf705c18b46ec649842183d0db3bbab

const API_TOKEN = "patcnCBCBehNpQSAo.8b53fa7188370e696dd13cbd403b9a1ebaf705c18b46ec649842183d0db3bbab";
const BASE_ID = "appGxsnWFHUh3NckC";
const TABLE_NAME = "Videogames";
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;



let allProducts = [];
const cartProducts = JSON.parse(localStorage.getItem("cart")) || []

// Filtros aplicados por defecto
let appliedFilters = {
    plataforma: "todos",
    genero: "todos",
    precioMin: null,
    precioMax: null,
    ofertas: false,
    envioGratis: false
};

const getProducts = async () => {
    const response = await fetch(`${BASE_URL}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        }
    }
    );
    const data = await response.json();
    console.log('data', data);

    allProducts = data.records.map(record => {
        return {
            id: record.id,
            image: record.fields.image || "./img/default.png",
            name: record.fields.name || "Nombre no disponible",
            plataform: record.fields.plataform || "Plataforma no disponible",
            genre: record.fields.genre || "Género no disponible",
            price: record.fields.price || 0,
            deliveryFree: record.fields.deliveryFree === true,
            ofertas: record.fields.ofertas === true
        };
    });
    console.log('products', allProducts);


    renderProducts(allProducts);
}
getProducts();

const grid = document.querySelector(".grid");
const searchInput = document.querySelector("#buscador");
const envioCheckbox = document.querySelector("#envio");
const plataformaSelect = document.querySelector("#plataforma");
const generoSelect = document.querySelector("#genero");
const precioMinInput = document.querySelector("#precio-min");
const precioMaxInput = document.querySelector("#precio-max");
const ofertasCheckbox = document.querySelector("#ofertas");
const aplicarFiltroBtn = document.querySelector("#aplicarFiltro");
const filtrosForm = document.querySelector("#filtros");



function createCard(product) {
    const card = document.createElement("article");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name || "Imagen no disponible";

    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
        goToDetails(product);
    });


    const name = document.createElement("h3");
    name.textContent = product.name;
    
    const genre = document.createElement("p");
    genre.textContent = product.genre;

    const plataform = document.createElement("p");
    plataform.textContent = product.plataform;

    const price = document.createElement("p");
    price.textContent = `$${product.price}`;

    const button = document.createElement("button");
    button.textContent = "Agregar al carrito";
    button.addEventListener("click", () => {
        const existingProduct = cartProducts.find(p => p.name === product.name);
        if (!existingProduct) {
            cartProducts.push(product);
            localStorage.setItem("cart", JSON.stringify(cartProducts));
            console.log("Producto agregado al carrito");
        }
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(genre);
    card.appendChild(plataform);
    card.appendChild(price);
    card.appendChild(button);
    return card;
}

function goToDetails(product){
    window.location.href = `details.html?id=${product.id}`;
}

function renderProducts(productsArray) {
    grid.innerHTML = ""; // Limpiar el grid antes de renderizar
    productsArray.forEach(product => {
    const card = createCard(product);
    grid.appendChild(card);
    });
}


// Filtrar productos por texto ingresado en el buscador
function filterProductsByText() {
const searchText = searchInput.value.toLowerCase();
    
    let filteredProducts = applyGeneralFilters(allProducts);
    
    if (searchText) {
        filteredProducts = filteredProducts.filter(product => {
            return product.name.toLowerCase().includes(searchText) ||
                   product.genre.toLowerCase().includes(searchText) ||
                   product.plataform.toLowerCase().includes(searchText);
        });
    }
    
    renderProducts(filteredProducts);
    console.log("Filtrado por texto:", searchText);
}

// Aplicar filtros generales (plataforma, género, precio, etc.)
function applyGeneralFilters(products) {
    return products.filter(product => {

        const matchesPlatform = appliedFilters.plataforma === "todos" || 
                                product.plataform.toLowerCase().includes(appliedFilters.plataforma.toLowerCase());

        const matchesGenre = appliedFilters.genero === "todos" || 
                                product.genre.toLowerCase().includes(appliedFilters.genero.toLowerCase());   

        const matchesPriceMin = !appliedFilters.precioMin || 
                               product.price >= appliedFilters.precioMin;

        const matchesPriceMax = !appliedFilters.precioMax || 
                               product.price <= appliedFilters.precioMax;
        
        const matchesDelivery = !appliedFilters.envioGratis || product.deliveryFree;

        const matchesOffers = !appliedFilters.ofertas || product.ofertas;

        
        
        return matchesPlatform && matchesGenre && matchesPriceMin && 
               matchesPriceMax && matchesDelivery && matchesOffers;
    });
}

// Aplicar todos los filtros y actualizar la vista
function applyAllFilters() {
    appliedFilters = {
        plataforma: plataformaSelect.value,
        genero: generoSelect.value,
        precioMin: precioMinInput.value ? parseInt(precioMinInput.value) : null,
        precioMax: precioMaxInput.value ? parseInt(precioMaxInput.value) : null,
        ofertas: ofertasCheckbox.checked,
        envioGratis: envioCheckbox.checked
    };
    
    console.log("Filtros aplicados:", appliedFilters);
    
    filterProductsByText();
}


searchInput.addEventListener("input", filterProductsByText);

filtrosForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyAllFilters();
});

aplicarFiltroBtn.addEventListener("click", (e) => {
    e.preventDefault();
    applyAllFilters();
});

// Función para limpiar los filtros y volver a mostrar todos los productos
function clearFilters() {
    filtrosForm.reset();
    
    appliedFilters = {
        plataforma: "todos",
        genero: "todos",
        precioMin: null,
        precioMax: null,
        ofertas: false,
        envioGratis: false
    };
    
    renderProducts(allProducts);
    console.log("Filtros limpiados");
}
// Limpiar filtros
const clearFiltersBtn = document.querySelector("#limpiarFiltros");
clearFiltersBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearFilters();
});

const addButton = document.querySelector("#btnAddProducts");
addButton.addEventListener("click", addProduct);


async function addProductToAirtable(product) {
    const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fields: product
        })
    });
    const data = await response.json();
    console.log('Producto agregado:', data);

    filterProducts();
}






