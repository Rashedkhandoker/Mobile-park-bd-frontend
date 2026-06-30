import { backendRequest } from "./index";

/**
 * Transform backend product shape → frontend ProductBox shape.
 */
const transformProduct = (p) => {
  const price = p.price ? parseFloat(p.price) : 0;
  const salePrice = p.discountPrice ? parseFloat(p.discountPrice) : price;
  const discount = price > 0 && salePrice < price
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const thumbnail = p.images?.[0]?.imageUrl || null;

  return {
    id: p.id,
    name: p.name || "",
    slug: p.slug,
    price,
    sale_price: salePrice,
    discount,
    sku: p.sku,
    quantity: p.stockQty ?? 0,
    stock_status: (p.stockQty ?? 0) > 0 ? "in_stock" : "out_of_stock",
    is_featured: p.featuredFlag ? 1 : 0,
    is_trending: p.newTrendsFlag ? 1 : 0,
    is_sale_enable: discount > 0 ? 1 : 0,
    status: 1,
    product_thumbnail: thumbnail ? { original_url: thumbnail } : null,
    brand: p.brand || null,
    categories: p.category ? [p.category] : [],
    description: p.description || "",
    short_description: p.description?.substring(0, 200) || "",
    images: (p.images || []).map((img) => ({
      id: img.id,
      original_url: img.imageUrl,
    })),
  };
};

const transformResponse = (res) => ({
  data: (res.data || []).map(transformProduct),
  total: res.meta?.total || 0,
  current_page: res.meta?.page || 1,
  last_page: Math.ceil((res.meta?.total || 0) / (res.meta?.limit || 10)),
  per_page: res.meta?.limit || 10,
});

export const getAllProducts = async (params = {}) => {
  const res = await backendRequest({
    url: "/products",
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      sortBy: params.sortBy || "createdAt",
      sortDir: params.sortDir || "desc",
      ...(params.name && { name: params.name }),
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.brandId && { brandId: params.brandId }),
      ...(params.minPrice && { minPrice: params.minPrice }),
      ...(params.maxPrice && { maxPrice: params.maxPrice }),
      ...(params.inStock !== undefined && { inStock: params.inStock }),
    },
  });
  return transformResponse(res);
};

export const getBestSellingProducts = async (params = {}) => {
  const res = await backendRequest({
    url: "/products/best-selling",
    params: { page: params.page || 1, limit: params.limit || 10 },
  });
  return transformResponse(res);
};

export const getNewTrendsProducts = async (params = {}) => {
  const res = await backendRequest({
    url: "/products/new-trends",
    params: { page: params.page || 1, limit: params.limit || 10 },
  });
  return transformResponse(res);
};

export const getFeaturedProducts = async (params = {}) => {
  const res = await backendRequest({
    url: "/products/featured",
    params: { page: params.page || 1, limit: params.limit || 10 },
  });
  return transformResponse(res);
};

export const getNewArrivalProducts = async (params = {}) => {
  const res = await backendRequest({
    url: "/products/new-arrivals",
    params: { page: params.page || 1, limit: params.limit || 10 },
  });
  return transformResponse(res);
};
