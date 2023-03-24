/**
 * The html element with the passed id gets the class d-none added.
 * @param {string} id of the html element.
 */

function addClassDnone(id) {
  document.getElementById(id).classList.add("d-none");
}

/**
 * The html element with the passed id gets the class display none removed.
 * @param {string} id of the html element.
 */

function removeClassDnone(id) {
  document.getElementById(id).classList.remove("d-none");
}

/**
 * Preventing a specific event from being propagated to parent elements.
 * @param {object} event  contains information about the triggered event, e.g. which the keys was pressed.
 */

function doNotClose(event) {
  event.stopPropagation();
}

/**
 * The loading animation is shown and scrolling is prevented.
 */

function showLoadingAnimation() {
  document.getElementById("loading-animation").style.display = "flex";
}

/**
 * The loading animation is closed and scrolling is made possible again.
 */

function closeLoadingAnimation() {
  document.getElementById("loading-animation").style.display = "none";
  document.body.style.overflow = "auto";
}

/**
 * A Promise is generated and solved after the time defined in the function parameter milliseconds.
 * @param {number} milliseconds how long the delay should last.
 */

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * When the popup for the detailed big pokemon is open, the document can´t be scrolled.
 */

function checkScrollability() {
  let backgroundPopup = document.getElementById("background-popup");
  if ((backgroundPopup.style.display = "flex")) {
    document.body.style.overflow = "hidden";
  }
}

/**
 * The popup for the detailed big pokemon card gets closed.
 */

function closePopup() {
  document.getElementById("background-popup").style.display = "none";
  document.body.style.overflow = "auto";
}

/**
 * The input search field is cleared and the error message is hidden.
 */

async function deleteInput() {
  document.getElementById("search").value = "";
  addClassDnone("input-error");
  if (foundPokemons.length > 0) {
    await showLoadedPokemonsAgain();
  }
}

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

/**
 * The swiper for the next or previous Pokemon is hidden when the Pokemon index is 0, or equal to the total Pokemon count.
 * @param {number} pokemonIndex is the current iteration number fron the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function checkFirstOrLastPokemon(pokemonIndex, array) {
  if (pokemonIndex == 0) {
    document.getElementById("previous-img").style.visibility = "hidden";
  }
  if (pokemonIndex == numberOfAllPokemons) {
    document.getElementById("next-img").style.visibility = "hidden";
  }
  if (pokemonIndex + 1 == array.length && foundPokemons.length > 0) {
    document.getElementById("next-img").style.visibility = "hidden";
  }
}
