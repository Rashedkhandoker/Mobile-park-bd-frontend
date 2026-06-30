import NoDataFound from "@/components/widgets/NoDataFound";
import ProductBox from "@/components/widgets/productBox";
import React from "react";
import Slider from "react-slick";
import { Row } from "reactstrap";

/**
 * Renders a product section from an API hook (no product IDs needed).
 * Drop-in replacement for HomeProduct when data comes from backend endpoints.
 */
const HomeProductAPI = ({ useHook, hookParams = {}, style = "vertical", slider = false, sliderOptions, classForVertical, rowClass }) => {
  const { data: products, isLoading } = useHook(hookParams);

  const sliderSettingMain = sliderOptions && sliderOptions(products?.length || 0);

  if (isLoading) return null;

  return (
    <>
      {style === "vertical" ? (
        slider ? (
          <div className={`product-4 ${classForVertical || ""}`}>
            {products?.length ? (
              <Slider {...sliderSettingMain}>
                {products.map((product, index) => (
                  <div key={index}>
                    <div className={classForVertical}>
                      <ProductBox product={product} style={style} />
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <NoDataFound title="NoProductFound" customClass="no-data-added" />
            )}
          </div>
        ) : (
          <>
            <Row className={rowClass || "row-cols-xl-4 row-cols-md-3 row-cols-2 g-sm-4 g-3 m-0"}>
              {products?.map((product, index) => (
                <div key={index} className={classForVertical}>
                  <ProductBox product={product} style={style} />
                </div>
              ))}
            </Row>
            {products?.length === 0 && <NoDataFound title="NoProductFound" customClass="no-data-added" />}
          </>
        )
      ) : null}
    </>
  );
};

export default HomeProductAPI;
