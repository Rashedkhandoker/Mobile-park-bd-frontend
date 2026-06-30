import axios from "axios";

const adminClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
});

adminClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export const adminLogin = async (email, password) => {
  const res = await adminClient.post("/auth/login", { email, password });
  return res.data;
};

export const adminLogout = async () => {
  try {
    await adminClient.post("/auth/logout");
  } finally {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  }
};

export const getAdminProfile = async () => {
  const res = await adminClient.get("/auth/profile");
  return res.data;
};

// Product CRUD
export const getProducts = async (params = {}) => {
  const res = await adminClient.get("/products", { params });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await adminClient.get(`/products/${id}/details`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await adminClient.post("/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await adminClient.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await adminClient.delete(`/products/${id}`);
  return res.data;
};

export const uploadProductThumbnail = async (productId, file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await adminClient.post(`/products/${productId}/thumbnail`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const uploadProductImage = async (productId, file, sortOrder) => {
  const formData = new FormData();
  formData.append("image", file);
  if (sortOrder !== undefined) formData.append("sortOrder", sortOrder);
  const res = await adminClient.post(`/products/${productId}/images/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductImage = async (productId, imageId) => {
  const res = await adminClient.delete(`/products/${productId}/images/${imageId}`);
  return res.data;
};

// Categories & Brands for dropdowns
export const getCategories = async (params = {}) => {
  const res = await adminClient.get("/categories", { params });
  return res.data;
};

export const getBrands = async (params = {}) => {
  const res = await adminClient.get("/brands", { params });
  return res.data;
};

export default adminClient;
