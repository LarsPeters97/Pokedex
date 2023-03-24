let nextPokemonList = "https://pokeapi.co/api/v2/pokemon/";
let loadedPokemons = [];
let currentPokemon = 0;
let numberOfAllPokemons;
let loadedDataForSections = [];
let foundPokemons = [];
let foundDataForSections = [];
let evolutionArray = [];
let isTheFunctionExecuted = false;
let searchExecution = false;

/**
 * When the HTML is fully loaded, the first Pokemons are loaded and scrolled to the top. Also the EventListener for the searchInputField is executed.
 */

function init() {
  loadingProcess();
  inputEventListenerForSearch("search", "search-button");
  window.scrollTo(0, 0);
}

/**
 * Checks if the genu data is available.
 * @param {Object} speciesAsJson contains specific data from the current pokemon.
 * @returns the genus variable.
 */

function checkIfGenuIsExisting(speciesAsJson) {
  if (speciesAsJson.genera[7]) {
    genus = speciesAsJson.genera[7].genus;
  } else if (speciesAsJson.genera[4]) {
    genus = speciesAsJson.genera[4].genus;
  } else {
    genus = speciesAsJson.genera[0].genus;
  }
  return genus;
}

/**
 * Checks if the description data is available.
 * @param {Object} speciesAsJson contains specific data from the current pokemon.
 * @returns the descriptionTextForPokemon variable.
 */

function checkIfDescriptionIsExisting(speciesAsJson) {
  if (speciesAsJson.flavor_text_entries[7]) {
    descriptionTextForPokemon = speciesAsJson.flavor_text_entries[7].flavor_text;
  } else if (speciesAsJson.flavor_text_entries[4]) {
    descriptionTextForPokemon = speciesAsJson.flavor_text_entries[4].flavor_text;
  } else if (speciesAsJson.flavor_text_entries[0]) {
    descriptionTextForPokemon = speciesAsJson.flavor_text_entries[0].flavor_text;
  } else {
    descriptionTextForPokemon = "Sorry: The description could not be found.";
  }
  return descriptionTextForPokemon;
}

/**
 * The Pokemon name is written on the Pokemon card.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function renderPokemonName(pokemonIndex, array) {
  let smallPokemonName = document.getElementById(`small-pokemon-name${pokemonIndex}`);
  let pokemonName = getPokemonName(pokemonIndex, array);
  smallPokemonName.innerHTML += `${pokemonName}`;
  checkPokemonNameLenght(pokemonName, smallPokemonName);
}

/**
 * If the Pokemon name is longer than 26 characters, the font size will be reduced.
 * @param {string} pokemonName ist he name of the pokemon.
 * @param {string} smallPokemonName is the dom element for the pokemo name.
 */

function checkPokemonNameLenght(pokemonName, smallPokemonName) {
  if (pokemonName.length > 14) {
    smallPokemonName.style.fontSize = "26px";
  }
}

/**
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 * @returns the name of the pokemon.
 */

function getPokemonName(pokemonIndex, array) {
  let nameInLowerCase = array[pokemonIndex]["name"];
  let formattedName = nameInLowerCase.charAt(0).toUpperCase() + nameInLowerCase.slice(1);
  return formattedName;
}

/**
 * The Pokemon types are rendered and written on the small Pokemon card.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function renderPokemonTypes(pokemonIndex, array) {
  let pokemonTypes = document.getElementById(`pokemon-types${pokemonIndex}`);
  let pokemonType = array[pokemonIndex]["types"];
  for (let j = 0; j < pokemonType.length; j++) {
    let types = pokemonType[j]["type"]["name"];
    let roundBoxColor = `${types}-round-box`;
    pokemonTypes.innerHTML += templatePokemonTypes(pokemonIndex, types, roundBoxColor);
  }
}

/**
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 * @returns the first type of the pokemon to select the pokemon color.
 */

function getBackgroundColor(pokemonIndex, array) {
  return array[pokemonIndex]["types"][0]["type"]["name"];
}

/**
 * With the help of the first Pokemon type, the Pokemon color is selected.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function renderPokemonOverviewColors(pokemonIndex, array) {
  let pokemonTypeforBackgroundColor = getBackgroundColor(pokemonIndex, array);
  selectBackgroundColorSmallCards(pokemonTypeforBackgroundColor, pokemonIndex);
}

/**
 * With the pokemon type the class for the background color of the type is added, e.g. grass-background.
 * @param {string} pokemonTypeforBackgroundColor is the name of the pokemon type.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 */

function selectBackgroundColorSmallCards(pokemonTypeforBackgroundColor, pokemonIndex) {
  document.getElementById(`small-pokemon-cards${pokemonIndex}`).classList.add(`${pokemonTypeforBackgroundColor}-background`);
}

/**
 * The source of the Pokemon image is assigned.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function renderPokemonImage(pokemonIndex, array) {
  let pokemonImage = document.getElementById(`pokemon-image${pokemonIndex}`);
  pokemonImage.src += getPokemonImage(pokemonIndex, array);
}

/**
 * If the image is found in the array, it is returned, otherwise an error text is displayed and a pokeball is returned.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 * @returns the image of the pokemon.
 */

