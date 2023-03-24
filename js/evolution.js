/**
 * If the evolution object has the species property, further evolution information is stored in variables that are pushed into the array evolutionArray.
 * @param {object} evolutionChain contains information about the current Pokemon's evolutionary chain.
 */

async function getAndRenderEvolutionChainData(evolutionChain) {
  if (evolutionChain.species) {
    let urlLength = evolutionChain.species.url.length;
    numberInAPI = Number(evolutionChain.species.url.slice(42, urlLength - 1));
    evolutionName = returnNameFormatted(evolutionChain.species.name);
    evolutionImage = await returnPokemonImage(numberInAPI);
  }
  let evolutionDetails = await renderEvolutionChainData(evolutionChain);
  evolutionArray.push({ chainNumber: numberInAPI, pokemonName: evolutionName, pokemonImage: evolutionImage, pokemonDetails: evolutionDetails });
  await renderEvolvesToData(evolutionChain);
}

/**
 * If there are more Pokemons in the evolution chain of the original Pokemon, more evolution data will be loaded from there as well.
 * @param {object} evolutionChain contains information about the current Pokemon's evolutionary chain.
 */

async function renderEvolvesToData(evolutionChain) {
  if (evolutionChain.evolves_to.length > 0) {
    for (let i = 0; i < evolutionChain.evolves_to.length; i++) {
      await getAndRenderEvolutionChainData(evolutionChain.evolves_to[i]);
    }
  }
}

/**
 * @param {string} unformattedName of the pokemon.
 * @returns the Pokemon name with capital letter in the first place
 */

function returnNameFormatted(unformattedName) {
  let formattedName = unformattedName.charAt(0).toUpperCase() + unformattedName.slice(1);
  return formattedName;
}

/**
 * The URL is built with the numberInAPI variable and called with the fetch method and then converted to JSON format. Then an image is picked out from the JSON object.
 * @param {number} numberInAPI is the place where the Pokemon is in the API.
 * @returns the image of the evolution pokemon.
 */

async function returnPokemonImage(numberInAPI) {
  let url = `https://pokeapi.co/api/v2/pokemon/${numberInAPI}/`;
  let evolutionResponse = await fetch(url);
  let evolutionPokemon = await evolutionResponse.json();
  if (evolutionPokemon["sprites"]["other"]["official-artwork"]["front_default"]) {
    return `${evolutionPokemon["sprites"]["other"]["official-artwork"]["front_default"]}`;
  } else if (evolutionPokemon["sprites"]["other"]["home"]["front_default"]) {
    return `${evolutionPokemon["sprites"]["other"]["home"]["front_default"]}`;
  } else {
    return `../img/pokeball.png`;
  }
}

/**
 * If the current Pokemon has evolution chain details, the information is stored in variables and then stored in the evolutionDetails object.
 * @param {object} evolutionChain contains information about the current Pokemon's evolutionary chain.
 * @returns the object with the evolution details of the current pokemon.
 */

async function renderEvolutionChainData(evolutionChain) {
  if (evolutionChain.evolution_details && evolutionChain.evolution_details.length > 0) {
    for (let i = 0; i < evolutionChain.evolution_details.length; i++) {
      let trigger = evolutionChain.evolution_details[i].trigger.name;
      let minLevel = evolutionChain.evolution_details[i].min_level;
      let item = "null";
      if (evolutionChain.evolution_details[i].item != null) {
        item = evolutionChain.evolution_details[i].item.name;
      }
      let evolutionDetails = objectForEvolutionDetails(minLevel, trigger, item);
      return evolutionDetails;
    }
  }
}

/**
 * @param {number} minLevel is the number where the original pokeons gets leveled up to the next pokmeon in the evolution chain.
 * @param {string} trigger is e.g. Level-up or Use-item.
 * @param {string} item is e.g. Thunder Stone.
 * @returns the object with the evolution details of the current pokemon.
 */

function objectForEvolutionDetails(minLevel, trigger, item) {
  let evolutionDetails = {
    level: minLevel,
    trigger: returnNameFormatted(trigger),
    item: returnNameFormatted(item),
  };
  return evolutionDetails;
}

/**
 * The pokemon evolution gets rendered and displayed in the evolutionSection.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function showPokemonEvolution(pokemonIndex, loadedOrFound) {
  showEvolutionTemplateAndClearEvolutionSection();
  let evolutionSection = document.getElementById("evolution-section");
  specificPokemonData = checkIfTheyAreLoadedOrFoundPokemons(loadedOrFound);
  let currentEvolution = specificPokemonData[pokemonIndex].evolution;
  if (currentEvolution.length == 1) evolutionSection.innerHTML = pokemonNoEvolutionTemplate(currentEvolution);
  else {
    for (let i = 0; i < currentEvolution.length - 1; i++) {
      evolutionSection.innerHTML += pokemonEvolutionTemplate(i, currentEvolution);
    }
  }
}

/**
 * The template for the evolution is executed and the evolutionSection is emptied.
 */

function showEvolutionTemplateAndClearEvolutionSection() {
  let pageMask = document.getElementById("page-mask");
  pageMask.innerHTML = templateEvolution();
  let evolutionSection = document.getElementById("evolution-section");
  evolutionSection.innerHTML = "";
}

/**
 * @param {number} i is the number of the current pokemon iteration.
 * @param {array} currentEvolution is the evolution array of the current pokemon.
 * @returns the description for the current evolutionary step.
 */

function renderPokemonEvolutionDescription(i, currentEvolution) {
  let description = "";
  if (currentEvolution[i + 1].pokemonDetails.trigger == "Use-item")
    description = `${currentEvolution[i + 1].pokemonDetails.trigger} is<br>${currentEvolution[i + 1].pokemonDetails.item}`;
  else if (currentEvolution[i + 1].pokemonDetails.trigger == "Level-up") {
    if (!currentEvolution[i + 1].pokemonDetails.level) description = `${currentEvolution[i + 1].pokemonDetails.trigger} at <br>Level: No data.`;
    else description = `${currentEvolution[i + 1].pokemonDetails.trigger} at <br>Level: ${currentEvolution[i + 1].pokemonDetails.level}`;
  } else if (currentEvolution[i + 1].pokemonDetails.trigger) description = `${currentEvolution[i + 1].pokemonDetails.trigger}`;
  return description;
}
