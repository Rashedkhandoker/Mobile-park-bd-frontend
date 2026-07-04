import { getTopBrands } from "@/utils/backendApi/brandApi";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useState } from "react";
import BrandIdsContext from ".";

const BrandIdsProvider = (props) => {
  const [getBrandIds, setGetBrandIds] = useState({});

  const { data: filteredBrand, isLoading } = useFetchQuery(
    ["brands", "top"],
    () => getTopBrands({ limit: 50 }),
    {
      refetchOnWindowFocus: false,
      select: (res) => res?.data || [],
    }
  );

  return (
    <BrandIdsContext.Provider value={{ ...props, filteredBrand: filteredBrand || [], setGetBrandIds, brandIdsLoader: isLoading }}>
      {props.children}
    </BrandIdsContext.Provider>
  );
};

export default BrandIdsProvider;
