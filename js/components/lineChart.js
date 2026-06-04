import { appState } from '../state.js';
import { getValue } from '../dataLoader.js';
import {
    METRICS,
    PALETTE
} from '../utils/constants.js';

export function updateLineChart() {
    const container = document.getElementById("line-chart-container");
    const noMsg = document.getElementById("no-sel-msg");
    const svg = d3.select("#line-svg");

    if (appState.selectedStates.length === 0) {
        noMsg.style.display = "flex";
        document.getElementById("line-svg").style.display = "none";
        return;
    }

    noMsg.style.display = "none";
    document.getElementById("line-svg").style.display = "block";
    svg.selectAll("*").remove();

    const W = container.clientWidth - 48;
    const H = container.clientHeight - 24;
    const margin = { top: 10, right: 20, bottom: 30, left: 52 };
    const iW = W - margin.left - margin.right;
    const iH = H - margin.top - margin.bottom;

    const years = appState.currentMetric === "math" ||
        appState.currentMetric === "reading" ? d3.range(2000, 2020).filter(
            (y) => getValue("CA", y, appState.currentMetric) !== null
        ) : d3.range(2000, 2020);
    const allVals = [];
    appState.selectedStates.forEach((abbr) => {
        years.forEach((y) => {
            const v = getValue(abbr, y, appState.currentMetric);
            if (v !== null) allVals.push(v);
        });
    });

    const xScale = d3.scalePoint()
        .domain(years)
        .range([0, iW]);

    const yScale = d3
        .scaleLinear()
        .domain([d3.min(allVals) * 0.95, d3.max(allVals) * 1.02])
        .range([iH, 0]);

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale).tickSize(-iW).tickFormat(""))
        .select(".domain")
        .remove();

    g.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${iH})`)
        .call(d3.axisBottom(xScale));
    g.append("g")
        .attr("class", "axis")
        .call(
            d3
                .axisLeft(yScale)
                .ticks(5)
                .tickFormat((v) => {
                    if (appState.currentMetric === "spending")
                        return "$" + d3.format("~s")(v);
                    if (appState.currentMetric === "enrollment") return d3.format("~s")(v);
                    return d3.format(".0f")(v);
                }),
        );

    if (years.includes(appState.currentYear)) {
        g.append("line")
            .attr("x1", xScale(appState.currentYear))
            .attr("x2", xScale(appState.currentYear))
            .attr("y1", 0)
            .attr("y2", iH)
            .attr("stroke", "#e3b341")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "4,3")
            .attr("opacity", 0.7);
    }

    const line = d3
        .line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.value))
        .curve(d3.curveMonotoneX);

    appState.selectedStates.forEach((abbr, i) => {
        const data = years
            .map((year) => ({
                year,
                value: getValue(abbr, year, appState.currentMetric),
            }))
            .filter((d) => d.value !== null);

        const color = PALETTE[i % PALETTE.length];

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", line);

        g.selectAll(`.dot-${i}`)
            .data(data)
            .join("circle")
            .attr("cx", (d) => xScale(d.year))
            .attr("cy", (d) => yScale(d.value))
            .attr("r", 3)
            .attr("fill", color);
    });
}

export function updateSelectedLegend() {
    const container = document.getElementById("legend-items");
    container.innerHTML = "";
    appState.selectedStates.forEach((abbr, i) => {
        const color = PALETTE[i % PALETTE.length];
        const item = document.createElement("div");
        item.className = "legend-item";
        item.innerHTML = `<div class="legend-dot" style="background:${color}"></div>${abbr}`;
        item.addEventListener("click", () => {
            appState.selectedStates = appState.selectedStates.filter((s) => s !== abbr);
            updateLineChart();
            updateSelectedLegend();
        });
        container.appendChild(item);
    });
}
