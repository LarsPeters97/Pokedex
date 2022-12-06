function templateRenderSmallPokemonCards(pokemonIndex) {
    return /*html*/`
    <div class="small-pokemon-cards" id="small-pokemon-cards${pokemonIndex}" onclick="detailedPokemonPopup(${pokemonIndex})">
        <h2 id="small-pokemon-name${pokemonIndex}"></h2>
        <div class="types-and-images">
            <div class="pokemon-types" id="pokemon-types${pokemonIndex}">
            </div>
        <div style="display: flex; flex-direction: column"> 
            <span class="number-of-pokemon"># ${pokemonIndex + 1}</span>
            <img class="pokemon-image" id="pokemon-image${pokemonIndex}">
        </div>
    </div>
    </div>`;
}


function templatePokemonTypes(pokemonIndex, types, roundBoxColor) {
    return /*html*/`<span class="types ${roundBoxColor}" id="types${pokemonIndex}">${types}</span>`
}


function templateDetailedPokemonPopup(pokemonIndex, bigPokemonName, backgroundColor, bigPokemonImage) {
    return /*html*/`
    <div class="background-popup" onclick="closePopup()" id="background-popup">
        <div class="full-detailed-card ${backgroundColor}-background" onclick="doNotClose(event)">
            <div class="upper-section-card ${backgroundColor}-background" id="upper-section-card${pokemonIndex}">
                <div class="name-and-number-detailed-card">
                    <h2>${bigPokemonName}</h2>
                    <span># ${pokemonIndex + 1}</span>
                </div>
                <div id="types-in-detailed-cards${pokemonIndex}" class="types-in-detailed-cards"></div>
                <img src="${bigPokemonImage}">
                
            </div>
            <div class="lower-pokemon-section">
                <div class="arrows">
                    <img src="./img/left-arrow.png" alt="previous" id="previous-img" onclick="showPreviousDetailedPokemon(${pokemonIndex})">
                    <img src="./img/right-arrow.png" alt="next" onclick="showNextDetailedPokemon(${pokemonIndex})">
                </div>
                <div class="pokemon-sections">
                    <ul>
                        <li class="active"><a href="#about">About</li>
                        <li><a href="#stats">Stats</li>
                        <li><a href="#evolution">Evolution</li>
                        <li><a href="#moves">Moves</li>
                    </ul>
                </div>
                <div id="page-mask">
                </div>
            </div>
        </div>
    </div>`;
}


function templateAboutCurretPokemon(pokemonHeight) {
    return /*html*/`
    <div>
        <span>${pokemonHeight}</span>
    </div>`
}