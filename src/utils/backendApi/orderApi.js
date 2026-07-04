import customerClient from "./customerAuthApi";

/**
 * Customer order API — backend /api/orders.
 * Order shape: { id, customerId, orderDate, totalAmount, status, items: [{ product, quantity, unitPrice, discount }] }
 * Statuses: PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED
 */

export const getCustomerOrders = async (customerId, params = {}) => {
  const res = await customerClient.get(`/orders/customer/${customerId}`, {
    params: { page: params.page || 1, limit: params.limit || 10 },
  });
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await customerClient.get(`/orders/${id}`);
  return res.data;
};
