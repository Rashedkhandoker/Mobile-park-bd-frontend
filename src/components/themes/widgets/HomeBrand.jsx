import NoDataFound from "@/components/widgets/NoDataFound";
import BrandIdsContext from "@/context/brandIdsContext";
import { BrandSlider } from "@/data/sliderSetting/SliderSetting";
import Link from "next/link";
import React, { useContext } from "react";
import Slider from "react-slick";
import { Container } from "reactstrap";

const HomeBrand = ({ bgLight, brandIds, sliderOptions }) => {
  const { filteredBrand } = useContext(BrandIdsContext);
  const brandSliderOption = sliderOptions
    ? sliderOptions(filteredBrand?.length)
    : BrandSlider(filteredBrand?.length);

  return (
    <Container>
      {filteredBrand?.length ? (
        <div className={`row ${bgLight ? "bg-light" : ""}`}>
          <div className="brand-slider-box no-arrow">
            <Slider {...brandSliderOption}>
              {filteredBrand.map((item, index) => (
                <div key={index}>
                  <Link className="logo-block" href={`/brand/${item?.slug}`}>
                    {item.brand_image?.original_url ? (
                      <img src={item.brand_image.original_url} alt={item?.name} className="img-fluid" />
                    ) : (
                      <h4>{item?.name}</h4>
                    )}
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      ) : (
        <NoDataFound customClass="no-data-added" title="NoBrandFound" />
      )}
    </Container>
  );
};

export default HomeBrand;
