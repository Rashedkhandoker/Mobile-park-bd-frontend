import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider,instagramSlider5 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import HomeBrand from "../widgets/HomeBrand";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeServices from "../widgets/HomeService";
import HomeSlider from "../widgets/HomeSlider";
import HomeSocialMedia from "../widgets/HomeSocialMedia";

const GogglesHomePage = () => {
  const { data, refetch, isLoading } = useCustomDataQuery({ params: "goggles" });
  const [banners, setBanners] = useState([]);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);

  useEffect(() => {
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }

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

    setBanners(banners);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [isLoading]);

  useEffect(() => {
    document.body.classList.add("home");
    return () => {
      document.body.classList.remove("home");
    };
  }, []);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home Banner */}
      <WrapperComponent classes={{ sectionClass: "p-0 overflow-hidden", fluidClass: "home-slider" }} noRowCol={true}>
        <HomeSlider bannerData={data?.home_banner} height={940} width={1850} />
      </WrapperComponent>

      {/* Services */}
      {data?.services && (
        <Container>
          <section className="service border-section small-section border-top-0 section-t-space">
            <HomeServices services={data?.services?.banners} />
          </section>
        </Container>
      )}

      {/* Offer Banners */}
      <WrapperComponent classes={{ sectionClass: "section-b-space banner-section ratio2_1", fluidClass: "container", row: "g-sm-4 g-3" }} customCol={true}>
        {banners?.map((banner, i) => (
          <div key={i} className={banners.length === 3 ? "col-md-4 col-6" : banners.length === 2 ? "col-6" : "col-12"}>
            <div className="position-relative">
              <ImageLink imgUrl={banner} bgImg={true} />
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
          </div>
        ))}
      </WrapperComponent>

      {/* Product List */}
      {data?.products_list?.status && (
        <WrapperComponent classes={{ sectionClass: `layout9-box section-b-space ${banners?.length ? "pt-0" : ""}`, fluidClass: "container" }} noRowCol={true}>
          <TitleBox type="basic" classes="title-gradient" title={data?.products_list} space={false} />
          <Row>
            <Col>
              <HomeProduct productIds={data?.products_list?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider} />
            </Col>
          </Row>
        </WrapperComponent>
      )}

      {/* Full Banner */}
      {data?.full_banner?.status && (
        <section className="p-0 section-t-space">
          <ImageLink imgUrl={data?.full_banner} height={562} width={1835} />
        </section>
      )}

      {/* Category Products */}
      {data?.category_product?.status && (
        <>
          <WrapperComponent classes={{ sectionClass: "layout9-box", fluidClass: "container" }}>
            <HomeProductTab categoryIds={data?.category_product?.category_ids} tab_title_class="tab-title2" style="vertical" />
          </WrapperComponent>
        </>
      )}

      {/* Social Media */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className="instagram section-b-space ratio_square">
          <HomeSocialMedia sliderOptions={instagramSlider5} media={data?.social_media || []} classes="container" type="borderless" />
        </section>
      )}

      {/* Brand */}
      {data?.brand?.status && (
        <section className="section-b-space section-t-space">
          <HomeBrand brandIds={data?.brand?.brand_ids || []} />
        </section>
      )}
    </>
  );
};

export default GogglesHomePage;
