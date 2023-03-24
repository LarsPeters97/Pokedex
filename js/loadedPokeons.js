/**
 * Pokemon data is loaded and retrieved from an API and as long as this process lasts a loader is displayed.
 */

async function loadingProcess() {
  if (isTheFunctionExecuted) return;
  isTheFunctionExecuted = true;
  showLoadingAnimation();
  await loadNextPokemons();
  await delayCloseLoadingAnimation();
  closeLoadingAnimation();
  isTheFunctionExecuted = false;
}

/**
 * 20 Pokemons are loaded from the API and when the data has been pushed into the arrays, the retrieved Pokemons are rendered.
 */

async function loadNextPokemons() {
  if (numberOfAllPokemons != loadedPokemons.length) {
    let response = await fetch(nextPokemonList);
    let responseAsJSON = await response.json();
    nextPokemonList = responseAsJSON.next;
    for (let index = 0; index < responseAsJSON.results.length; index++) {
      await superordinateJsonPush(responseAsJSON, index);
      await loadDataForSpecies(index);
    }
    renderAllPokemons();
  }
}

/**
 * Specific data of each Pokemon is loaded and pushed into the array loadedpokemons. NumberOfAllPokemons gets the number of all current Pokemons that are on the API.
 * @param {object} responseAsJSON contains data from the API response.
 * @param {number} index is the current iteration number fron the array responseAsJSON.results.
 */

async function superordinateJsonPush(responseAsJSON, index) {
  let pokemonResponse = await fetch(responseAsJSON.results[index].url);
  let pokemonAsJson = await pokemonResponse.json();
  numberOfAllPokemons = responseAsJSON.count;
  loadedPokemons.push(pokemonAsJson);
}

/**
 * Renders the small pokemon cards from the array loadedPokemons. The global scope currentPokemon is increased by one.
 */

async function renderAllPokemons() {
  let smallPokemonContainersArea = document.getElementById("small-pokemon-containers");
  for (let i = currentPokemon; i < loadedPokemons.length; i++) {
    smallPokemonContainersArea.innerHTML += templateRenderSmallPokemonCards(i, "loaded");
    renderPokemonName(i, loadedPokemons);
    renderPokemonTypes(i, loadedPokemons);
    renderPokemonOverviewColors(i, loadedPokemons);
    renderPokemonImage(i, loadedPokemons);
    currentPokemon = i + 1;
  }
}

/**
 * The URl for the species is extracted from the array loaded Pokemons of the current Pokemons are loaded further data. Also, the evolution is retrieved from the API.
 * The same is done with the URL of the current Pokemon's evolution.
 * @param {number} pokemonIndex is the current iteration number fron the array responseAsJSON.results.
 */

async function loadDataForSpecies(pokemonIndex) {
  let speciesURL = await loadedPokemons[pokemonIndex + currentPokemon].species.url;
  let speciesResponse = await fetch(speciesURL);
  let speciesAsJson = await speciesResponse.json();
  if (speciesAsJson.evolution_chain !== null) {
    let evolutionURL = speciesAsJson.evolution_chain.url;
    let evolutionResponse = await fetch(evolutionURL);
    let evolutionAsJson = await evolutionResponse.json();
    await getAndRenderEvolutionChainData(evolutionAsJson.chain);
    await jsonsForVariables(speciesAsJson);
  }
}

/**
 * Variables are assigned specific pokemon data and are pushed in the array loadedDataForSections.
 * @param {Object} speciesAsJson contains specific data from the current pokemon.
 */

async function jsonsForVariables(speciesAsJson) {
  let genus = checkIfGenuIsExisting(speciesAsJson);
  let descriptionTextForPokemon = checkIfDescriptionIsExisting(speciesAsJson);
  loadedDataForSections.push({ genu: genus, description: descriptionTextForPokemon, evolution: evolutionArray });
  evolutionArray = [];
}

/**
 * Since the Pokemon images are not fully loaded the more Pokemons are loaded from the API, the loading animation is extended a bit to give the image loading more time.
 */

async function delayCloseLoadingAnimation() {
  if (loadedPokemons.length > 20) {
    await delay(200);
  }
  if (loadedPokemons.length > 100) {
    await delay(400);
  }
  if (loadedPokemons.length > 240) {
    await delay(600);
  }
  if (loadedPokemons.length > 400) {
    await delay(800);
  }
}
