/**
 * Unit tests for the Uber Promo Code Generator.
 * Run with: node tests/test.js
 */

'use strict';

const { generateCode, generateCodes, validateCode, PROMO_TYPES } = require('../src/generator.js');

let passed = 0;
let failed = 0;

function assert(condition, description) {
  if (condition) {
    console.log(`✓ PASS: ${description}`);
    passed++;
  } else {
    console.log(`✗ FAIL: ${description}`);
    failed++;
  }
}

// Test 1: Generate a single code
const code1 = generateCode();
assert(typeof code1 === 'string' && code1.startsWith('UBER-'), 'generateCode() returns a string starting with UBER-');

// Test 2: Code format validation regex
const regex = /^UBER-([A-Z0-9]{4,8})-([A-Z0-9]{4,8})-(\d)$/;
assert(regex.test(code1), 'Generated code matches expected format UBER-PREFIX-SUFFIX-DIGIT');

// Test 3: Validate a valid code
assert(validateCode(code1) === true, 'validateCode() returns true for a valid generated code');

// Test 4: Validate an invalid code
assert(validateCode('INVALID-CODE') === false, 'validateCode() returns false for an invalid code');

// Test 5: Generate multiple codes
const codes = generateCodes(5, 'EATS', 30);
assert(codes.length === 5, 'generateCodes(5) returns an array of 5 codes');
codes.forEach((code, idx) => {
  assert(validateCode(code), `Generated code ${idx + 1} is valid`);
});

// Test 6: Different promo types
const rideCode = generateCode('RIDE', 10);
const eatsCode = generateCode('EATS', 25);
const newUserCode = generateCode('NEWUSER', 50);
assert(rideCode.includes('RIDE'), 'RIDE type code contains RIDE');
assert(eatsCode.includes('EATS'), 'EATS type code contains EATS');
assert(newUserCode.includes('NEWU'), 'NEWUSER type code contains NEWU');

// Test 7: Error on invalid type
try {
  generateCode('INVALID', 10);
  assert(false, 'Should throw error for invalid type');
} catch (e) {
  assert(true, 'Throws error for invalid promo type');
}

// Test 8: Error on invalid discount
try {
  generateCode('RIDE', -5);
  assert(false, 'Should throw error for negative discount');
} catch (e) {
  assert(true, 'Throws error for negative discount');
}

// Test 9: Edge case - 0% discount
const zeroCode = generateCode('RIDE', 0);
assert(validateCode(zeroCode), 'Code with 0% discount is valid');

// Test 10: Edge case - 100% discount
const fullCode = generateCode('RIDE', 100);
assert(validateCode(fullCode), 'Code with 100% discount is valid');

// Summary
console.log(`\n=== Test Summary: ${passed} passed, ${failed} failed ===`);
if (failed > 0) {
  process.exit(1);
}
