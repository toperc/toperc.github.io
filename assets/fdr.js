import {calculate, candidates} from './fdr-core.mjs';
const app = document.querySelector('[data-fdr-app]');
if (app) {
  const en = document.documentElement.lang === 'en';
  const t = (es, english) => en ? english : es;
  const fmt = n => new Intl.NumberFormat(en ? 'en' : 'es', {maximumFractionDigits: 2}).format(n);
  const invalid = t('Introduce valores positivos y dientes enteros en todos los campos de la configuración.', 'Enter positive values and whole tooth counts in every setup field.');
  const form = app.querySelector('form');
  const read = key => Object.fromEntries(['pinion','spur','internal','diameter'].map(field => [field, document.getElementById(`${key}-${field}`).valueAsNumber]));
  const put = (id, text) => { document.getElementById(id).textContent = text; };
  const options = list => list.length ? list.map(({pinion, fdr}) => `${pinion}T → FDR ${fmt(fdr)}`).join(' / ') : t('No hay un piñón entero válido que encierre ese objetivo.', 'No valid whole-tooth pinions bracket this target.');
  function update() {
    const a = read('current'), b = read('proposed');
    const current = calculate(a), proposed = calculate(b);
    for (const [key, result] of [['current', current], ['proposed', proposed]]) {
      put(`${key}-result`, result ? `FDR ${fmt(result.fdr)}:1 · ${t('Avance', 'Rollout')} ${fmt(result.rollout)} mm/${t('vuelta del motor', 'motor revolution')}` : invalid);
    }
    if (current && proposed) {
      const change = (proposed.rollout / current.rollout - 1) * 100;
      const delta = (proposed.fdr / current.fdr - 1) * 100;
      put('fdr-comparison', `FDR: ${delta > 0 ? '+' : ''}${fmt(delta)} %. ${t('Avance por vuelta', 'Rollout')}: ${change > 0 ? '+' : ''}${fmt(change)} %. ${Math.abs(change) < 1e-8 ? t('Desarrollo equivalente.', 'Equivalent gearing.') : change > 0 ? t('Desarrollo más largo: más distancia por vuelta del motor.', 'Taller gearing: more distance per motor revolution.') : t('Desarrollo más corto: menos distancia por vuelta del motor.', 'Shorter gearing: less distance per motor revolution.')}`);
      const target = Math.PI * b.diameter / current.rollout;
      put('fdr-compensate', `${t('FDR necesario', 'Required FDR')}: ${fmt(target)}. ${options(candidates(b.spur, b.internal, target))}`);
    } else {
      put('fdr-comparison', invalid); put('fdr-compensate', invalid);
    }
    const target = document.getElementById('target-fdr').valueAsNumber;
    put('fdr-target', proposed && Number.isFinite(target) && target > 0 ? options(candidates(b.spur, b.internal, target)) : t('Revisa la configuración propuesta y el FDR objetivo.', 'Check the proposed setup and target FDR.'));
  }
  form.addEventListener('input', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
