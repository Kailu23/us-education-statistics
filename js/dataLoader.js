import { appState } from "./state.js";
import { CSV_TO_ABBR } from "./utils/mappings.js";
import { METRICS, TOPO_URL, CSV_PATH } from "./utils/constants.js";

export function processCSV(rows) {
    rows.forEach((row) => {
        const abbr = CSV_TO_ABBR[row.STATE?.trim()?.toUpperCase()];
        if (!abbr) return;
        const year = +row.YEAR;
        if (year < 2000 || year > 2019) return;

        const enroll = +row.ENROLL || null;
        const total = +row.TOTAL_EXPENDITURE || null;
        const math = +row.AVG_MATH_4_SCORE || null;
        const read = +row.AVG_READING_4_SCORE || null;

        if (!appState.eduData[abbr]) appState.eduData[abbr] = {};
        appState.eduData[abbr][year] = {
            spending_per_pupil:
                enroll && total ? (total * 1000) / enroll : null,
            AVG_MATH_4_SCORE: math,
            AVG_READING_4_SCORE: read,
            ENROLL: enroll,
            state: abbr,
        };
    });
}

export function getValue(abbr, year, metric) {
    return appState.eduData[abbr]?.[year]?.[METRICS[metric].col] ?? null;
}

export async function loadData() {
    const [topo, csv] = await Promise.all([
        d3.json(TOPO_URL),
        d3.csv(CSV_PATH),
    ]);

    appState.topoData = topo;
    processCSV(csv);
}
