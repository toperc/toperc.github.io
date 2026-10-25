import test from 'node:test';
import assert from 'node:assert/strict';
import {dischargeAmps, equivalentC} from '../assets/battery-c-core.mjs';
test('manufacturer examples: 20C 430mAh and 30C 5000mAh', () => {
 assert.equal(dischargeAmps(430,20),8.6);
 assert.equal(dischargeAmps(5000,30),150);
});
test('inverse calculation and fractional capacities', () => {
 assert.equal(equivalentC(5000,100),20);
 assert.ok(Math.abs(equivalentC(430,8.6)-20)<1e-10);
 assert.equal(dischargeAmps(250.5,2),0.501);
});
test('invalid input and overflow never produce misleading results', () => {
 for (const fn of [dischargeAmps,equivalentC]) {
  for (const n of [0,-1,NaN,Infinity,undefined,null]) {
   assert.equal(fn(n,50),null); assert.equal(fn(5000,n),null);
  }
 }
 assert.equal(dischargeAmps(1e308,1e308),null);
 assert.equal(equivalentC(Number.MIN_VALUE,100),null);
});
