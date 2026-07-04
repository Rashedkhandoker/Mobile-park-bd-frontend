/**
 * Product Service — single swap point for all product data fetching.
 *
 * All data comes from the backend API (see @/utils/backendApi/productApi).
 * Category and brand slugs use dedicated backend endpoints; filters the API
 * doesn't understand yet (ids, category_ids, store_slug) are applied
 * client-side on the fetched product list.
 */

import {
  getAllProducts,
  getProductBySlugFromApi,
  getProductsByCategorySlug,
} from "@/utils/backendApi/productApi";
import { getBrandBySlug } from "@/utils/backendApi/brandApi";

// ─── legacy → backend sort mapping ───────────────────────────────────────────

const SORT_MAP = {
  asc: { sortBy: "createdAt", sortDir: "asc" },
  desc: { sortBy: "createdAt", sortDir: "desc" },
  "a-z": { sortBy: "name", sortDir: "asc" },
  "z-a": { sortBy: "name", sortDir: "desc" },
  "low-high": { sortBy: "price", sortDir: "asc" },
  "high-low": { sortBy: "price", sortDir: "desc" },
};

// Filters the backend can't do server-side yet — presence forces a fetch of
// the full list followed by client-side filtering + paging.
const CLIENT_FILTER_KEYS = ["ids", "category_ids", "trending", "store_slug"];

const filterProducts = (all, params = {}) => {
  let list = [...all];

  if (params.category_ids) {
    const ids = String(params.category_ids).split(",");
    list = list.filter((p) => p.categories?.some((c) => ids.includes(String(c.id))));
  }
  if (params.ids) {
    const ids = String(params.ids).split(",");
    list = list.filter((p) => ids.includes(String(p.id)));
  }
  if (params.search) {
    const q = String(params.search).toLowerCase();
    list = list.filter((p) => p.name?.toLowerCase().includes(q));
  }
  if (params.trending) {
    list = list.filter((p) => p.is_trending == 1 || p.is_trending === true);
  }

  return list;
};

const paginateList = (list, page = 1, perPage = 25) => {
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
  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.paginate) || 25;
  const sort = SORT_MAP[params.sortBy] || {};

  const needsClientFilter = CLIENT_FILTER_KEYS.some(
    (k) => params[k] != null && params[k] !== ""
  );

  if (!needsClientFilter) {
    // Category slug → dedicated backend endpoint.
    if (params.category) {
      const slug = String(params.category).split(",")[0];
      return getProductsByCategorySlug(slug, { page, limit: perPage, ...sort });
    }

    // Brand slug → resolve to id, then filter server-side.
    let brandId;
    if (params.brand) {
      const brand = await getBrandBySlug(String(params.brand).split(",")[0]);
      brandId = brand?.id;
    }

    return getAllProducts({
      page,
      limit: perPage,
      ...sort,
      ...(params.search && { name: params.search }),
      ...(brandId && { brandId }),
    });
  }

  // Unsupported filter present: pull the full list, filter and page locally.
  const res = await getAllProducts({ page: 1, limit: 100, ...sort });
  const filtered = filterProducts(res.data, params);
  return paginateList(filtered, page, perPage);
};

/**
 * Fetch a single product by its URL slug.
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export const getProductBySlug = async (slug) => {
  return getProductBySlugFromApi(slug);
};

/**
 * Fetch products matching a list of IDs.
 * @param {(string|number)[]} ids
 * @param {object} extraParams
 * @returns {Promise<{data: object[], total: number, ...}>}
 */
export const getProductsByIds = async (ids = [], extraParams = {}) => {
  if (!ids?.length) return paginateList([], 1, 25);
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
