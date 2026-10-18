const assert = require('assert');
const orderService = require('../src/services/order.service');

async function runOrderTests() {
  console.log('  Testing Order Service...');

  // Test 1: Place an order
  const orderRes = await orderService.createOrder(2, {
    shipping: {
      fullName: 'Sarah Jenkins',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      phone: '+1 555-0189'
    },
    paymentMethod: 'card_test',
    items: [
      { product_id: 1, quantity: 1 }
    ]
  });

  assert(orderRes.order, 'Should return created order');
  assert(orderRes.order.order_number.startsWith('ORD-'), 'Order number should start with ORD-');
  assert.strictEqual(orderRes.order.status, 'pending');
  assert.strictEqual(orderRes.order.payment_status, 'paid');

  // Test 2: Cancel pending order
  const cancelledOrder = await orderService.cancelOrder(2, orderRes.order.id);
  assert.strictEqual(cancelledOrder.status, 'cancelled', 'Order status should be updated to cancelled');

  console.log('  ✔ Order Service tests passed.');
}

module.exports = runOrderTests;
