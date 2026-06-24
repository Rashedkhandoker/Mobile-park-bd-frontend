import React, { useEffect, useState } from 'react';
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { getProducts } from '@/utils/services/productService';
import allProductsJson from '@/app/api/product/product.json';
import ProductContext from '.';

const ProductProvider = (props) => {
  const [customProduct, setCustomProduct] = useState([]);
  const [totalDealIds, setTotalDealIds] = useState('');
  const [productAPIData, setProductAPIData] = useState({ data: [], refetchProduct: '', params: { ...totalDealIds }, productIsLoading: false });
  const {
    data: productData,
    refetch: productRefetch,
    isLoading: productIsLoading,
  } = useFetchQuery(
    ["dealProducts", totalDealIds],
    () => getProducts({ ...productAPIData.params, ids: totalDealIds, status: 1, paginate: Object.keys(totalDealIds).length > 5 ? Object.keys(totalDealIds).length : 5 }),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    if (productData) {
      setProductAPIData((prev) => ({ ...prev, data: productData, productIsLoading: productIsLoading }));
    }
  }, [productData]);

  const searchList = allProductsJson?.data ?? [];

  return (
    <ProductContext.Provider value={{ ...props, productAPIData, setProductAPIData, customProduct, setCustomProduct, totalDealIds, setTotalDealIds, productRefetch, productData, searchList }}>
      {props.children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;
