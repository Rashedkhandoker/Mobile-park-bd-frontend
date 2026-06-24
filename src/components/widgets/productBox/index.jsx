import ThemeOptionContext from "@/context/themeOptionsContext";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ProductBox1 from "./ProductBox1";
import ProductBox10 from "./ProductBox10";
import ProductBox11 from "./ProductBox11";
import ProductBox12 from "./ProductBox12";
import ProductBox2 from "./ProductBox2";
import ProductBox3 from "./ProductBox3";
import ProductBox4 from "./ProductBox4";
import ProductBox5 from "./ProductBox5";
import ProductBox6 from "./ProductBox6";
import ProductBox7 from "./ProductBox7";
import ProductBox8 from "./ProductBox8";
import ProductBox9 from "./ProductBox9";
import ProductBoxHorizontal from "./ProductBoxHorizontal";

const ProductBox = ({ style = "vertical", product, boxStyle }) => {
  const path = useSearchParams();
  const theme = path.get("theme");
  const { themeOption, setVariant, variant } = useContext(ThemeOptionContext);
  const [productState, setProductState] = useState({ product: product, attributeValues: [], productQty: 1, selectedVariation: "", variantIds: [] });

  useEffect(() => {
    if (product) {
      setProductState({ ...productState, product: product });
    }
  }, [product]);

  useEffect(() => {
      setVariant("product_box_two");
  }, []);

  return <>
  {style == "horizontal" ? <ProductBoxHorizontal productState={productState} setProductState={setProductState} style={boxStyle} /> : null}
  {style == "vertical" && variant == "product_box_two" ? <ProductBox2 productState={productState} /> : null}</>;
};

export default ProductBox;
