const API_TOKEN = "patcnCBCBehNpQSAo.8b53fa7188370e696dd13cbd403b9a1ebaf705c18b46ec649842183d0db3bbab";
const BASE_ID = "appGxsnWFHUh3NckC";
const TABLE_NAME = "Videogames";
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
const HEADERS = {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json"
};

const form = document.getElementById("crud-form");
const lista = document.getElementById("videogames-list");
const btnCancelar = document.getElementById("btnCancelar");
const idInput = document.getElementById("id-game");
const btnAgregar = document.getElementById("btnAgregar");

async function obtenerVideojuegos() {
    const res = await fetch(BASE_URL, { headers: HEADERS });
    const data = await res.json();
    lista.innerHTML = "";

    data.records.forEach(record => {
        const juego = record.fields;

        const item = document.createElement("li");
        item.innerHTML = `
            <img src="${juego.image || "#"}" alt="${juego.name}" class="imagen-juego">
            <h3>${juego.name}</h3>
            <p>${juego.description}</p>
            <p><strong>Plataforma:</strong> ${juego.plataform}</p>
            <p><strong>Género:</strong> ${juego.genre}</p>
            <p><strong>Precio:</strong> $${(juego.price || 0).toFixed(2)}</p>
            <button class=btnEdit onclick="editarJuego('${record.id}')">Editar</button>
            <button class=btnDelete onclick="eliminarJuego('${record.id}')">Eliminar</button>
        `;
        lista.appendChild(item);
    });
}

// Manejo del formulario 
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const juego = {
        image: form.imagen.value,
        name: form.nombre.value,
        description: form.descripcion.value,
        plataform: form.plataforma.value,
        genre: form.genero.value,
        price: parseFloat(form.precio.value)
    };

    const id = idInput.value;

    if (id) {
        await fetch(`${BASE_URL}/${id}`, {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify({ fields: juego })
        });
    } else {
        await fetch(BASE_URL, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({ fields: juego })
        });
    }

    form.reset();
    idInput.value = "";
    btnCancelar.style.display = "none";
    obtenerVideojuegos();
});

async function editarJuego(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { headers: HEADERS });
    const data = await res.json();
    const juego = data.fields;

    form.imagen.value = juego.image || "";
    form.nombre.value = juego.name;
    form.descripcion.value = juego.description;
    form.plataforma.value = juego.plataform;
    form.genero.value = juego.genre;
    form.precio.value = juego.price;
    idInput.value = id;
    btnCancelar.style.display = "inline";
    btnAgregar.textContent = "Actualizar Juego";
    
}

//funcion que haga que el boton cancelar limpie los campos del formulario
btnCancelar.addEventListener("click", () => {
    form.reset();
    idInput.value = "";
    btnCancelar.style.display = "none";
    btnAgregar.textContent = "Agregar Videojuego";
});

async function eliminarJuego(id) {
    if (confirm("¿Seguro que querés eliminar este videojuego?")) {
        await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: HEADERS
        });
        obtenerVideojuegos();
    }
}

obtenerVideojuegos();








        