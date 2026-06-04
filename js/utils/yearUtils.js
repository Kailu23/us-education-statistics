export function getClosestYear (targetYear, availableYears) {
    return availableYears.reduce((closest, year) => {
        return Math.abs(year - targetYear) < Math.abs(closest - targetYear) ? year : closest;
    });
}
