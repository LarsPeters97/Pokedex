let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemons = [];
let currentPokemon = 0;
let numberOfAllPokemons;
let dataForSections = [];


function init() {
    loadingProcess();
}


async function loadingProcess() {
    showLoadingAnimation();
    await loadNextPokemons();
    await delayCloseLoadingAnimation();
    closeLoadingAnimation();
}


async function loadNextPokemons() {
    if (numberOfAllPokemons != loadedPokemons.length) {
        let response = await fetch(nextPokemonList);
        let responseAsJSON = await response.json();
        nextPokemonList = responseAsJSON.next;

        for (let index = 0; index < responseAsJSON.results.length; index++) {
            let pokemonResponse = await fetch(responseAsJSON.results[index].url);
            let pokemonAsJson = await pokemonResponse.json();
            numberOfAllPokemons = responseAsJSON.count;
            loadedPokemons.push(pokemonAsJson);
        }
        renderAllPokemons();
    }
}


function renderAllPokemons() {
    let smallPokemonContainersArea = document.getElementById('small-pokemon-containers');
    for (let i = currentPokemon; i < loadedPokemons.length; i++) {
        loadDataForSections(i);
        smallPokemonContainersArea.innerHTML += templateRenderSmallPokemonCards(i);
        renderPokemonName(i);
        renderPokemonTypes(i);
        renderPokemonOverviewColors(i);
        renderPokemonImage(i);
        currentPokemon = i + 1;
    }
}


async function loadDataForSections(pokemonIndex) {
    await loadDataForSpecies(pokemonIndex);
}


async function loadDataForSpecies(pokemonIndex) {
    let speciesURL = loadedPokemons[pokemonIndex].species.url;
    let speciesResponse = await fetch(speciesURL);
    let speciesAsJson = await speciesResponse.json();

    let evolutionChainURL = speciesAsJson.evolution_chain.url;
    let evolutionChainResponse = await fetch(evolutionChainURL);
    let evolutionChainAsJson = await evolutionChainResponse.json();

    jsonsForVariables(speciesAsJson, evolutionChainAsJson);
}


async function jsonsForVariables(speciesAsJson, evolutionChainAsJson) {
    let genus = speciesAsJson.genera[7].genus;
    let descriptionTextForPokemon = speciesAsJson.flavor_text_entries[3].flavor_text;
    let evolutionChain = evolutionChainAsJson.chain;

    dataForSections.push({ genu: genus, description: descriptionTextForPokemon, evolution: evolutionChain });
}


function showLoadingAnimation() {
    document.getElementById('loading-animation').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}


function closeLoadingAnimation() {
    document.getElementById('loading-animation').style.display = 'none';
    document.body.style.overflow = 'auto';
}


async function delayCloseLoadingAnimation() {
    if (loadedPokemons.length > 240) {
        await delay(3000);
    }
    if (loadedPokemons.length > 100) {
        await delay(1750);
    }
}


function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });

}


function renderPokemonName(pokemonIndex) {
    let smallPokemonName = document.getElementById(`small-pokemon-name${pokemonIndex}`);
    let pokemonName = getPokemonName(pokemonIndex);
    smallPokemonName.innerHTML += `${pokemonName}`;
}


function getPokemonName(pokemonIndex) {
    return loadedPokemons[pokemonIndex]['name'];
}


function renderPokemonTypes(pokemonIndex) {
    let pokemonTypes = document.getElementById(`pokemon-types${pokemonIndex}`);
    let pokemonType = loadedPokemons[pokemonIndex]['types'];
    for (let j = 0; j < pokemonType.length; j++) {
        let types = pokemonType[j]['type']['name'];
        let roundBoxColor = `${types}-round-box`;
        pokemonTypes.innerHTML += templatePokemonTypes(pokemonIndex, types, roundBoxColor);
    }
}


function getBackgroundColor(pokemonIndex) {
    return loadedPokemons[pokemonIndex]['types'][0]['type']['name'];
}


function renderPokemonOverviewColors(pokemonIndex) {
    let pokemonTypeforBackgroundColor = getBackgroundColor(pokemonIndex);
    selectBackgroundColorSmallCards(pokemonTypeforBackgroundColor, pokemonIndex);
}


