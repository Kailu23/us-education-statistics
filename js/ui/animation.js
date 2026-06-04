import { appState } from '../state.js';
import { updateMap } from '../components/map.js';
import { updateLineChart } from '../components/lineChart.js';
import { updateScatter } from '../components/scatter.js';
import { getAvailableYears } from '../dataLoader.js';

export function bindAnimationControls() {
    const playBtn = document.getElementById("play-btn");

    playBtn.addEventListener("click", () => {
        if (appState.playInterval) {
            stopAnimation(playBtn);
        } else {
            startAnimation(playBtn);
        }
    });
}

function stopAnimation(playBtn) {
    clearInterval(appState.playInterval);

    appState.playInterval = null;

    playBtn.textContent = "▶ PLAY ANIMACIJA";
    playBtn.classList.remove("paused");
}

function startAnimation(playBtn) {
    playBtn.textContent = "⏸ PAUZIRAJ";
    playBtn.classList.add("paused");
    const years = getAvailableYears(appState.currentMetric);

    if (!years.length) {
        return;
    }
    if (!years.includes(appState.currentYear)) {
        appState.currentYear = years[0];
    }

    let currentIndex = years.indexOf(appState.currentYear);

    if (currentIndex >= years.length - 1) {
        currentIndex = 0;
        appState.currentYear = years[0];
    }

    appState.playInterval = setInterval(() => {
        currentIndex++;

        if (currentIndex >= years.length) {
            clearInterval(appState.playInterval);
            appState.playInterval = null;
            playBtn.textContent="▶ PLAY ANIMACIJA";
            playBtn.classList.remove("paused");
            return;
        }

        appState.currentYear=years[currentIndex];

        document.getElementById("year-display").textContent=appState.currentYear;
        document.getElementById("year-slider").value=currentIndex;

        updateMap();
        updateScatter();
        updateLineChart();
    }, 850);
}
