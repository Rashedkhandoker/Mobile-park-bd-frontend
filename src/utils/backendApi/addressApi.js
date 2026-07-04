import customerClient from "./customerAuthApi";

/**
 * Customer address API — backend /api/addresses.
 * Address shape: { id, customerId, addressLine, city, region, postalCode, country }
 */

export const getCustomerAddresses = async (customerId) => {
  const res = await customerClient.get(`/addresses/customer/${customerId}`, {
    params: { limit: 50 },
  });
  return res.data;
};

export const createAddress = async (data) => {
  const res = await customerClient.post("/addresses", data);
  return res.data;
};

export const updateAddress = async (id, data) => {
  const res = await customerClient.put(`/addresses/${id}`, data);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await customerClient.delete(`/addresses/${id}`);
  return res.data;
};
