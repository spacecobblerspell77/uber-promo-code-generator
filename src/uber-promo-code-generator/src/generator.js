/**
 * Uber Promo Code Generator
 * 
 * Generates realistic promo codes for Uber rides or Uber Eats.
 * Codes follow a pattern: UBER-XXXX-YYYY where XXXX is a prefix
 * based on the promotion type and YYYY is a check-digit suffix.
 */

'use strict';

/**
 * Valid promotion types for Uber codes.
 * @enum {string}
 */
const PROMO_TYPES = {
  RIDE: 'RIDE',
  EATS: 'EATS',
  GROCERY: 'GROCERY',
  NEW_USER: 'NEWUSER',
  REFERRAL: 'REFERRAL'
};

/**
 * Generates a random alphanumeric string of given length.
 * @param {number} length - Length of the string to generate.
 * @returns {string} Random alphanumeric string.
 */
function _randomAlphanumeric(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Computes a simple Luhn-like check digit for a code string.
 * @param {string} code - The code to compute check digit for.
 * @returns {number} A single digit 0-9.
 */
function _computeCheckDigit(code) {
  let sum = 0;
  let alternate = false;
  for (let i = code.length - 1; i >= 0; i--) {
    let digit = parseInt(code.charAt(i), 36); // treat alphanumeric as base-36
    if (alternate) {
      digit *= 2;
      if (digit > 35) {
        digit = digit - 35;
      }
    }
    sum += digit;
    alternate = !alternate;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Generates a single Uber promo code.
 * @param {string} [type='RIDE'] - Promotion type. One of PROMO_TYPES values.
 * @param {number} [discountPercent=20] - Discount percentage (0-100).
 * @returns {string} A formatted promo code like "UBER-RIDE-A3K9-7".
 */
function generateCode(type = 'RIDE', discountPercent = 20) {
  if (!Object.values(PROMO_TYPES).includes(type)) {
    throw new Error(`Invalid promo type: ${type}. Must be one of ${Object.values(PROMO_TYPES).join(', ')}`);
  }
  if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
    throw new Error('discountPercent must be a number between 0 and 100');
  }

  // Generate a 4-character segment based on type and discount
  const typePrefix = type.substring(0, 4).toUpperCase();
  const randomPart = _randomAlphanumeric(4);
  const codeBody = `UBER-${typePrefix}-${randomPart}`;
  const checkDigit = _computeCheckDigit(codeBody);
  
  return `${codeBody}-${checkDigit}`;
}

/**
 * Validates a promo code format and check digit.
 * @param {string} code - The promo code to validate.
 * @returns {boolean} True if the code is valid, false otherwise.
 */
function validateCode(code) {
  const regex = /^UBER-([A-Z0-9]{4,8})-([A-Z0-9]{4,8})-(\d)$/;
  const match = code.match(regex);
  if (!match) {
    return false;
  }
  const codeBody = `UBER-${match[1]}-${match[2]}`;
  const expectedDigit = _computeCheckDigit(codeBody);
  return parseInt(match[3], 10) === expectedDigit;
}

/**
 * Generates multiple promo codes.
 * @param {number} count - Number of codes to generate.
 * @param {string} [type='RIDE'] - Promotion type.
 * @param {number} [discountPercent=20] - Discount percentage.
 * @returns {string[]} Array of promo codes.
 */
function generateCodes(count = 1, type = 'RIDE', discountPercent = 20) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateCode(type, discountPercent));
  }
  return codes;
}

module.exports = {
  PROMO_TYPES,
  generateCode,
  generateCodes,
  validateCode
};
