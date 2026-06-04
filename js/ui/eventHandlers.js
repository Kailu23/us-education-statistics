import { appState } from '../state.js';

import { getAvailableYears } from '../dataLoader.js';
import { updateMap } from '../components/map.js';
import { updateScatter } from '../components/scatter.js';
import { updateLineChart } from '../components/lineChart.js';

export function bindEventHandlers() {
    document
        .getElementById("metric-select")
        .addEventListener("change", (e) => {
            appState.currentMetric = e.target.value;

            appState.scatterYMetric = appState.currentMetric;

            document.getElementById("scatter-y").value = appState.currentMetric;

            const years = getAvailableYears(appState.currentMetric);

            const slider = document.getElementById("year-slider");

            slider.min = 0;
            slider.max = years.length - 1;

            if (!years.includes(appState.currentYear)) {
                slider.value = 0;
                appState.currentYear = years[0];
            } else {
                slider.value = years.indexOf(appState.currentYear);
            }

            document.getElementById("year-display").textContent = appState.currentYear;

            updateMap();
            updateScatter();
            updateLineChart();
        });
    document
        .getElementById("scatter-x")
        .addEventListener("change", (e) => {
            appState.scatterXMetric = e.target.value;

            updateScatter();
        });

    document
        .getElementById("scatter-y")
        .addEventListener("change", (e) => {
            appState.scatterYMetric = e.target.value;

            updateScatter();
        });

    document
        .getElementById("year-slider")
        .addEventListener("input", (e) => {
            const years = getAvailableYears(appState.currentMetric);

            appState.currentYear = years[+e.target.value];;
            document.getElementById("year-display").textContent = appState.currentYear;
            updateMap();
            updateScatter();
            updateLineChart();
        });

    document
        .getElementById("scatter-stat-select")
        ?.addEventListener("change", () => {
            updateScatter()
        });
}
