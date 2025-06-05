


const cartProducts = JSON.parse(localStorage.getItem("cart")) || []

function createCartCard(product) {
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
    button.textContent = "Eliminar";
    button.addEventListener("click", () => {
        const index = cartProducts.findIndex(p => p.name === product.name);
        if (index !== -1) {
            cartProducts.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cartProducts));
        }
        renderCartProducts(cartProducts);
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(genre);
    card.appendChild(plataform);
    card.appendChild(price);
    card.appendChild(button);
    return card;
}



function renderCartProducts(products) {
    const cartGrid = document.querySelector(".cart-grid");
    products.forEach(product => {
    const card = createCartCard(product);
    cartGrid.appendChild(card);
    });
}


renderCartProducts(cartProducts);