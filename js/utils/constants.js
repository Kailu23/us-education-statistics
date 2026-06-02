export const TOPO_URL =
    "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
export const CSV_PATH = "./data/states_all.csv";

export const PALETTE = [
    "#58a6ff",
    "#3fb950",
    "#f78166",
    "#d2a8ff",
    "#e3b341",
    "#79c0ff",
    "#56d364",
    "#ffa657",
];

export const METRICS = {
    spending: {
        label: "Rashod po učeniku",
        format: (d) => "$" + d3.format(",.0f")(d),
        col: "spending_per_pupil",
        colors: d3.interpolateYlOrRd,
    },
    math: {
        label: "Prosj. matematika (4. razred)",
        format: (d) => d3.format(".1f")(d),
        col: "AVG_MATH_4_SCORE",
        colors: d3.interpolateBlues,
    },
    reading: {
        label: "Prosj. čitanje (4. razred)",
        format: (d) => d3.format(".1f")(d),
        col: "AVG_READING_4_SCORE",
        colors: d3.interpolateGreens,
    },
    enrollment: {
        label: "Broj učenika",
        format: (d) => d3.format(",.0f")(d),
        col: "ENROLL",
        colors: d3.interpolatePurples,
    },
};
