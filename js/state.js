import {
    REGIONS
} from "./utils/mappings.js"

export const appState = {
    eduData: {},
    topoData: null,
    currentMetric: "math",
    currentYear: null,
    selectedStates: [],
    scatterXMetric: "spending",
    scatterYMetric: "math",
    activeRegions: new Set(Object.keys(REGIONS)),
    highlightedFromScatter: null,
    playInterval: null,
    colorScale: null,
}
