const positive = n => Number.isFinite(n) && n > 0;
export function dischargeAmps(capacityMah, ratingC) {
  if (!positive(capacityMah) || !positive(ratingC)) return null;
  const result = capacityMah / 1000 * ratingC;
  return positive(result) ? result : null;
}
export function equivalentC(capacityMah, currentA) {
  if (!positive(capacityMah) || !positive(currentA)) return null;
  const result = currentA / (capacityMah / 1000);
  return positive(result) ? result : null;
}
