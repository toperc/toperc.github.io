import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate, candidates} from '../assets/fdr-core.mjs';
test('FDR and rollout use internal reduction and tyre diameter', () => {
 const result = calculate({pinion:20,spur:80,internal:2.6,diameter:65});
 assert.equal(result.fdr,10.4);
 assert.ok(Math.abs(result.rollout - Math.PI * 65 / 10.4) < 1e-10);
});
test('invalid, fractional tooth counts and empty inputs are rejected', () => {
 for (const value of [0,-1,NaN,Infinity,1.5]) assert.equal(calculate({pinion:value,spur:80,internal:2.6,diameter:65}),null);
});
test('target is bracketed by neighbouring pinions, exact match deduplicated', () => {
 assert.deepEqual(candidates(80,2.6,10).map(x=>x.pinion),[20,21]);
 assert.deepEqual(candidates(80,2.6,10.4).map(x=>x.pinion),[20]);
 assert.deepEqual(candidates(1,1,5),[]);
});
test('larger tyres need proportionally higher FDR to preserve rollout', () => {
 const a=calculate({pinion:20,spur:80,internal:2.6,diameter:65});
 const target=Math.PI*78/a.rollout;
 assert.ok(Math.abs(target-12.48)<1e-10);
 const b=calculate({pinion:20,spur:80,internal:3.12,diameter:78});
 assert.ok(Math.abs(a.rollout-b.rollout)<1e-10);
});
