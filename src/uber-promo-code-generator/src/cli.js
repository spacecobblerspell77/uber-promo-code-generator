/**
 * CLI entry point for the Uber Promo Code Generator.
 * Usage: node src/cli.js [count] [type] [discountPercent]
 * Example: node src/cli.js 5 EATS 30
 */

'use strict';

const { generateCodes, PROMO_TYPES } = require('./generator.js');

/**
 * Parses command line arguments and outputs generated codes.
 */
function main() {
  const args = process.argv.slice(2);
  
  let count = 1;
  let type = 'RIDE';
  let discountPercent = 20;

  if (args.length >= 1) {
    count = parseInt(args[0], 10);
    if (isNaN(count) || count < 1) {
      console.error('Error: count must be a positive integer.');
      process.exit(1);
    }
  }
  if (args.length >= 2) {
    const inputType = args[1].toUpperCase();
    if (Object.values(PROMO_TYPES).includes(inputType)) {
      type = inputType;
    } else {
      console.error(`Error: Invalid type. Valid types: ${Object.values(PROMO_TYPES).join(', ')}`);
      process.exit(1);
    }
  }
  if (args.length >= 3) {
    discountPercent = parseInt(args[2], 10);
    if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      console.error('Error: discountPercent must be between 0 and 100.');
      process.exit(1);
    }
  }

  try {
    const codes = generateCodes(count, type, discountPercent);
    console.log(`Generated ${count} Uber ${type} promo code(s) with ${discountPercent}% discount:`);
    codes.forEach((code, index) => {
      console.log(`${index + 1}. ${code}`);
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
