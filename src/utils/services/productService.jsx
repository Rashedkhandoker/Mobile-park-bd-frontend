/**
 * Product Service — single swap point for all product data fetching.
 *
 * HOW TO SWITCH TO A REAL API:
 * Replace every function body below with the matching axios call.
 * Nothing else in the project needs to change.
 *
 * Real-API version of each function is shown at the bottom of this file.
 */

import productData from "@/app/api/product/product.json";
import { getProductBySlugFromApi } from "@/utils/backendApi/productApi";

// ─── internal helpers (mirrors route.js logic) ───────────────────────────────

const sortProducts = (products, sortBy) => {
  const list = [...products];
  switch (sortBy) {
    case "asc":       return list.sort((a, b) => a.id - b.id);
    case "desc":      return list.sort((a, b) => b.id - a.id);
    case "a-z":       return list.sort((a, b) => a.name.localeCompare(b.name));
    case "z-a":       return list.sort((a, b) => b.name.localeCompare(a.name));
    case "low-high":  return list.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    case "high-low":  return list.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    default:          return list;
  }
};

const filterProducts = (all, params = {}) => {
  let list = [...all];

  if (params.category) {
    const cats = params.category.split(",");
    list = list.filter((p) => p.categories?.some((c) => cats.includes(c.slug)));
  }
  if (params.brand) {
    const brands = params.brand.split(",");
    list = list.filter((p) => p.brand?.slug && brands.includes(p.brand.slug));
  }
  if (params.category_ids) {
    const ids = String(params.category_ids).split(",");
    list = list.filter((p) => p.categories?.some((c) => ids.includes(String(c.id))));
  }
  if (params.ids) {
    const ids = String(params.ids).split(",");
    list = list.filter((p) => ids.includes(String(p.id)));
  }
  if (params.store_slug) {
    const slugs = params.store_slug.split(",");
    list = list.filter((p) => p.store?.slug && slugs.includes(p.store.slug));
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (params.trending) {
    list = list.filter((p) => p.is_trending == 1 || p.is_trending === true);
  }
  if (params.status != null) {
    list = list.filter((p) => p.status == params.status);
  }
  if (params.sortBy) {
    list = sortProducts(list, params.sortBy);
  }

  return list;
};

const paginate = (list, page = 1, perPage = 25) => {
  const total = list.length;
  const start = (page - 1) * perPage;
  return {
    data: list.slice(start, start + perPage),
    total,
    current_page: page,
    last_page: Math.ceil(total / perPage) || 1,
    per_page: perPage,
  };
};

// ─── public service functions ─────────────────────────────────────────────────

/**
 * Fetch a paginated, filtered, sorted product list.
 * @param {object} params - category, brand, ids, search, sortBy, page, paginate, status, trending, store_slug, category_ids
 * @returns {Promise<{data: object[], total: number, current_page: number, last_page: number, per_page: number}>}
 */
export const getProducts = async (params = {}) => {
  const all = productData.data ?? [];
  const filtered = filterProducts(all, params);
  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.paginate) || 25;
  return Promise.resolve(paginate(filtered, page, perPage));
};

/**
 * Fetch a single product by its URL slug.
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export const getProductBySlug = async (slug) => {
  try {
    const product = await getProductBySlugFromApi(slug);
    if (product) return product;
  } catch {
    // fallback to static data
  }
  const product = productData.data?.find((p) => p.slug === slug) ?? null;
  return Promise.resolve(product);
};

/**
 * Fetch products matching a list of IDs.
 * @param {(string|number)[]} ids
 * @param {object} extraParams
 * @returns {Promise<{data: object[], total: number, ...}>}
 */
export const getProductsByIds = async (ids = [], extraParams = {}) => {
  if (!ids?.length) return Promise.resolve(paginate([], 1, 25));
  const idStr = Array.isArray(ids) ? ids.join(",") : ids;
  return getProducts({ ...extraParams, ids: idStr, paginate: ids?.length || 25 });
};

/**
 * Fetch products belonging to one or more category IDs.
 * @param {(string|number)|(string|number)[]} categoryIds
 * @param {object} extraParams
 * @returns {Promise<{data: object[], total: number, ...}>}
 */
export const getProductsByCategory = async (categoryIds, extraParams = {}) => {
  const ids = Array.isArray(categoryIds) ? categoryIds.join(",") : categoryIds;
  return getProducts({ ...extraParams, category_ids: ids });
};

/**
 * Fetch products belonging to a brand slug.
 * @param {string} brandSlug
 * @param {object} extraParams
 * @returns {Promise<{data: object[], total: number, ...}>}
 */
export const getProductsByBrand = async (brandSlug, extraParams = {}) => {
  return getProducts({ ...extraParams, brand: brandSlug });
};

// ─── REAL API SWAP ────────────────────────────────────────────────────────────
// When you're ready to connect a real backend, replace the bodies above with:
//
// import request from "@/utils/axiosUtils";
// import { ProductAPI } from "@/utils/axiosUtils/API";
//
// export const getProducts = async (params = {}) => {
//   const res = await request({ url: ProductAPI, params });
//   return res.data;
// };
//
// export const getProductBySlug = async (slug) => {
//   const res = await request({ url: `${ProductAPI}/${slug}` });
//   return res.data;
// };
//
// export const getProductsByIds = async (ids = [], extraParams = {}) => {
//   return getProducts({ ...extraParams, ids: ids.join(","), paginate: ids.length });
// };
//
// export const getProductsByCategory = async (categoryIds, extraParams = {}) => {
//   const ids = Array.isArray(categoryIds) ? categoryIds.join(",") : categoryIds;
//   return getProducts({ ...extraParams, category_ids: ids });
// };
//
// export const getProductsByBrand = async (brandSlug, extraParams = {}) => {
//   return getProducts({ ...extraParams, brand: brandSlug });
// };
