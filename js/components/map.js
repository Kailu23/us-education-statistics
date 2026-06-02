import { appState } from '../state.js'

import { getValue } from '../dataLoader.js'

import {
    FIPS_TO_ABBR,
    ABBR_TO_FULL,
    STATE_TO_REGION,
} from '../utils/mappings.js'

import { METRICS } from '../utils/constants.js'

import {
    showTooltip,
    moveTooltip,
    hideTooltip,
} from './tooltip.js'

import {
    updateLineChart,
    updateSelectedLegend
} from './lineChart.js';

let mapSvg, mapG, paths, projection, pathGen;

export function buildMap() {
    const el = document.getElementById("map-svg");
    mapSvg = d3.select(el);

    const states = topojson.feature(appState.topoData, appState.topoData.objects.states);
    projection = d3
        .geoAlbersUsa()
        .fitSize([el.clientWidth || 700, el.clientHeight || 400], states);
    pathGen = d3.geoPath().projection(projection);

    mapG = mapSvg.append("g");

    paths = mapG
        .selectAll(".state-path")
        .data(states.features)
        .join("path")
        .attr("class", "state-path")
        .attr("d", pathGen)
        .on("mouseover", onStateHover)
        .on("mousemove", onStateMove)
        .on("mouseout", onStateOut)
        .on("click", onStateClick);

    new ResizeObserver(() => {
        const w = el.clientWidth,
            h = el.clientHeight;
        if (!w || !h) return;
        projection.fitSize([w, h], states);
        pathGen = d3.geoPath().projection(projection);
        paths.attr("d", pathGen);
    }).observe(el);
}


export function updateMap() {
    const col = METRICS[appState.currentMetric].col;
    const vals = [];
    Object.keys(appState.eduData).forEach((abbr) => {
        const v = getValue(abbr, appState.currentYear, appState.currentMetric);
        if (v !== null) vals.push(v);
    });
    const [minV, maxV] = d3.extent(vals);
    appState.colorScale = d3
        .scaleSequential(METRICS[appState.currentMetric].colors)
        .domain([minV, maxV]);

    paths
        .transition()
        .duration(400)
        .attr("fill", (d) => {
            const abbr = FIPS_TO_ABBR[String(d.id).padStart(2, "0")];
            if (!abbr) return "#333";
            const v = getValue(abbr, appState.currentYear, appState.currentMetric);
            return v !== null ? appState.colorScale(v) : "#2a2a2a";
        })
        .attr("opacity", (d) => {
            const abbr = FIPS_TO_ABBR[String(d.id).padStart(2, "0")];
            const region = STATE_TO_REGION[abbr];
            return region && appState.activeRegions.has(region) ? 1 : 0.12;
        });

    paths.classed("highlighted", (d) => {
        const abbr = FIPS_TO_ABBR[String(d.id).padStart(2, "0")];
        return appState.highlightedFromScatter && appState.highlightedFromScatter === abbr;
    });

    updateLegend(minV, maxV);
}

function updateLegend(minV, maxV) {
    const svg = d3.select("#legend-svg");
    const W = document.getElementById("legend-svg").clientWidth || 220;
    const H = 50;
    svg.attr("width", W).attr("height", H);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", "leg-grad");
    const n = 10;
    d3.range(n + 1).forEach((i) => {
        grad
            .append("stop")
            .attr("offset", (i / n) * 100 + "%")
            .attr("stop-color", appState.colorScale(minV + (maxV - minV) * (i / n)));
    });

    svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 18)
        .attr("width", W)
        .attr("height", 14)
        .attr("rx", 3)
        .attr("fill", "url(#leg-grad)");

    const fmt = METRICS[appState.currentMetric].format;
    svg
        .append("text")
        .attr("x", 0)
        .attr("y", 12)
        .attr("fill", "#8b949e")
        .attr("font-size", 10)
        .attr("font-family", "Space Mono,monospace")
        .text(fmt(minV));
    svg
        .append("text")
        .attr("x", W)
        .attr("y", 12)
        .attr("fill", "#8b949e")
        .attr("font-size", 10)
        .attr("font-family", "Space Mono,monospace")
        .attr("text-anchor", "end")
        .text(fmt(maxV));
}

function onStateClick(event, d) {
    const abbr = FIPS_TO_ABBR[String(d.id).padStart(2, "0")];
    if (!abbr) return;
    if (event.ctrlKey || event.metaKey) {
        if (appState.selectedStates.includes(abbr)) {
            appState.selectedStates = appState.selectedStates.filter((s) => s !== abbr);
        } else if (appState.selectedStates.length < 8) {
            appState.selectedStates.push(abbr);
        }
    } else {
        appState.selectedStates = [abbr];
    }
    updateLineChart();
    updateSelectedLegend();
}

function onStateHover(event, d) {

    const abbr = FIPS_TO_ABBR[String(d.id).padStart(2, "0")];

    if (!abbr) {
        return;
    }

    const v = getValue(abbr, appState.currentYear, appState.currentMetric);

    showTooltip(
        ABBR_TO_FULL[abbr] || abbr,
        METRICS[appState.currentMetric].label,
        v !== null ? METRICS[appState.currentMetric].format(v) : "N/A"
    );
}

function onStateMove(event) {
    moveTooltip(event)
}

function onStateOut(event) {
    hideTooltip(event);
}
