
//token de acceso: patcnCBCBehNpQSAo.8b53fa7188370e696dd13cbd403b9a1ebaf705c18b46ec649842183d0db3bbab

const API_TOKEN = "patcnCBCBehNpQSAo.8b53fa7188370e696dd13cbd403b9a1ebaf705c18b46ec649842183d0db3bbab";
const BASE_ID = "appGxsnWFHUh3NckC";
const TABLE_NAME = "Videogames";
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;



const products = [];
const cartProducts = JSON.parse(localStorage.getItem("cart")) || []


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

    const productsMapped = data.records.map(record => {
        return {
            id: record.id,
            image: record.fields.image || "./img/default.png",
            name: record.fields.name || "Nombre no disponible",
            plataform: record.fields.plataform || "Plataforma no disponible",
            genre: record.fields.genre || "Género no disponible",
            price: record.fields.price || 0,
            deliveryFree: record.fields.deliveryFree || false
        };
    });
    console.log('productsMapped', productsMapped);


    renderProducts(productsMapped);
}
getProducts();

const grid = document.querySelector(".grid");
const searchInput = document.querySelector("#buscador");
const deliveryFreeCheckBox = document.querySelector("#envio");



function createCard(product) {
    const card = document.createElement("article");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.title;

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
        // Verificar si el producto ya está en el carrito
        const existingProduct = cartProducts.find(p => p.name === product.name);
        if (!existingProduct) {
            // Agregar el producto al carrito
            cartProducts.push(product);
            localStorage.setItem("cart", JSON.stringify(cartProducts));
            alert("Producto agregado al carrito");
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

function renderProducts(products) {
    products.forEach(product => {
    const card = createCard(product);
    grid.appendChild(card);
    });
}



function filterProducts(text){
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(text.toLowerCase())
         && (product.deliveryFree === deliveryFreeCheckBox.checked || !deliveryFreeCheckBox.checked);
    });
    grid.innerHTML = "";
    renderProducts(filteredProducts);
}
renderProducts(products);


searchInput.addEventListener("input", (e) => {
    filterProducts(e.target.value);
});

deliveryFreeCheckBox.addEventListener("change", (e) => {
    filterProducts(searchInput.value);
});

const addButton = document.querySelector("#btnAddProducts");
addButton.addEventListener("click", addProduct);

function addProduct() {
    const newProduct = {
        image: "./img/default.png",
        name: "Nuevo Producto",
        plataform: "PS4",
        genre: "Cualquiera",
        price: 20000 
    };

    addProductToAirtable(newProduct);

    const card = createCard(newProduct);
    grid.appendChild(card);
}

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
}