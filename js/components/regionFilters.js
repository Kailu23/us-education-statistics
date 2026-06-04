import { appState } from '../state.js'
import { REGIONS } from '../utils/mappings.js'
import { updateMap } from './map.js'
import { updateScatter } from './scatter.js'

export function buildRegionFilters() {
    const container = document.getElementById("region-filters");
    Object.keys(REGIONS).forEach((region) => {
        const label = document.createElement("label");
        label.className = "region-check";
        label.innerHTML = `<input type="checkbox" checked value="${region}"> ${region}`;
        label.querySelector("input").addEventListener("change", (e) => {
            if (e.target.checked) appState.activeRegions.add(region);
            else appState.activeRegions.delete(region);
            updateMap();
            updateScatter();
        });
        container.appendChild(label);
    });
}

