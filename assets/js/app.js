const contenedor = document.getElementById("pokedex");
const agregarBtn = document.getElementById("agregarBtn");
const quitarBtn = document.getElementById("quitarBtn");
const buscarBtn = document.getElementById("buscarBtn");
const buscador = document.getElementById("buscador");
const filtroDePokemons = document.getElementById("filtro-de-pokemons");

let contadorPokemon = 1;

const tiposPokemon = [
  { normal: "Normal" },
  { fighting: "Lucha" },
  { flying: "Volador" },
  { poison: "Veneno" },
  { ground: "Tierra" },
  { rock: "Roca" },
  { bug: "Bicho" },
  { ghost: "Fantasma" },
  { steel: "Acero" },
  { fire: "Fuego" },
  { water: "Agua" },
  { grass: "Planta" },
  { electric: "Eléctrico" },
  { psychic: "Psíquico" },
  { ice: "Hielo" },
  { dragon: "Dragón" },
  { dark: "Siniestro" },
  { fairy: "Hada" },
  { stellar: "Estelar" },
  { unknown: "Desconocido" }
];

const colorTiposPokemon = {
  normal: "#A8A77A", // Normal
  fighting: "#C22E28", // Lucha
  flying: "#A98FF3", // Volador
  poison: "#A33EA1", // Veneno
  ground: "#E2BF65", // Tierra
  rock: "#B6A136", // Roca
  bug: "#A6B91A", // Bicho
  ghost: "#735797", // Fantasma
  steel: "#B7B7CE", // Acero
  fire: "#EE8130", // Fuego
  water: "#6390F0", // Agua
  grass: "#7AC74C", // Planta
  electric: "#F7D02C", // Eléctrico
  psychic: "#F95587", // Psíquico
  ice: "#96D9D6", // Hielo
  dragon: "#6F35FC", // Dragón
  dark: "#705746", // Siniestro
  fairy: "#D685AD", // Hada
  stellar: "#4D4DFF", // Estelar
  unknown: "#A0A0A0" // Desconocido
};

tiposPokemon.forEach((tipo) => {
  const option = document.createElement("option");

  option.value = Object.keys(tipo)[0];
  option.textContent = tipo[option.value];

  filtroDePokemons.appendChild(option);
});

async function obtenerPokemon(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    return {
      nombre: data.name,
      imagen: data.sprites.other["official-artwork"].front_default,
      tipo: data.types.map((t) => t.type.name).join(", "),
      tipos: data.types.map((t) => t.type.name),
      experiencia: data.base_experience,
      peso: data.weight,
      altura: data.height,
      habilidades: data.abilities.map((a) => a.ability.name).join(", ")
    };
  } catch (error) {
    alert("Pokémon no encontrado");

    return null;
  }
}

function crearCarta(pokemon) {
  const div = document.createElement("div");
  div.classList.add("col");

  const tipoPrincipal = pokemon.tipos[0];
  const tipoClase = tipoPrincipal ? colorTiposPokemon[tipoPrincipal] : "";

  div.innerHTML = `
            <div class="card h-100 shadow-sm" style="background-color: ${tipoClase}">
                <img src="${pokemon.imagen}" class="card-img-top bg-white" style="object-fit: contain; height: 200px;" alt="${pokemon.nombre}">
                <div class="card-body">
                    <h5 class="card-title text-capitalize">${pokemon.nombre}</h5>
                    <p class="card-text tipo"><strong>Tipo:</strong> ${pokemon.tipo}</p>
                    <p class="card-text"><strong>Exp:</strong> ${pokemon.experiencia}</p>
                    <p class="card-text"><strong>Peso:</strong> ${pokemon.peso}</p>
                    <p class="card-text"><strong>Altura:</strong> ${pokemon.altura}</p>
                    <p class="card-text"><strong>Habilidades:</strong> ${pokemon.habilidades}</p>
                    <div class="center-content">
                      <button class="btn btn-light" onclick="agregarPokemonAFavoritos(${pokemon.id})">Agregar a favoritos</button>
                    </div>
                </div>
            </div>
            `;

  return div;
}

agregarBtn.addEventListener("click", async () => {
  const pokemon = await obtenerPokemon(contadorPokemon);

  if (pokemon) {
    const carta = crearCarta(pokemon);

    contenedor.appendChild(carta);

    const cartas = contenedor.querySelectorAll(".col");

    Array.from(cartas)
      .reverse()
      .forEach((carta, index) => {
        carta.style.order = index;
      });

    contadorPokemon++;
  }
});

quitarBtn.addEventListener("click", () => {
  const cartas = contenedor.querySelectorAll(".col");

  if (cartas.length > 0) {
    cartas[cartas.length - 1].remove();
    contadorPokemon--;
  }
});

buscarBtn.addEventListener("click", async () => {
  const valor = buscador.value.toLowerCase().trim();
  if (!valor) return;

  const pokemon = await obtenerPokemon(valor);

  if (pokemon) {
    const carta = crearCarta(pokemon);
    contenedor.appendChild(carta);
  }
});

filtroDePokemons.addEventListener("change", (event) => {
  const tipoDePokemon = event.target.value;

  const cartas = contenedor.querySelectorAll(".col");

  cartas.forEach((carta) => {
    const tipo = carta.querySelector(".card-text").textContent.toLowerCase();

    if (tipo.includes(tipoDePokemon) || !tipoDePokemon) {
      carta.style.display = "block";
    } else {
      carta.style.display = "none";
    }
  });
});