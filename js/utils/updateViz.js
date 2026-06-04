import { updateMap } from '../components/map.js';
import { updateScatter } from '../components/scatter.js';
import { updateLineChart } from '../components/lineChart.js';

export function updateViz() {
    updateMap();
    updateScatter();
    updateLineChart();
}
