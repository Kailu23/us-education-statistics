import { appState } from '../state.js';

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
            appState.currentYear = +e.target.value;
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
