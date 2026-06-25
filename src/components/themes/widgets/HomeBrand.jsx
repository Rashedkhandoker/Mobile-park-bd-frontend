import NoDataFound from "@/components/widgets/NoDataFound";
import BrandIdsContext from "@/context/brandIdsContext";
import { BrandSlider } from "@/data/sliderSetting/SliderSetting";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Col, Container, Row } from "reactstrap";

const POPULAR_COUNT = 10;

const HomeBrand = ({ bgLight, brandIds, sliderOptions }) => {
  const { setGetBrandIds, filteredBrand } = useContext(BrandIdsContext);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (brandIds?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(brandIds))?.join(",") });
    }
  }, [brandIds]);

  if (!filteredBrand?.length) return <NoDataFound customClass="no-data-added" title="NoBrandFound" />;

  const popularBrands = filteredBrand.slice(0, POPULAR_COUNT);
  const brandMainSettings = sliderOptions && sliderOptions(popularBrands?.length);
  const brandSliderOption = brandMainSettings ? brandMainSettings : BrandSlider(popularBrands?.length);

  return (
    <>
      <Container>
        <div className={`row ${bgLight ? "bg-light" : ""}`}>
          {/* Popular brands — slider */}
          <div className="brand-slider-box no-arrow">
            <Slider {...brandSliderOption}>
              {popularBrands?.map((item, index) => (
                <div key={index} className="logo-block">
                  <Link href={`/brand/${item?.slug}`}>
                    {item.brand_image?.original_url
                      ? <img src={item.brand_image?.original_url} alt="" className="img-fluid" />
                      : <h4>{item?.name}</h4>}
                  </Link>
                </div>
              ))}
            </Slider>
          </div>

          {/* All brands — flat grid */}
          {showAll && (
            <div className="brand-slider-box no-arrow mt-2">
            <Row className="g-3 justify-content-center brand-all-grid">
              {filteredBrand.map((item, index) => (
                <Col key={index} xs="4" sm="3" md="2">
                  <div className="logo-block">
                    <Link href={`/brand/${item?.slug}`}>
                      {item.brand_image?.original_url
                        ? <img src={item.brand_image?.original_url} alt="" className="img-fluid" />
                        : <h4>{item?.name}</h4>}
                    </Link>
                  </div>
                </Col>
              ))}
            </Row>
            </div>
          )}
        </div>

        {filteredBrand.length > POPULAR_COUNT && (
          <div className="text-center mt-3">
            <button className="btn btn-outline theme-btn" onClick={() => setShowAll(v => !v)}>
              {showAll ? "Show Less" : `Show All Brands (${filteredBrand.length})`}
            </button>
          </div>
        )}
      </Container>
    </>
  );
};

export default HomeBrand;