function selectBackgroundColorSmallCards(pokemonTypeforBackgroundColor, pokemonIndex) {
    document.getElementById(`small-pokemon-cards${pokemonIndex}`).classList.add(`${pokemonTypeforBackgroundColor}-background`);
}


function renderPokemonImage(pokemonIndex) {
    let pokemonImage = document.getElementById(`pokemon-image${pokemonIndex}`);
    pokemonImage.src += getPokemonImage(pokemonIndex);
}


function getPokemonImage(pokemonIndex) {
    return loadedPokemons[pokemonIndex]['sprites']['other']['official-artwork']['front_default'];
}


window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (Math.ceil(scrolled) === scrollable) {
        loadingProcess();
    }
});


function detailedPokemonPopup(pokemonIndex) {
    let popup = document.getElementById('popup');
    popup.innerHTML = '';
    loadDataForSections(pokemonIndex);
    let bigPokemonName = getPokemonName(pokemonIndex);
    let backgroundColor = getBackgroundColor(pokemonIndex);
    let bigPokemonImage = getPokemonImage(pokemonIndex);
    popup.innerHTML += templateDetailedPokemonPopup(pokemonIndex, bigPokemonName, backgroundColor, bigPokemonImage);
    detailedPokemonTypes(pokemonIndex);
    document.getElementById('background-popup').style.display = 'flex';
    checkScrollability();
    checkCurrentPokemonSection();
    checkFirstPokemon(pokemonIndex);
    aboutCurrentPokemon(pokemonIndex);
}


function detailedPokemonTypes(pokemonIndex) {
    let detailedPokemonTypes = document.getElementById(`types-in-detailed-cards${pokemonIndex}`);
    let pokemonType = loadedPokemons[pokemonIndex]['types'];
    for (let j = 0; j < pokemonType.length; j++) {
        let types = pokemonType[j]['type']['name'];
        let roundBoxColor = `${types}-round-box`;
        detailedPokemonTypes.innerHTML += templatePokemonTypes(pokemonIndex, types, roundBoxColor);
    }
}


function closePopup() {
    document.getElementById('background-popup').style.display = 'none';
    document.body.style.overflow = 'auto';
}


function doNotClose(event) {
    event.stopPropagation();
}


function checkScrollability() {
    let backgroundPopup = document.getElementById('background-popup');
    if (backgroundPopup.style.display = 'flex') {
        document.body.style.overflow = 'hidden';
    }
}


function aboutCurrentPokemon(pokemonIndex) {
    let pageMask = document.getElementById('page-mask');
    let pokemonDescription = dataForSections[pokemonIndex].description;
    let pokemonHeight = getPokemonHeight(pokemonIndex);
    let pokemonWeight = getPokemonWeight(pokemonIndex);
    pageMask.innerHTML = templateAboutCurrentPokemon(pokemonDescription, pokemonHeight, pokemonWeight);
}


function getPokemonHeight(pokemonIndex) {
    return loadedPokemons[pokemonIndex]['height'] / 10;
}


function getPokemonWeight(pokemonIndex) {
    return loadedPokemons[pokemonIndex]['weight'];
}


function checkCurrentPokemonSection() {
    navbar = document.querySelector('.pokemon-sections').querySelectorAll('li');

    navbar.forEach(element => {
        element.addEventListener('click', function () {
            navbar.forEach(nav => nav.classList.remove('active'))

            this.classList.add('active');
        })
    })
}


async function showNextDetailedPokemon(pokemonIndex) {
    if (pokemonIndex == numberOfAllPokemons) {
        pokemonIndex = 0;
        nextPokemon(pokemonIndex);
    }
    else {
        if (pokemonIndex + 1 == loadedPokemons.length) {
            await loadingProcess();
        }
        nextPokemon(pokemonIndex);
    }
}


function nextPokemon(pokemonIndex) {
    pokemonIndex++;
    detailedPokemonPopup(pokemonIndex);
}


function showPreviousDetailedPokemon(pokemonIndex) {
    checkFirstPokemon(pokemonIndex);
    previousPokemon(pokemonIndex);
}


function checkFirstPokemon(pokemonIndex) {
    if (pokemonIndex == 0) {
        document.getElementById('previous-img').style.visibility = 'hidden';
    }
}


function previousPokemon(pokemonIndex) {
    if (pokemonIndex > 0) {
        pokemonIndex--;
        detailedPokemonPopup(pokemonIndex);
    }
}