const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const apiURL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 1025; i++){
    fetch (apiURL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke){

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">${pokeId}</p>
                <h2 class="pokemom-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-estadisticas">
                <p class="estadistica">${poke.height} " </p>
                <p class="estadistica">${poke.weight} kgs</p>
            </div>
        </div>
`;
listaPokemon.append(div);

}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 1025; i++) {
        fetch(apiURL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))

async function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    if (searchInput === '') {
        alert('Por favor ingresa el nombre o ID del Pokémon.');
        return;
    }

    let apiUrl;
    if (!isNaN(searchInput)) { // Si es un número, asumimos que es un ID
        apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchInput}`;
    } else { // Si no es un número, asumimos que es un nombre
        apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase()}`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`No se encontró el Pokémon: ${searchInput}`);
        }
        const data = await response.json();
        showPokemonInfo(data);
    } catch (error) {
        console.error('Error al buscar el Pokémon:', error);
        alert('No se encontró el Pokémon. Por favor, intenta nuevamente.');
    }
}

function showPokemonInfo(pokemonData) {
    const pokemonInfoDiv = document.getElementById('pokemonInfo');
    pokemonInfoDiv.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <img width= 200px src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
        <p>Altura: ${pokemonData.height} " </p>
        <p>Peso: ${pokemonData.weight} kgs</p>
    `;
}