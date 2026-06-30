'use client';
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts, getProductBySlug, getProductsByIds, getProductsByCategory, getProductsByBrand } from "@/utils/services/productService";
import { getBestSellingProducts, getNewTrendsProducts, getNewArrivalProducts, getFeaturedProducts } from "@/utils/backendApi/productApi";
import useFetchQuery from "./useFetchQuery";

/**
 * Generic paginated + filtered product list.
 * data shape: { data: Product[], total, current_page, last_page, per_page }
 */
export const useProducts = (params = {}, options = {}) => {
  return useFetchQuery(
    ["products", params],
    () => getProducts(params),
    { refetchOnWindowFocus: false, ...options }
  );
};

/**
 * Single product by URL slug.
 * data shape: Product | null
 */
export const useProductBySlug = (slug, options = {}) => {
  return useFetchQuery(
    ["product", slug],
    () => getProductBySlug(slug),
    { enabled: !!slug, refetchOnWindowFocus: false, ...options }
  );
};

/**
 * Products filtered by a list of IDs.
 * data shape: Product[]  (already unwrapped from paginated response)
 */
export const useProductsByIds = (ids = [], extraParams = {}, options = {}) => {
  return useFetchQuery(
    ["products", "ids", ids],
    () => getProductsByIds(ids, extraParams),
    {
      enabled: !!(ids?.length),
      refetchOnWindowFocus: false,
      select: (res) => res.data,
      ...options,
    }
  );
};

/**
 * Products filtered by category ID(s).
 * data shape: Product[]  (already unwrapped)
 */
export const useProductsByCategory = (categoryIds, extraParams = {}, options = {}) => {
  const hasIds = Array.isArray(categoryIds) ? categoryIds.length > 0 : !!categoryIds;
  return useFetchQuery(
    ["products", "category", categoryIds, extraParams],
    () => getProductsByCategory(categoryIds, extraParams),
    {
      enabled: hasIds,
      refetchOnWindowFocus: false,
      select: (res) => res.data,
      ...options,
    }
  );
};

/**
 * Products filtered by brand slug.
 * data shape: { data: Product[], total, current_page, last_page, per_page }
 */
export const useProductsByBrand = (brandSlug, extraParams = {}, options = {}) => {
  return useFetchQuery(
    ["products", "brand", brandSlug, extraParams],
    () => getProductsByBrand(brandSlug, extraParams),
    { enabled: !!brandSlug, refetchOnWindowFocus: false, ...options }
  );
};

/**
 * Infinite-scroll product list.
 * Pass a stable getParams function: (page) => ({ category, sortBy, ... })
 * data shape: useInfiniteQuery result — access via data.pages[n]
 */
export const useInfiniteProducts = (getParams = () => ({}), options = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", getParams()],
    queryFn: ({ pageParam = 1 }) => getProducts({ ...getParams(), page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useFeaturedProducts = (params = {}, options = {}) => {
  return useFetchQuery(
    ["products", "featured", params],
    () => getFeaturedProducts(params),
    { refetchOnWindowFocus: false, select: (res) => res.data, ...options }
  );
};

export const useBestSellingProducts = (params = {}, options = {}) => {
  return useFetchQuery(
    ["products", "best-selling", params],
    () => getBestSellingProducts(params),
    { refetchOnWindowFocus: false, select: (res) => res.data, ...options }
  );
};

export const useNewTrendsProducts = (params = {}, options = {}) => {
  return useFetchQuery(
    ["products", "new-trends", params],
    () => getNewTrendsProducts(params),
    { refetchOnWindowFocus: false, select: (res) => res.data, ...options }
  );
};

export const useNewArrivalProducts = (params = {}, options = {}) => {
  return useFetchQuery(
    ["products", "new-arrivals", params],
    () => getNewArrivalProducts(params),
    { refetchOnWindowFocus: false, select: (res) => res.data, ...options }
  );
};
