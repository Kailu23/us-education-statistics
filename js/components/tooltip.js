const tooltip = document.getElementById("tooltip");

export { tooltip };

export function showTooltip(name, label, value) {

    document.getElementById("tt-name")
        .textContent = name;

    document.getElementById("tt-label")
        .textContent = label;

    document.getElementById("tt-value")
        .textContent = value;

    tooltip.style.opacity = 1;
}

export function moveTooltip(event) {

    tooltip.style.left = event.clientX + 12 + "px";

    tooltip.style.top = event.clientY - 30 + "px";
}

export function hideTooltip() {
    tooltip.style.opacity = 0;
}
