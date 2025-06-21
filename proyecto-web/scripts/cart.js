const API_TOKEN = "patcnCBCBehNpQSAo.8b53fa7188370e696dd13cbd403b9a1ebaf705c18b46ec649842183d0db3bbab";
const BASE_ID = "appGxsnWFHUh3NckC";
const TABLE_NAME = "Videogames";
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;




const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];

function saveCartProducts(products) {
    localStorage.setItem("cart", JSON.stringify(products));
}

function createBadge(text, className) {
    const badge = document.createElement('span');
    badge.className = `badge ${className}`;
    badge.textContent = text;
    return badge;
}

function createCartItem(product, index) {
    const quantity = product.quantity || 1;
    const itemTotal = product.price * quantity;
    
    // Crear elemento principal del item
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.index = index;

    // Crear imagen del producto
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.className = 'item-image';
    img.onerror = function() {
        this.src = 'https://via.placeholder.com/80x80?text=IMG';
    };

    // Crear contenedor de detalles
    const itemDetails = document.createElement('div');
    itemDetails.className = 'item-details';

    // Nombre del producto
    const itemName = document.createElement('div');
    itemName.className = 'item-name';
    itemName.textContent = product.name;

    // Plataforma
    const itemPlatform = document.createElement('div');
    itemPlatform.className = 'item-platform';
    itemPlatform.textContent = product.plataform;

    // Género y badges
    const itemGenre = document.createElement('div');
    itemGenre.className = 'item-genre';
    itemGenre.textContent = product.genre;

    // Agregar badges si corresponde
    if (product.deliveryFree) {
        itemGenre.appendChild(createBadge('Envío gratis', 'delivery-badge'));
    }
    if (product.ofertas) {
        itemGenre.appendChild(createBadge('OFERTA', 'offer-badge'));
    }

    // Agregar elementos a itemDetails
    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemPlatform);
    itemDetails.appendChild(itemGenre);

    // Precio del item
    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';
    itemPrice.textContent = `$${itemTotal}`;

    // Crear contenedor de acciones
    const itemActions = document.createElement('div');
    itemActions.className = 'item-actions';

    // Controles de cantidad
    const quantityControls = document.createElement('div');
    quantityControls.className = 'quantity-controls';

    // Botón decrementar
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn';
    decreaseBtn.textContent = '-';
    decreaseBtn.disabled = quantity <= 1;
    decreaseBtn.addEventListener('click', () => changeQuantity(index, -1));

    // Display de cantidad
    const quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'quantity-display';
    quantityDisplay.textContent = quantity;

    // Botón incrementar
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn';
    increaseBtn.textContent = '+';
    increaseBtn.addEventListener('click', () => changeQuantity(index, 1));

    // Agregar controles de cantidad
    quantityControls.appendChild(decreaseBtn);
    quantityControls.appendChild(quantityDisplay);
    quantityControls.appendChild(increaseBtn);

    // Botón eliminar
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', () => removeFromCart(index));

    // Agregar elementos a itemActions
    itemActions.appendChild(quantityControls);
    itemActions.appendChild(removeBtn);

    // Agregar todos los elementos al cartItem
    cartItem.appendChild(img);
    cartItem.appendChild(itemDetails);
    cartItem.appendChild(itemPrice);
    cartItem.appendChild(itemActions);

    return cartItem;
}

function createEmptyCart() {
    const emptyCart = document.createElement('div');
    emptyCart.className = 'empty-cart';
    
    const emptyIcon = document.createElement('div');
    emptyIcon.className = 'empty-cart-icon';
    emptyIcon.textContent = '🛒';
    
    const emptyTitle = document.createElement('h2');
    emptyTitle.textContent = 'Tu carrito está vacío';
    
    const emptyText = document.createElement('p');
    emptyText.textContent = '¡Descubre miles de productos y comienza a comprar!';
    
    const goShoppingBtn = document.createElement('button');
    goShoppingBtn.className = 'checkout-btn';
    goShoppingBtn.textContent = 'Ir a comprar';
    goShoppingBtn.addEventListener('click', () => window.history.back());
    
    emptyCart.appendChild(emptyIcon);
    emptyCart.appendChild(emptyTitle);
    emptyCart.appendChild(emptyText);
    emptyCart.appendChild(goShoppingBtn);
    
    return emptyCart;
}

function renderCartItems() {
    const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById('cart-items-container');
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    if (cartProducts.length === 0) {
        container.appendChild(createEmptyCart());
        return;
    }

    // Crear cada producto usando DOM
    cartProducts.forEach((product, index) => {
        const cartItem = createCartItem(product, index);
        container.appendChild(cartItem);
    });
}

function changeQuantity(index, delta) {
    const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    const product = cartProducts[index];

    if (!product) return;
    
    const newQuantity = (product.quantity || 1) + delta;
    
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    product.quantity = newQuantity;
    saveCartProducts(cartProducts);
    renderCartItems();
    updateTotalPrice();
}
function removeFromCart(index) {
    const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    cartProducts.splice(index, 1);
    saveCartProducts(cartProducts);
    renderCartItems();
    updateTotalPrice();
}

function calculateTotalPrice() {
    const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;
    let totalItems = 0;
    let hasDeliveryFree = false;

    cartProducts.forEach(product => {
        const quantity = product.quantity || 1;
        subtotal += product.price * quantity;
        totalItems += quantity;
        if (product.deliveryFree) {
            hasDeliveryFree = true;
        }
    });

    const shippingCost = hasDeliveryFree || subtotal > 500 ? 0 : 50;
    const total = subtotal + shippingCost;

    return {
        subtotal,
        totalItems,
        shippingCost,
        total,
        hasDeliveryFree
    };
}

function processCheckout() {
    const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartProducts.length === 0) return;
    
    const totals = calculateTotalPrice();
    alert(`¡Gracias por tu compra!\nTotal: $${totals.total}\nProductos: ${totals.totalItems}`);
    
    // Limpiar carrito después de la compra
    localStorage.removeItem("cart");
    renderCartItems();
    updateTotalPrice();
}

function updateTotalPrice() {
    const totals = calculateTotalPrice();
    document.getElementById('total-items').textContent = totals.totalItems;
    document.getElementById('subtotal').textContent = `$${totals.subtotal}`;
    document.getElementById('shipping-cost').textContent = totals.shippingCost === 0 ? 'Gratis' : `$${totals.shippingCost}`;
    document.getElementById('total-price').textContent = `$${totals.total}`;

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = totals.totalItems === 0;

    if (totals.totalItems === 0) {
        checkoutBtn.textContent = 'Continuar compra';
    } else {
        checkoutBtn.textContent = `Continuar compra ($${totals.total})`;
    }
}
// Event listeners
document.getElementById('checkout-btn').addEventListener('click', processCheckout);
document.getElementById('continue-shopping').addEventListener('click', () => {
    window.history.back();
});

// Inicializar la página
function init() {
    renderCartItems();
    updateTotalPrice();
}

// Ejecutar cuando la página cargue
init();
