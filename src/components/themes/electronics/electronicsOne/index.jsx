import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import { brandSlider4 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import HomeBrand from "../../widgets/HomeBrand";
import HomeProductTab from "../../widgets/HomeProductTab";
import HomeSlider from "../../widgets/HomeSlider";

const ElectronicsOne = () => {
  const { data, refetch, isLoading } = useCustomDataQuery({ params: "electronics_one" });
  const [offerBanners, setOfferBanners] = useState([]);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { setGetBlogIds, isLoading: blogLoading } = useContext(BlogIdsContext);

  useEffect(() => {
    if (data?.offer_banner) {
      let banners = [];
      if (data?.offer_banner?.banner_1?.status) {
        banners = [...banners, data?.offer_banner?.banner_1];
      }
      if (data?.offer_banner?.banner_2?.status) {
        banners = [...banners, data?.offer_banner?.banner_2];
      }
      if (data?.offer_banner?.banner_3?.status) {
        banners = [...banners, data?.offer_banner?.banner_3];
      }
      setOfferBanners(banners);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [isLoading]);

  useEffect(() => {
    document.body.classList.add("home", "md-container");
    return () => {
      document.body.classList.remove("home", "md-container");
    };
  }, []);

  useSkeletonLoader2([blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home Banners */}
      <section className="pt-0 overflow-hidden section-t-space">
        <div className="home-slider">
          <HomeSlider bannerData={data?.home_banner} height={647} width={1850} />
        </div>
      </section>

      {/* Offer Banners */}
      <WrapperComponent classes={{ sectionClass: "ratio2_3 banner-section", fluidClass: "container", row: "g-sm-4 g-3" }} customCol={true}>
        {offerBanners?.map(
          (banner, index) =>
            banner?.status && (
              <Col sm="6" md="4" key={index}>
                <div className="position-relative">
                  <ImageLink homeBanner={true} imgUrl={banner} bgImg={true} />
                  <div className="banner-skeleton">
                    <div className="skeleton-content">
                      <p className="card-text placeholder-glow row g-lg-3 g-0">
                        <span className="col-lg-7 col-9">
                          <span className="placeholder"></span>
                        </span>
                        <span className="col-lg-9 col-12">
                          <span className="placeholder"></span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            )
        )}
      </WrapperComponent>

      {/* Category Products */}
      {data?.category_product?.status && (
        <WrapperComponent classes={{ sectionClass: "category-tab-section ratio_square", fluidClass: "container" }} noRowCol={true}>
          <TitleBox title={data?.category_product} type="standard" />
          <Row>
            <Col>
              <HomeProductTab categoryIds={data?.category_product?.category_ids} style="vertical" />
            </Col>
          </Row>
        </WrapperComponent>
      )}

      {/* Brands */}
      {data?.brand?.status && (
        <section className="section-b-space section-t-space">
          <HomeBrand sliderOptions={brandSlider4} brandIds={data?.brand?.brand_ids} />
        </section>
      )}
    </>
  );
};

export default ElectronicsOne;
