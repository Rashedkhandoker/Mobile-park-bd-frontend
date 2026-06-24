import { getProducts } from "@/utils/services/productService";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useEffect, useState } from "react";
import ProductIdsContext from ".";

const ProductIdsProvider = (props) => {
  const [getProductIds, setGetProductIds] = useState({});
  const [filteredProduct, setFilteredProduct] = useState([]);
  const { data, refetch, isLoading, isRefetching } = useFetchQuery(
    ["productIds", getProductIds?.ids],
    () => getProducts({ ...getProductIds, status: 1, paginate: getProductIds?.ids?.length }),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      select: (res) => res?.data,
    }
  );

  useEffect(() => {
    Object.keys(getProductIds).length > 0 && refetch();
  }, [getProductIds?.ids]);

  useEffect(() => {
    if (data) {
      setFilteredProduct((prev) => data);
    }
  }, [isLoading, getProductIds]);

  return <ProductIdsContext.Provider value={{ ...props, filteredProduct, setGetProductIds, isLoading, isRefetching }}>{props.children}</ProductIdsContext.Provider>;
};

export default ProductIdsProvider;
