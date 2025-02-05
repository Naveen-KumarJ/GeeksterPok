let mainContainer = document.querySelector(".main-container");
// console.log(mainContainer);

async function updateUI(data, optionalType, nameInput) {
  let htmlContent = "";
  for (const eachPokemonObj of data) {
    try {
      const response = await fetch(eachPokemonObj.url);
      if (!response.ok) throw new Error("Failed to fetch Pokémon details");
      const eachPokemonDetails = await response.json();
      const types = eachPokemonDetails.types.map(
        (element) => element.type.name
      );
      const abilitiesList = eachPokemonDetails.abilities.map(
        (element) => element.ability.name
      );

      if (
        nameInput &&
        !eachPokemonDetails.name
          .toLowerCase()
          .startsWith(nameInput.toLowerCase())
      ) {
        continue;
      }
      if (optionalType && !types.includes(optionalType.toLowerCase())) {
        continue;
      }

      htmlContent += `
          <div class="card-wrapper w-50 h-70 rounded-lg cursor-pointer relative perspective transform-3d">
            <div class="card-front-side absolute w-full h-full rounded-lg shadow-[4.0px_6.0px_6.0px_rgba(0,0,0,0.38)] p-2 bg-indigo-400 flex flex-col justify-around items-center rotate-y-0 backface-hidden transition-all duration-700 ease-in-out">
              <div class="rank bg-slate-50 w-full text-center font-semibold">${
                eachPokemonDetails.id
              }</div>
              <div class="details text-center w-full">
                <img src="${eachPokemonDetails.sprites.front_default}" alt="${
        eachPokemonDetails.name
      }" class="w-[84px] mx-auto object-cover">
                <h2 class="font-bold text-2xl">${eachPokemonDetails.name.toUpperCase()}</h2>
              </div>
              <div class="type bg-slate-50 w-full text-center font-semibold">${types
                .toString()
                .toUpperCase()}</div>
            </div>
            <div class="card-back-side absolute w-full h-full rounded-lg shadow-[4.0px_6.0px_6.0px_rgba(0,0,0,0.38)] p-2 bg-slate-600 flex flex-col justify-around items-center rotate-y-180 backface-hidden transition-all duration-700 ease-in-out">
              <div class="rank bg-slate-50 w-full text-center font-semibold">${
                eachPokemonDetails.id
              }</div>
              <div class="details text-center w-full">
                <img src="${eachPokemonDetails.sprites.back_default}" alt="${
        eachPokemonDetails.name
      }" class="w-[84px] mx-auto">
                <h2 class="font-bold text-2xl text-white">${
                  eachPokemonDetails.name
                }</h2>
              </div>
              <div class="type bg-slate-50 w-full text-center font-semibold text-xs">
                <p>Abilities: ${abilitiesList.toString()}</p>
              </div>
            </div>
          </div>`;
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  }
  mainContainer.innerHTML = htmlContent;
}
async function fetchPokemonList(optionalType, nameInput) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
  const data = await response.json();
  // console.log(data);
  updateUI(data.results, optionalType, nameInput);
}
fetchPokemonList();

let typeListInput = document.getElementById("type-list");
let filterByTypeBtn = document.getElementById("filter-by-type");
filterByTypeBtn.addEventListener("click", () => {
  console.log(typeListInput.value);
  fetchPokemonList(typeListInput.value, null);
});

let resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
  window.location.reload();
});

let nameInput = document.getElementById("name-input");
nameInput.addEventListener("keyup", () => {
  fetchPokemonList(null, nameInput.value);
});
