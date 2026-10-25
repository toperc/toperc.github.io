import {dischargeAmps, equivalentC} from './battery-c-core.mjs';
const app = document.querySelector('[data-c-app]');
if (app) {
  const en = document.documentElement.lang === 'en';
  const t = (es, english) => en ? english : es;
  const number = new Intl.NumberFormat(en ? 'en' : 'es', {maximumSignificantDigits: 6});
  const read = id => document.getElementById(id).valueAsNumber;
  const put = (id, value) => {document.getElementById(id).textContent = value;};
  const invalid = t('Introduce números positivos válidos.', 'Enter valid positive numbers.');
  const form = app.querySelector('form');
  function update() {
    const capacity = read('c-capacity'), continuous = read('c-continuous'), burst = read('c-burst');
    const amps = dischargeAmps(capacity, continuous);
    put('c-amps', amps === null ? invalid : `${number.format(amps)} A · ${t('descarga continua nominal', 'nominal continuous discharge')}`);
    const burstField = document.getElementById('c-burst');
    if (burstField.value === '' && !burstField.validity.badInput) put('c-burst-result', '');
    else {
      const peak = dischargeAmps(capacity, burst);
      put('c-burst-result', peak === null ? invalid : burst < continuous ? t('Revisa la etiqueta: los C de pico no deben ser inferiores a los continuos.', 'Check the label: burst C should not be lower than continuous C.') : `${number.format(peak)} A · ${t('descarga de pico nominal', 'nominal burst discharge')}`);
    }
    const required = equivalentC(read('c-inverse-capacity'), read('c-current'));
    put('c-required', required === null ? invalid : `${number.format(required)} C · ${t('equivalencia matemática', 'mathematical equivalent')}`);
  }
  form.addEventListener('input', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => setTimeout(update, 0));
  update();
}
