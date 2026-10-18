const assert = require('assert');
const authService = require('../src/services/auth.service');

async function runAuthTests() {
  console.log('  Testing Auth Service...');

  // Test 1: Register new user
  const email = `testuser_${Date.now()}@example.com`;
  const registerRes = await authService.register({
    name: 'Test Customer',
    email,
    password: 'Password123!',
    phone: '+1 555-0199'
  });

  assert(registerRes.user, 'Register response should contain user object');
  assert.strictEqual(registerRes.user.email, email);
  assert(registerRes.token, 'Register response should contain JWT token');

  // Test 2: Login with valid credentials
  const loginRes = await authService.login({
    email,
    password: 'Password123!'
  });
  assert(loginRes.token, 'Login response should contain JWT token');
  assert.strictEqual(loginRes.user.name, 'Test Customer');

  // Test 3: Reject invalid password
  let failed = false;
  try {
    await authService.login({ email, password: 'WrongPassword' });
  } catch (err) {
    failed = true;
  }
  assert(failed, 'Login should fail with invalid password');

  console.log('  ✔ Auth Service tests passed.');
}

module.exports = runAuthTests;
