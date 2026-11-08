import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../assets/language.js', import.meta.url), 'utf8');
function visit({ path = '/blog/', search = '', hash = '', saved, blocked = false, base = '' } = {}) {
  const storage = new Map(saved ? [['toperc-language', saved]] : []);
  const links = ['es', 'en'].map((lang) => ({
    href: 'https://example.test' + base + (lang === 'en' ? '/en' : '') + path,
    dataset: { languageLink: lang },
    addEventListener(name, handler) { this[name] = handler; }
  }));
  const location = { pathname: base + path, search, hash, replace(url) { this.redirect = url; } };
  runInNewContext(source, {
    URL, window: { location },
    document: { querySelectorAll: () => links, documentElement: { dataset: { spanishHome: base + '/' } } },
    localStorage: {
      getItem(key) { if (blocked) throw Error('blocked'); return storage.get(key); },
      setItem(key, value) { if (blocked) throw Error('blocked'); storage.set(key, value); }
    }
  });
  return { links, location, storage };
}

test('switches the same page with filters and hash, and remembers the choice', () => {
  const { links, storage } = visit({ search: '?marca=mjx&q=Hyper', hash: '#archive-list' });
  links[1].click();
  assert.equal(links[1].href, 'https://example.test/en/blog/?marca=mjx&q=Hyper#archive-list');
  assert.equal(storage.get('toperc-language'), 'en');
});
test('includes filters changed after page load', () => {
  const { links, location } = visit();
  location.search = '?marca=wltoys&tipo=review';
  links[1].click();
  assert.match(links[1].href, /\?marca=wltoys&tipo=review$/);
});
test('a saved English preference applies on home only', () => {
  assert.equal(visit({ path: '/', saved: 'en' }).location.redirect, 'https://example.test/en/');
  assert.equal(visit({ saved: 'en' }).location.redirect, undefined);
  assert.equal(visit({ path: '/', saved: 'es' }).location.redirect, undefined);
});
test('Spanish selection overrides a previous English choice', () => {
  const { links, storage } = visit({ saved: 'en' });
  links[0].click();
  assert.equal(storage.get('toperc-language'), 'es');
});
test('both language links work when localStorage is blocked', () => {
  const { links, location } = visit({ path: '/', blocked: true });
  assert.doesNotThrow(() => links[1].click());
  assert.equal(location.redirect, undefined);
  assert.equal(links[1].href, 'https://example.test/en/');
});
test('supports a deployment beneath a baseurl', () => {
  const { location } = visit({ path: '/', base: '/preview', saved: 'en' });
  assert.equal(location.redirect, 'https://example.test/preview/en/');
});
