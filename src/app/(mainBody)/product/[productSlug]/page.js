import axios from "axios";

import ProductDetailContent from "@/components/productDetails";

const BACKEND_API = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateMetadata({ params }) {
  const product = await axios
    .get(`${BACKEND_API}/products/slug/${params?.productSlug}`)
    .then((res) => res?.data?.data)
    .catch(() => null);

  return {
    title: product?.name,
    description: product?.description?.substring(0, 160),
    images: [product?.thumbnailUrl || product?.images?.[0]?.imageUrl, []],
    openGraph: {},
  };
}

const ProductDetails = ({ params }) => {
  return <ProductDetailContent params={params?.productSlug} />;
};

export default ProductDetails;
