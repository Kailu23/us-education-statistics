import { appState } from '../state.js';
import { updateMap } from '../components/map.js';
import { updateLineChart } from '../components/lineChart.js';
import { updateScatter } from '../components/scatter.js';

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
    if (appState.currentYear >= 2019) {
        appState.currentYear = 2000;
    }
    appState.playInterval = setInterval(() => {
        appState.currentYear++;
        document.getElementById("year-display").textContent = appState.currentYear;
        document.getElementById("year-slider").value = appState.currentYear;
        updateMap();
        updateScatter();
        updateLineChart();
        if (appState.currentYear >= 2019) {
            clearInterval(appState.playInterval);
            appState.playInterval = null;
            playBtn.textContent = "▶ PLAY ANIMACIJA";
            playBtn.classList.remove("paused");
        }
    }, 850);
}
