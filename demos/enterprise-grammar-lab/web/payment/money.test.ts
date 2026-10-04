// Amount entry and display. Run with the backend tests: these are the only front-end functions
// where a wrong digit would be a wrong amount.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exponentOf, formatMoney, fromMinor, toMinor } from './money.ts';

test('toMinor reads the digits, not a float', () => {
  assert.equal(toMinor('4800.5', 'CNY'), 480050);
  assert.equal(toMinor('4800.50', 'CNY'), 480050);
  assert.equal(toMinor('4800', 'CNY'), 480000);
  assert.equal(toMinor('0.07', 'CNY'), 7);
  assert.equal(toMinor('0', 'CNY'), 0);
  assert.equal(toMinor(' 12.3 ', 'USD'), 1230);
  assert.equal(toMinor('007.10', 'CNY'), 710, 'leading zeros do not change the amount');
  // 0.1 + 0.2 style values that a float would get wrong
  assert.equal(toMinor('1.15', 'CNY'), 115);
  assert.equal(toMinor('8.03', 'CNY'), 803);
  assert.equal(toMinor('90071992547409.91', 'CNY'), 9007199254740991, 'the largest amount that is still an exact integer');
});

test('toMinor refuses what is not a plain amount', () => {
  for (const text of ['', '12.345', '-5', '1,000', '1e3', 'abc', '.5', '5.5.5', '１２']) {
    assert.equal(toMinor(text, 'CNY'), undefined, JSON.stringify(text));
  }
  assert.equal(toMinor('90071992547409.92', 'CNY'), undefined, 'beyond exact integers is refused, not rounded');
});

test('the smallest unit follows the currency', () => {
  assert.deepEqual([exponentOf('CNY'), exponentOf('USD'), exponentOf('JPY'), exponentOf('KWD')], [2, 2, 0, 3]);
  assert.equal(toMinor('1500', 'JPY'), 1500);
  assert.equal(toMinor('1500.5', 'JPY'), undefined);
  assert.equal(toMinor('1.234', 'KWD'), 1234);
  assert.equal(fromMinor(1500, 'JPY'), '1500');
  assert.equal(fromMinor(1234, 'KWD'), '1.234');
});

test('fromMinor and toMinor round-trip', () => {
  for (const minor of [0, 7, 70, 100, 480050, 48600000, 9007199254740991]) {
    assert.equal(toMinor(fromMinor(minor, 'CNY'), 'CNY'), minor);
  }
  assert.equal(fromMinor(7, 'CNY'), '0.07');
  assert.equal(fromMinor(480050, 'CNY'), '4800.50');
});

test('formatMoney shows the currency and never rounds', () => {
  assert.equal(formatMoney({ currency: 'CNY', minor: 48600000 }), '¥486,000.00');
  assert.equal(formatMoney({ currency: 'USD', minor: 2050000 }), 'US$20,500.00');
  assert.equal(formatMoney({ currency: 'CNY', minor: 1 }), '¥0.01');
});
