import { appState } from '../state.js'
import { getValue } from '../dataLoader.js'

import {
    FIPS_TO_ABBR,
    ABBR_TO_FULL,
    STATE_TO_REGION,
} from '../utils/mappings.js'

import {
    METRICS,
    PALETTE,
} from '../utils/constants.js'

import {
    showTooltip,
    moveTooltip,
    hideTooltip
} from './tooltip.js'

import { updateMap } from './map.js'

function drawStatLines(g, data, xScale, yScale, iW, iH) {
    const statMode =
        document.getElementById("scatter-stat-select")?.value || "none";
    if (statMode !== "none") {
        const drawV = (x, c = "#e3b341") =>
            g
                .append("line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 0)
                .attr("y2", iH)
                .attr("stroke", c)
                .attr("stroke-dasharray", "4,4");
        const drawH = (y, c = "#e3b341") =>
            g
                .append("line")
                .attr("x1", 0)
                .attr("x2", iW)
                .attr("y1", y)
                .attr("y2", y)
                .attr("stroke", c)
                .attr("stroke-dasharray", "4,4");
        const probs =
            statMode === "median"
                ? [0.5]
                : statMode === "quartiles"
                    ? [0.25, 0.5, 0.75]
                    : d3.range(0.1, 1, 0.1);

        const xValues = data
            .map((d) => d.xVal)
            .sort(d3.ascending);

        const yValues = data
            .map((d) => d.yVal)
            .sort(d3.ascending);

        probs.forEach((p) => {

            const xQ = d3.quantile(xValues, p);
            const yQ = d3.quantile(yValues, p);

            drawV(xScale(xQ));
            drawH(yScale(yQ));
        });
    }
}

export function updateScatter() {

    document
        .getElementById("scatter-title")
        .textContent = `Scatter: ${METRICS[appState.scatterXMetric].label} vs. ${METRICS[appState.scatterYMetric].label}`;

    const container = document.getElementById("scatter-container");
    const svg = d3.select("#scatter-svg");

    svg.selectAll("*").remove();

    const W = container.clientWidth || 500;
    const H = container.clientHeight || 180;

    const margin = {
        top: 10,
        right: 20,
        bottom: 40,
        left: 60,
    };

    const iW = W - margin.left - margin.right;
    const iH = H - margin.top - margin.bottom;

    const states = Object.keys(FIPS_TO_ABBR).map(
        (fips) => FIPS_TO_ABBR[fips],
    );

    const data = states
        .map((abbr) => {
            const region = STATE_TO_REGION[abbr];

            if (!appState.activeRegions.has(region)) return null;

            const xVal = getValue(abbr, appState.currentYear, appState.scatterXMetric);

            const yVal = getValue(abbr, appState.currentYear, appState.scatterYMetric);

            if (xVal == null || yVal == null) return null;

            return {
                abbr,
                xVal,
                yVal,
            };
        })
        .filter(Boolean);

    if (data.length === 0) return;

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.xVal))
        .nice()
        .range([0, iW]);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.yVal))
        .nice()
        .range([iH, 0]);

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid

    g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${iH})`)
        .call(d3.axisBottom(xScale).tickSize(-iH).tickFormat(""));

    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale).tickSize(-iW).tickFormat(""));

    // X axis

    g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${iH})`)
        .call(d3.axisBottom(xScale));

    // Y axis

    g.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

    // X label

    g.append("text")
        .attr("x", iW / 2)
        .attr("y", iH + 35)
        .attr("text-anchor", "middle")
        .attr("fill", "#8b949e")
        .attr("font-size", 10)
        .attr("font-family", "Space Mono, monospace")
        .text(METRICS[appState.scatterXMetric].label);

    // Y label

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -iH / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("fill", "#8b949e")
        .attr("font-size", 10)
        .attr("font-family", "Space Mono, monospace")
        .text(METRICS[appState.scatterYMetric].label);

    drawStatLines(g, data, xScale, yScale, iW, iH);

    // Scatter dots

    g.selectAll(".scatter-dot")
        .data(data)
        .join("circle")
        .attr("class", "scatter-dot")
        .attr("cx", (d) => xScale(d.xVal))
        .attr("cy", (d) => yScale(d.yVal))
        .attr("r", 5)
        .attr("fill", (d) => {
            const idx = appState.selectedStates.indexOf(d.abbr);

            return idx >= 0 ? PALETTE[idx % PALETTE.length] : "#58a6ff";
        })
        .attr("opacity", 0.75)

        .on("mouseover", (event, d) => {
            showTooltip(
                ABBR_TO_FULL[d.abbr] || d.abbr,
                `${METRICS[appState.scatterXMetric].label}: ${METRICS[appState.scatterXMetric].format(d.xVal)
                }`,
                `${METRICS[appState.scatterYMetric].label}: ${METRICS[appState.scatterYMetric].format(d.yVal)
                }`
            );
        })

        .on("mousemove", moveTooltip)

        .on("mouseout", () => {
            hideTooltip();
            updateMap();
        })

        .on("click", (event, d) => {
            appState.highlightedFromScatter = d.abbr;
            updateMap();
        });
}
