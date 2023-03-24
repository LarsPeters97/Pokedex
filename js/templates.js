function templateRenderSmallPokemonCards(pokemonIndex, loadedOrFound) {
  return /*html*/ `
    <div class="small-pokemon-cards" id="small-pokemon-cards${pokemonIndex}" onclick="detailedPokemonPopup(${pokemonIndex}, '${loadedOrFound}')">
        <h2 id="small-pokemon-name${pokemonIndex}"></h2>
        <div class="types-and-images">
            <div class="pokemon-types" id="pokemon-types${pokemonIndex}">
            </div>
        <div style="display: flex; flex-direction: column" id="pokemon${pokemonIndex}"> 
            <span class="number-of-pokemon"># ${pokemonIndex + 1}</span>
            <img class="pokemon-image" id="pokemon-image${pokemonIndex}">
            <span id="image-not-found${pokemonIndex}" class="d-none" style="margin-left: 12px;">The image of the pokemon could not be found.</span>
        </div>
    </div>
    </div>`;
}

function templatePokemonTypes(pokemonIndex, types, roundBoxColor) {
  return /*html*/ `<span class="types ${roundBoxColor}" id="types${pokemonIndex}">${types}</span>`;
}

function templateDetailedPokemonPopup(pokemonIndex, loadedOrFound, bigPokemonName, backgroundColor, bigPokemonImage) {
  return /*html*/ `
    <div class="background-popup" onclick="closePopup()" id="background-popup">
        <div class="full-detailed-card ${backgroundColor}-background" onclick="doNotClose(event)">
            <div class="upper-section-card ${backgroundColor}-background" id="upper-section-card${pokemonIndex}">
                <div class="name-and-number-detailed-card">
                    <h2>${bigPokemonName}</h2>
                    <span># ${pokemonIndex + 1}</span>
                </div>
                <div id="types-in-detailed-cards${pokemonIndex}" class="types-in-detailed-cards"></div>
                <img src="${bigPokemonImage}" id="big-pkemon-image${pokemonIndex}">
                 <span id="big-image-not-found${pokemonIndex}" class="d-none">The image of the pokemon could not be found.</span>
                
            </div>
            <div class="lower-pokemon-section">
                <div class="arrows">
                    <img src="./img/left-arrow.png" alt="previous" id="previous-img" onclick="showPreviousDetailedPokemon(${pokemonIndex}, '${loadedOrFound}')">
                    <img src="./img/right-arrow.png" alt="next" id="next-img" onclick="showNextDetailedPokemon(${pokemonIndex}, '${loadedOrFound}')">
                </div>
                <div class="pokemon-sections">
                    <ul>
                        <li onclick="aboutCurrentPokemon(${pokemonIndex}, '${loadedOrFound}');" class="active">About</li>
                        <li onclick="showPokemonStats(${pokemonIndex}), '${loadedOrFound}'">Stats</li>
                        <li onclick="showPokemonMoves(${pokemonIndex}, '${loadedOrFound}')">Moves</li>
                        <li onclick="showPokemonEvolution(${pokemonIndex}, '${loadedOrFound}')">Evolution</li>
                    </ul>
                </div>
                <div id="page-mask">
                </div>
            </div>
        </div>
    </div>`;
}

function templateAboutCurrentPokemon(pokemonGenu, pokemonDescription, pokemonHeight, pokemonWeight) {
  return /*html*/ `
    <div class="about-section">
        <span>Genus: ${pokemonGenu}</span>
        <span>Description: ${pokemonDescription.replace("\f", " ")}</span>
        <span>Height: ${pokemonHeight.toFixed(1).replace(".", ",")} m</span>
        <span>Weight: ${pokemonWeight.toFixed(1).replace(".", ",")} kg</span>
    </div>`;
}

function templatePokemonStats() {
  return /*html*/ `
    <div class="canvas-stats">
      <canvas id="myChart"></canvas>     
      <span class="info-stats"> Hover over a bar to see the exact value !</span>
    </div>`;
}

function templatePokemonMoves(pokemonIndex, loadedOrFound) {
  return /*html*/ `
    <div class="section-moves-evolution">
    ${renderMoves(pokemonIndex, loadedOrFound)}
    </div>`;
}

function templateEvolution() {
  return /*html*/ `
    <div class="section-moves-evolution" id="evolution-section">
    </div>`;
}

function pokemonEvolutionTemplate(i, currentEvolution) {
  return /*html*/ `
   <div class="evolution-pokemon-section">
    <div class="one-evolution-pokemon">
      <span style="text-align: center;">${currentEvolution[i].pokemonName}</span>
      <img class="evolution-images" src="${currentEvolution[i].pokemonImage}">
    </div>
      <div class="one-evolution-pokemon level-up" id="evolution-description${i}">
        <img src="./img/arrow-right.png">
        ${renderPokemonEvolutionDescription(i, currentEvolution)}
    </div>
    <div class="one-evolution-pokemon">
      <span style="text-align: center;">${currentEvolution[i + 1].pokemonName}</span>
      <img class="evolution-images" src="${currentEvolution[i + 1].pokemonImage}">
    </div>
   </div>`;
}

function pokemonNoEvolutionTemplate(currentEvolution) {
  return /*html*/ `
   <div class="evolution-pokemon-section">
    <div class="one-evolution-pokemon">
      <img class="evolution-images" src="${currentEvolution[0].pokemonImage}">
      <span>${currentEvolution[0].pokemonName} has no evolutionary chain.</span>
    </div>
  </div>`;
}

function templateNoPokemonsFound() {
  return /*html*/ `
  <div class="no-pokemon-section">
  <span class="info-no-pokemon">No Pokemons found !</span><br>
  <span class="font-size-no-pokemon" style="margin-top: 50px;">Click
    <button type="button" class="btn btn-light font-size-no-pokemon here-btn" onclick="showLoadedPokemonsAgain()">Here</button>
    to show the loaded Pokemons again.</span><br>
  <span class="font-size-no-pokemon">Or enter a new search term.</span>
  </div>`;
}

function templateFoundPokemonsAndLoadAllOption() {
  return /*html*/ `
  <div class="no-pokemon-section">
  <span class="font-size-no-pokemon" style="margin-top: 50px;">Click
    <button type="button" class="btn btn-light font-size-no-pokemon here-btn" onclick="showLoadedPokemonsAgain()">Here</button>
    to show the loaded Pokemons again.</span><br>
  <span class="font-size-no-pokemon">Or enter a new search term.</span>
  </div>`;
}
