/**
 * When the Enter key is pressed, the search button is clicked, triggering the search function.
 * @param {string} inputFieldId is the dom id of the input search field.
 * @param {string} buttonId is the dom id of the search button.
 */

function inputEventListenerForSearch(inputFieldId, buttonId) {
  let inputSearch = document.getElementById(inputFieldId);
  inputSearch.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById(buttonId).click();
    }
  });
}

/**
 * The search value of the input field is assigned to the variable searchInput and it is checked if the input is at least three characters long.
 */

async function getSearchInput() {
  if (searchExecution) return;
  let searchInput = document.getElementById("search").value;
  searchInput = searchInput.toLowerCase();
  if (foundPokemons.length > 0 && searchInput.length === 0) showLoadedPokemonsAgain();
  else if (searchInput.length >= 3) {
    searchExecution = true;
    document.body.style.overflow = "visible";
    clearFoundPokemons();
    await searchedPokemons(searchInput);
    searchExecution = false;
  } else removeClassDnone("input-error");
}

/**
 * The API's response to the request is stored as JSON in the responseAsJSON variable and the search term is used to search for matching Pokemons in the JSON.
 * @param {string} searchInput is the value of the search field.
 */

async function searchedPokemons(searchInput) {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1279&offset=0");
  let responseAsJSON = await response.json();
  await filterSearchedPokemons(responseAsJSON, searchInput);
}

/**
 * The name of each pokemon from the API is converted to lowercase and compared to the lowercase search value, and those found are pushed to the foundPokemons array.
 * @param {object} responseAsJSON
 * @param {string} searchInput is the value of the search field.
 */

async function filterSearchedPokemons(responseAsJSON, searchInput) {
  for (let i = 0; i < responseAsJSON.results.length; i++) {
    let pokemon = responseAsJSON.results[i];
    pokemonName = pokemon.name.toLowerCase();
    if (pokemonName.includes(searchInput)) {
      let pokemonResponse = await fetch(pokemon.url);
      let pokemonAsJson = await pokemonResponse.json();
      foundPokemons.push(pokemonAsJson);
    }
  }
  await renderFoundPokemons();
}

/**
 * Renders the small pokemon cards from the array foundPokemons, when at least one Pokemon is found.
 */

async function renderFoundPokemons() {
  viewSettingsForFoundPokemonsAndReturnPokeomContainer();
  let smallPokemonContainersArea = document.getElementById("small-pokemon-containers");
  smallPokemonContainersArea.innerHTML = "";
  if (foundPokemons.length == 0) noPokemonsFound();
  else {
    for (let i = 0; i < foundPokemons.length; i++) {
      smallPokemonContainersArea.innerHTML += templateRenderSmallPokemonCards(i, "found");
      renderingFoundPokemonData(i, foundPokemons);
      await foundDataForSpecies(i);
    }
    smallPokemonContainersArea.innerHTML += templateFoundPokemonsAndLoadAllOption();
  }
}

/**
 * The div container changes the vertical orientation. The page is scrolled to the top.
 */

function viewSettingsForFoundPokemonsAndReturnPokeomContainer() {
  let smallPokemonContainersArea = document.getElementById("small-pokemon-containers");
  document.getElementById("body-container").style.alignItems = "flex-start";
  window.scrollTo(0, 0);
  smallPokemonContainersArea.innerHTML = "";
}

/**
 * The data for the found pokemons is rendered.
 * @param {number} i is the current iteration number from the array foundPokemons.
 * @param {array} foundPokemons is the array with the found pokemons.
 */

function renderingFoundPokemonData(i, foundPokemons) {
  renderPokemonName(i, foundPokemons);
  renderPokemonTypes(i, foundPokemons);
  renderPokemonOverviewColors(i, foundPokemons);
  renderPokemonImage(i, foundPokemons);
}

/**
 * The URl for the species is extracted from the array forundPokemons of the current Pokemon so that more information can be obtained from the API.
 * The same is done with the URL of the current Pokemon's evolution.
 * @param {number} i is the current iteration number fron the array founPokemons.
 */

async function foundDataForSpecies(i) {
  let foundSpeciesURL = await foundPokemons[i].species.url;
  let foundSpeciesResponse = await fetch(foundSpeciesURL);
  let foundSpeciesAsJson = await foundSpeciesResponse.json();

  if (foundSpeciesAsJson.evolution_chain !== null) {
    let foundEvolutionURL = foundSpeciesAsJson.evolution_chain.url;
    let foundEvolutionResponse = await fetch(foundEvolutionURL);
    let foundEvolutionAsJson = await foundEvolutionResponse.json();
    await getAndRenderEvolutionChainData(foundEvolutionAsJson.chain);
    await jsonsForVariablesFoundPokemons(foundSpeciesAsJson);
  }
}

/**
 * Variables are assigned specific pokemon data and are pushed in the array foundDataForSections.
 * @param {Object} speciesAsJson contains specific data from the current found pokemon.
 */

async function jsonsForVariablesFoundPokemons(speciesAsJson) {
  let genus = checkIfGenuIsExisting(speciesAsJson);
  let descriptionTextForPokemon = checkIfDescriptionIsExisting(speciesAsJson);

  foundDataForSections.push({ genu: genus, description: descriptionTextForPokemon, evolution: evolutionArray });
  evolutionArray = [];
}

/**
 * If no pokemons are found, an html template is displayed with this information.
 */

function noPokemonsFound() {
  document.getElementById("body-container").style.alignItems = "initial";
  let smallPokemonContainersArea = document.getElementById("small-pokemon-containers");
  smallPokemonContainersArea.innerHTML = templateNoPokemonsFound();
  checkScrollabilityNoPokemon(smallPokemonContainersArea);
  foundPokemons = ["No Pokemons found."];
}

/**
 * When the smallPokemonContainersArea has the property align items: initial the scrollability is prevented.
 * @param {documentElement} smallPokemonContainersArea is the div container where the Pokemons are displayed inside.
 */

function checkScrollabilityNoPokemon(smallPokemonContainersArea) {
  if ((smallPokemonContainersArea.style.alignItems = "initial")) {
    document.body.style.overflow = "hidden";
  }
}

/**
 * The arrays that store the data for the found Pokemon are getting cleared.
 */

function clearFoundPokemons() {
  foundPokemons = [];
  foundDataForSections = [];
}