function getPokemonImage(pokemonIndex, array) {
  let pokemonImage = document.getElementById(`pokemon-image${pokemonIndex}`);
  if (array[pokemonIndex]["sprites"]["other"]["official-artwork"]["front_default"]) {
    return array[pokemonIndex]["sprites"]["other"]["official-artwork"]["front_default"];
  } else {
    pokemonImage.style.display = "none";
    removeClassDnone(`image-not-found${pokemonIndex}`);
    return "../img/pokeball.png";
  }
}

/**
 * When the user scrolls the height of the scrollable area is subtracted from the already scrolled area.
 * When the page has been scrolled to the maximum and the array foundPokemons is greater than 0, more Pokemons are loaded.
 */

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  if (Math.floor(scrolled) === scrollable || Math.ceil(scrolled) === scrollable) {
    if (foundPokemons.length > 0) {
      return;
    } else {
      loadingProcess();
    }
  }
});

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  if (Math.floor(scrolled) === scrollable || Math.ceil(scrolled) === scrollable) {
    if (foundPokemons.length > 0) {
      return;
    } else {
      loadingProcess();
    }
  }
});

/**
 * The detailed big Pokemon card is displayed.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function detailedPokemonPopup(pokemonIndex, loadedOrFound) {
  checkIfTheyAreLoadedOrFoundPokemons(loadedOrFound);
  let popup = document.getElementById("popup");
  popup.innerHTML = "";
  let bigPokemonName = getPokemonName(pokemonIndex, array);
  let backgroundColor = getBackgroundColor(pokemonIndex, array);
  let bigPokemonImage = getPokemonImage(pokemonIndex, array);
  popup.innerHTML += templateDetailedPokemonPopup(pokemonIndex, loadedOrFound, bigPokemonName, backgroundColor, bigPokemonImage);
  document.getElementById("background-popup").style.display = "flex";
  aboutCurrentPokemon(pokemonIndex, loadedOrFound);
  detailedPokemonTypes(pokemonIndex, array);
  checkCurrentPokemonSection();
  checksForTheDetailedPokemonPopup(pokemonIndex, loadedOrFound, array);
}

/**
 * Checks for the big detailed pokemon card.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function checksForTheDetailedPokemonPopup(pokemonIndex, loadedOrFound, array) {
  checkScrollability(loadedOrFound);
  checkBigPokemonImage(pokemonIndex);
  checkFirstOrLastPokemon(pokemonIndex, array);
}

/**
 * When the image error message is displayed in the small Pokemon card, the image error message is also displayed in the large Pokemon card.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 */

function checkBigPokemonImage(pokemonIndex) {
  let smallImageNotFound = document.getElementById(`image-not-found${pokemonIndex}`);
  let bigPokemonImage = document.getElementById(`big-pkemon-image${pokemonIndex}`);
  if (!smallImageNotFound.classList.contains("d-none")) {
    bigPokemonImage.style.display = "none";
    removeClassDnone(`big-image-not-found${pokemonIndex}`);
  }
}

/**
 * Depending on whether loaded or searched Pokemons are shown, the variables array and specificPokemonData get assigned the arrays of loaded or found Pokemon.
 * @param {string} loadedOrFound is either the string loaded or found.
 * @returns the variable specificPokemonData which contains the data of the loaded or found Pokemons.
 */

function checkIfTheyAreLoadedOrFoundPokemons(loadedOrFound) {
  let specificPokemonData;
  if (loadedOrFound === "loaded") {
    array = loadedPokemons;
    specificPokemonData = loadedDataForSections;
  }
  if (loadedOrFound === "found") {
    array = foundPokemons;
    specificPokemonData = foundDataForSections;
  }
  return specificPokemonData;
}

/**
 *
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function detailedPokemonTypes(pokemonIndex, array) {
  let detailedPokemonTypes = document.getElementById(`types-in-detailed-cards${pokemonIndex}`);
  let pokemonType = array[pokemonIndex]["types"];
  for (let j = 0; j < pokemonType.length; j++) {
    let types = pokemonType[j]["type"]["name"];
    let roundBoxColor = `${types}-round-box`;
    detailedPokemonTypes.innerHTML += templatePokemonTypes(pokemonIndex, types, roundBoxColor);
  }
}

/**
 * Each li element of the navbar gets a click listener.
 * When a li element is clicked, the class active is removed from each li element and added to the currently clicked li element.
 */

function checkCurrentPokemonSection() {
  navbar = document.querySelector(".pokemon-sections").querySelectorAll("li");

  navbar.forEach((element) => {
    element.addEventListener("click", function () {
      navbar.forEach((nav) => nav.classList.remove("active"));

      this.classList.add("active");
    });
  });
}

