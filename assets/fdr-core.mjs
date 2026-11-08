export function calculate({pinion, spur, internal, diameter}) {
  if (![pinion, spur, internal, diameter].every(n => Number.isFinite(n) && n > 0) || !Number.isInteger(pinion) || !Number.isInteger(spur)) return null;
  const fdr = spur / pinion * internal;
  const rollout = Math.PI * diameter / fdr;
  return Number.isFinite(fdr) && Number.isFinite(rollout) && fdr > 0 && rollout > 0 ? {fdr, rollout} : null;
}
export function candidates(spur, internal, target) {
  if (![spur, internal, target].every(n => Number.isFinite(n) && n > 0)) return [];
  const ideal = spur * internal / target;
  if (!Number.isFinite(ideal) || ideal < 1 || ideal > Number.MAX_SAFE_INTEGER) return [];
  return [...new Set([Math.floor(ideal), Math.ceil(ideal)])].map(pinion => ({pinion, fdr: spur / pinion * internal}));
}
