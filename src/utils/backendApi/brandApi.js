import { backendRequest } from "./index";

export const getAllBrands = async (params = {}) => {
  const res = await backendRequest({
    url: "/brands",
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      sortBy: params.sortBy || "name",
      sortDir: params.sortDir || "asc",
      ...(params.name && { name: params.name }),
    },
  });
  return res;
};

export const getTopBrands = async (params = {}) => {
  const res = await backendRequest({
    url: "/brands/top",
    params: { page: params.page || 1, limit: params.limit || 20 },
  });
  return res;
};

export const getBrandBySlug = async (slug) => {
  const res = await backendRequest({ url: `/brands/slug/${slug}` });
  return res?.data || null;
};
