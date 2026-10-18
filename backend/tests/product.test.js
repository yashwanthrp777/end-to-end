const assert = require('assert');
const productService = require('../src/services/product.service');

async function runProductTests() {
  console.log('  Testing Product Service...');

  // Test 1: Fetch all products
  const res = await productService.getAllProducts({});
  assert(Array.isArray(res.products), 'Products should be an array');
  assert(res.products.length > 0, 'Products should not be empty');
  assert(res.total > 0, 'Total should be greater than zero');

  // Test 2: Search filter
  const searchRes = await productService.getAllProducts({ search: 'Headphones' });
  assert(searchRes.products.length > 0, 'Should find products matching Headphones');
  assert(searchRes.products.some(p => p.name.includes('Headphones')), 'Matched products should contain search term');

  // Test 3: Categories
  const categories = await productService.getCategories();
  assert(Array.isArray(categories), 'Categories should be an array');
  assert(categories.length >= 5, 'Should have at least 5 categories');

  console.log('  ✔ Product Service tests passed.');
}

module.exports = runProductTests;
