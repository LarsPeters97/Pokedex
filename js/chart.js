/**
 * Chart.js
 * In the chart() function several functions are outsourced for clarity.
 */

let valuesForTheXAxis = [];
let valuesForTheYAxis = [];

function chart() {
  const ctx = document.getElementById("myChart");
  if (window.innerWidth >= 500) {
    Chart.defaults.font.size = 20;
  }
  if (window.innerWidth < 500) {
    Chart.defaults.font.size = 11;
  }
  new Chart(ctx, {
    type: "bar",
    data: returnPokemonData(),
    options: returnOptions(),
  });
}

function returnOptions() {
  let selectedOptions = {
    indexAxis: "y",
    scales: returnScalesSettings(),
    plugins: returnPluginsSettings(),
    responsive: true,
    maintainAspectRatio: false,
  };
  return selectedOptions;
}

function returnPokemonData() {
  let pokemonData = {
    labels: valuesForTheXAxis,
    datasets: [
      {
        label: "",
        data: valuesForTheYAxis,
        borderRadius: 8,
        backgroundColor: returnBackgroundColors(),
      },
    ],
  };
  return pokemonData;
}

function returnBackgroundColors() {
  let backgroundColors = [
    "rgba(238, 0, 0, 0.8)",
    "rgba(160, 82, 45, 0.8)",
    "rgba(24, 116, 205, 0.8)",
    "rgba(155, 48, 255, 0.8)",
    "rgba(72, 209, 204, 0.8)",
    "rgba(255, 255, 0, 0.8)",
  ];
  return backgroundColors;
}

function returnScalesSettings() {
  let scaleSettings = {
    x: {
      ticks: {
        color: "white",
      },
    },
    y: {
      ticks: {
        color: "white",
      },
    },
  };
  return scaleSettings;
}

function returnPluginsSettings() {
  let pluginsSettings = {
    legend: {
      display: false,
    },
  };
  return pluginsSettings;
}

/**
 * Renders the stats of the current pokemon iteration.
 * @param {number} pokemonIndex is the current iteration number from the array.
 * @param {array} array is the loadedPokemons or foundPokemons array.
 */

function renderStats(pokemonIndex, array) {
  for (let i = 0; i < array[pokemonIndex].stats.length; i++) {
    const statNames = array[pokemonIndex].stats[i].stat.name;
    const stats = array[pokemonIndex].stats[i].base_stat;
    valuesForTheXAxis.push(statNames);
    valuesForTheYAxis.push(stats);
  }
}
