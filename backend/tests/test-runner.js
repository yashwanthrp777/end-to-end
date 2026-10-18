const { initDB } = require('../src/config/db');
const runAuthTests = require('./auth.test');
const runProductTests = require('./product.test');
const runOrderTests = require('./order.test');

async function main() {
  console.log('\n=======================================');
  console.log(' Running CloudCart Backend Test Suite');
  console.log('=======================================\n');

  try {
    await initDB();
    await runAuthTests();
    await runProductTests();
    await runOrderTests();
    console.log('\n✨ ALL BACKEND TESTS PASSED SUCCESSFULLY! ✨\n');
  } catch (err) {
    console.error('\n❌ Test suite failed:\n', err);
    process.exit(1);
  }
}

main();