/**
 * The variables are assigned values from the specific pokemon data array and are placed on the detail pokemon map.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function aboutCurrentPokemon(pokemonIndex, loadedOrFound) {
  let specificPokemonData = checkIfTheyAreLoadedOrFoundPokemons(loadedOrFound);
  let pageMask = document.getElementById("page-mask");
  let pokemonGenu = specificPokemonData[pokemonIndex].genu;
  let pokemonDescription = specificPokemonData[pokemonIndex].description;
  let pokemonHeight = getPokemonHeight(pokemonIndex, array);
  let pokemonWeight = getPokemonWeight(pokemonIndex, array);
  pageMask.innerHTML = templateAboutCurrentPokemon(pokemonGenu, pokemonDescription, pokemonHeight, pokemonWeight);
}

/**
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 * @returns the pokemon height.
 */

function getPokemonHeight(pokemonIndex, array) {
  return array[pokemonIndex]["height"] / 10;
}

/**
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 * @returns the pokemon weight.
 */

function getPokemonWeight(pokemonIndex, array) {
  return array[pokemonIndex]["weight"] / 10;
}

/**
 * The pokemon stats will be rendered and displayed using the Chart.js.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function showPokemonStats(pokemonIndex, loadedOrFound) {
  checkIfTheyAreLoadedOrFoundPokemons(loadedOrFound);
  valuesForTheXAxis = [];
  valuesForTheYAxis = [];
  let pageMask = document.getElementById("page-mask");
  pageMask.innerHTML = templatePokemonStats();
  renderStats(pokemonIndex, array);
  chart();
}

/**
 * The Pokemon movements are placed on the large detailed Pokemon map.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function showPokemonMoves(pokemonIndex, loadedOrFound) {
  let pageMask = document.getElementById("page-mask");
  pageMask.innerHTML = templatePokemonMoves(pokemonIndex, loadedOrFound);
}

/**
 * The pokemon moves are denominated from the array using a for loop and assigned to the variable moves.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 * @returns the moves of the pokemon.
 */

function renderMoves(pokemonIndex, loadedOrFound) {
  checkIfTheyAreLoadedOrFoundPokemons(loadedOrFound);
  let moves = "";
  if (array[pokemonIndex]["moves"].length === 0) {
    moves = "No moves found.";
    return moves;
  } else {
    for (let m = 0; m < array[pokemonIndex]["moves"].length; m++) {
      let move = array[pokemonIndex]["moves"][m]["move"]["name"];
      moves += /*html*/ `<li class="moves">${move}</li>`;
    }
    return moves;
  }
}

/**
 * The next big detailed pokemon card is displayed. And when all pokemons from the array loadedPokemons are displayed, 20 new ones are loaded.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

async function showNextDetailedPokemon(pokemonIndex, loadedOrFound) {
  if (pokemonIndex == numberOfAllPokemons) {
    pokemonIndex = 0;
    nextPokemon(pokemonIndex);
  } else {
    if (pokemonIndex + 1 == loadedPokemons.length) {
      document.getElementById("next-img").style.visibility = "hidden";
      document.getElementById("previous-img").style.visibility = "hidden";
      await loadingProcess();
    }
    if (document.getElementById("background-popup").style.display == "flex") nextPokemon(pokemonIndex, loadedOrFound);
  }
}

/**
 * The Pokemon index is increased by one to then display the next large detailed Pokemon map.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function nextPokemon(pokemonIndex, loadedOrFound) {
  pokemonIndex++;
  detailedPokemonPopup(pokemonIndex, loadedOrFound);
}

/**
 * The previous detailed pokemon is displayed, if this is not the first Pokemon from the array.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function showPreviousDetailedPokemon(pokemonIndex, loadedOrFound) {
  checkIfTheyAreLoadedOrFoundPokemons(loadedOrFound);
  checkFirstOrLastPokemon(pokemonIndex, array);
  previousPokemon(pokemonIndex, loadedOrFound);
}

/**
 * The Pokemon index is decreased by one to then display the previous large detailed Pokemon map.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {string} loadedOrFound is either the string loaded or found.
 */

function previousPokemon(pokemonIndex, loadedOrFound) {
  if (pokemonIndex > 0) {
    pokemonIndex--;
    detailedPokemonPopup(pokemonIndex, loadedOrFound);
  }
}

/**
 * The loaded pokemon section is shown again.
 */

async function showLoadedPokemonsAgain() {
  loadedPokemons = [];
  loadedDataForSections = [];
  nextPokemonList = "https://pokeapi.co/api/v2/pokemon/";
  clearFoundPokemons();
  settingsForTheReload();
  await loadingProcess();
}

/**
 * The global scope is currentPokemon is set to 0, the document is scrollable again and the document is scolled to the top.
 */

function settingsForTheReload() {
  currentPokemon = 0;
  let smallPokemonContainersArea = document.getElementById("small-pokemon-containers");
  smallPokemonContainersArea.innerHTML = "";
  smallPokemonContainersArea.style.alignItems = "center";
  document.body.style.overflow = "auto";
  window.scrollTo(0, 0);
}
