let nextPokemonList = 'https://pokeapi.co/api/v2/pokemon/';
let loadedPokemons = [];
let currentPokemon = 0;
let numberOfAllPokemons;
let currentPokemonSection = 'about';


function init() {
    loadNextPokemons();
}


async function loadNextPokemons() {
    if (numberOfAllPokemons != loadedPokemons.length) {
        let response = await fetch(nextPokemonList);
        let responseAsJSON = await response.json();
        nextPokemonList = responseAsJSON.next;

        for (let index = 0; index < responseAsJSON.results.length; index++) {
            let pokemonResponse = await fetch(responseAsJSON.results[index].url);
            let pokemonASJSON = await pokemonResponse.json();
            numberOfAllPokemons = responseAsJSON.count;
            loadedPokemons.push(pokemonASJSON);
        }
        renderAllPokemons();
    }
}


// function loadingProcess() {
    
// }



function renderAllPokemons() {
    let smallPokemonContainersArea = document.getElementById('small-pokemon-containers');
    for (let i = currentPokemon; i < loadedPokemons.length; i++) {
        smallPokemonContainersArea.innerHTML += templateRenderSmallPokemonCards(i);
        renderPokemonName(i);
        renderPokemonTypes(i);
        renderPokemonOverviewColors(i);
        renderPokemonImage(i);
        currentPokemon = i + 1;
    }
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
        loadNextPokemons();
    }
});


function detailedPokemonPopup(pokemonIndex) {
    let popup = document.getElementById('popup');
    popup.innerHTML = '';
    let bigPokemonName = getPokemonName(pokemonIndex);
    let backgroundColor = getBackgroundColor(pokemonIndex);
    let bigPokemonImage = getPokemonImage(pokemonIndex);
    popup.innerHTML += templateDetailedPokemonPopup(pokemonIndex, bigPokemonName, backgroundColor, bigPokemonImage);
    detailedPokemonTypes(pokemonIndex);
    document.getElementById('background-popup').style.display = 'flex';
    checkScrollability();
    checkCurrentPokemonSection();
    checkFirstPokemon(pokemonIndex);
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


function aboutCurretPokemon(pokemonIndex) {
    let pageMask = document.getElementById('page-mask');
    pageMask.innerHTML = '';
    let pokemonHeight = getPokemonHeight(pokemonIndex);
    pageMask.innerHTML = templateAboutCurretPokemon(pokemonHeight);
}


function getPokemonHeight(pokemonIndex) {
    return loadedPokemons[pokemonIndex]['height'];
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


function selectedDetailedPokemonSection() {
    console.log('About');
}


async function showNextDetailedPokemon(pokemonIndex) {
    if(pokemonIndex == numberOfAllPokemons) {
        pokemonIndex = 0;
        nextPokemon(pokemonIndex);
    }
    else {
    if (pokemonIndex + 1 == loadedPokemons.length) {
        await loadNextPokemons();
        nextPokemon(pokemonIndex);
    }
    else 
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