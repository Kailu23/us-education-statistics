import { appState } from "./state.js";
import { CSV_TO_ABBR } from "./utils/mappings.js";
import { METRICS, TOPO_URL, CSV_PATH } from "./utils/constants.js";

export function normalizeEducationData(rows) {
    rows.forEach((row) => {
        const stateName = row.STATE
            ?.trim()
            ?.replaceAll("_", " ")
            ?.toUpperCase();

        const abbr = CSV_TO_ABBR[stateName];
        if (!abbr) {
            return;
        }
        const year = +row.YEAR;
        if (year < 2001 || year > 2016) return;
        const enrollment = +row.ENROLL || null;
        const spending = +row.TOTAL_EXPENDITURE || null;
        const math = +row.AVG_MATH_4_SCORE || null;
        const reading = +row.AVG_READING_4_SCORE || null;

        saveRecord(
            abbr,
            year,
            {
                spending,
                math,
                reading,
                enrollment,
            }
        )
    });
}

function saveRecord(
    abbr,
    year,
    {
        spending,
        math,
        reading,
        enrollment,
    }
) {
    if (!appState.eduData[abbr]) appState.eduData[abbr] = {};
    appState.eduData[abbr][year] = {
        spending_per_pupil: enrollment && spending ? (spending * 1000) / enrollment : null,
        AVG_MATH_4_SCORE: math,
        AVG_READING_4_SCORE: reading,
        ENROLL: enrollment,
        state: abbr,
    };
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
    normalizeEducationData(csv);
}

export function getAvailableYears(metric) {
    const years = new Set();

    Object.values(appState.eduData).forEach((stateData) => {
        Object.entries(stateData).forEach(([year, record]) => {
            const value = record?.[METRICS[metric].col];

            if (value !== null && value !== undefined) {
                years.add(+year);
            }
        });
    });

    return [...years].sort((a, b) => a - b);
}
