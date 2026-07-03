import axios from "axios";
import Cookies from "js-cookie";

/**
 * Customer auth client — hits the backend /api/customers/* endpoints.
 * withCredentials so the HTTP-only customerRefreshToken cookie is set/sent.
 */
const customerClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
});

customerClient.interceptors.request.use((config) => {
  const token = Cookies.get("uat");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** POST /customers/login → { success, data: { token, customer } } */
export const loginCustomer = async (email, password) => {
  const res = await customerClient.post("/customers/login", { email, password });
  return res.data;
};

/** POST /customers/register */
export const registerCustomer = async (data) => {
  const res = await customerClient.post("/customers/register", data);
  return res.data;
};

/** GET /customers/profile (requires Bearer token) */
export const getCustomerProfile = async () => {
  const res = await customerClient.get("/customers/profile");
  return res.data;
};

/** POST /customers/logout */
export const logoutCustomer = async () => {
  const res = await customerClient.post("/customers/logout");
  return res.data;
};

/** POST /customers/email/verify */
export const verifyCustomerEmail = async (token) => {
  const res = await customerClient.post("/customers/email/verify", { token });
  return res.data;
};

/** PUT /customers/profile (requires Bearer token) */
export const updateCustomerProfile = async (data) => {
  const res = await customerClient.put("/customers/profile", data);
  return res.data;
};

/** POST /customers/change-password (requires Bearer token) */
export const changeCustomerPassword = async (currentPassword, newPassword, confirmPassword) => {
  const res = await customerClient.post("/customers/change-password", {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return res.data;
};

/** POST /customers/password/forgot — always returns success (no email enumeration) */
export const customerForgotPassword = async (email) => {
  const res = await customerClient.post("/customers/password/forgot", { email });
  return res.data;
};

/** POST /customers/password/verify-token */
export const verifyResetToken = async (token) => {
  const res = await customerClient.post("/customers/password/verify-token", { token });
  return res.data;
};

/** POST /customers/password/reset */
export const resetCustomerPassword = async (token, newPassword, confirmPassword) => {
  const res = await customerClient.post("/customers/password/reset", {
    token,
    newPassword,
    confirmPassword,
  });
  return res.data;
};

export default customerClient;
