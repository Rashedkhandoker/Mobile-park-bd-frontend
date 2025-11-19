"use client";
import ImageLink from "@/components/widgets/imageLink";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import { ImagePath } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect } from "react";
import { Container, Row } from "reactstrap";
import HomeBlog from "../../widgets/HomeBlog";
import HomeBrand from "../../widgets/HomeBrand";
import HomeProduct from "../../widgets/HomeProduct";
import HomeProductTab from "../../widgets/HomeProductTab";
import HomeServices from "../../widgets/HomeService";
import HomeSlider from "../../widgets/HomeSlider";
import HomeSocialMedia from "../../widgets/HomeSocialMedia";
import HomeTitle from "../../widgets/HomeTitle";

const Fashion1 = () => {
  const { data, isLoading, refetch, fetchStatus } = useCustomDataQuery({ params: "fashion_one" });
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { setGetBlogIds, isLoading: blogLoading } = useContext(BlogIdsContext);

  useEffect(() => {
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

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
      <WrapperComponent classes={{ sectionClass: "p-0 overflow-hidden position-relative", fluidClass: "slide-1 home-slider" }}>
        <HomeSlider bannerData={data?.home_banner} height={650} width={1920} />
      </WrapperComponent>

      {/* Offer Banners */}
      <WrapperComponent classes={{ sectionClass: "pb-0 ratio2_1 banner-section", fluidClass: "container" }}>
        <Row className="g-sm-4 g-3">
          {data?.offer_banner?.banner_1?.status && (
            <div className={data?.offer_banner?.banner_1?.status ? "col-6" : "col-12"}>
              <div className="position-relative">
                <ImageLink imgUrl={data?.offer_banner?.banner_1} placeholder={`${ImagePath}/two_column_banner.png`} height={338} width={676} />
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
          )}
          {data?.offer_banner?.banner_2?.status && (
            <div className={data?.offer_banner?.banner_2?.status ? "col-6" : "col-12"}>
              <div className="position-relative">
                <ImageLink imgUrl={data?.offer_banner?.banner_2} placeholder={`${ImagePath}/two_column_banner.png`} height={338} width={676} />
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
          )}
        </Row>
      </WrapperComponent>

      {/* Products Slider */}
      {data?.products_list?.status && (
        <>
          <HomeTitle title={data?.products_list} type="basic" />
          <WrapperComponent classes={{ sectionClass: "section-b-space pt-0", fluidClass: "container" }}>
            <div className="product-4 no-arrow">
              <HomeProduct slider={true} style="vertical" productIds={data?.products_list?.product_ids || []} sliderOptions={horizontalProductSlider} />
            </div>
          </WrapperComponent>
        </>
      )}

      {/* Full Banner */}
      {data?.banner?.status && (
        <WrapperComponent classes={{ sectionClass: "p-0 banner-sale overflow-hidden" }} noRowCol={true}>
          <ImageLink imgUrl={data?.banner} placeholder={`${ImagePath}/full_column_banner.png`} height={587} width={1905} />
        </WrapperComponent>
      )}

      {/* Product Categories */}
      {data?.category_product?.status && (
        <>
          <HomeTitle title={data?.category_product} type="basic" />
          <WrapperComponent classes={{ sectionClass: "section-b-space category-tab-section pt-0", fluidClass: "container" }}>
            <HomeProductTab categoryIds={data?.category_product?.category_ids} style="vertical" />
          </WrapperComponent>
        </>
      )}

      {/* Services */}
      {data?.services && (
        <Container>
          <WrapperComponent classes={{ sectionClass: "service border-section small-section" }} noRowCol={true}>
            <HomeServices services={data?.services?.banners || []} />
          </WrapperComponent>
        </Container>
      )}

      {/* Featured Blogs */}
      {data?.featured_blogs?.status && (
        <>
          <Container>
            <HomeTitle title={data?.featured_blogs} type="basic" />
          </Container>
          <WrapperComponent classes={{ sectionClass: "blog pt-0 ratio2_3", fluidClass: "container" }}>
            <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
          </WrapperComponent>
        </>
      )}

      {/* Social Media */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className="instagram ratio_square overflow-hidden section-t-space">
          <HomeSocialMedia media={data?.social_media || []} classes="container-fluid" type="borderless" />
        </section>
      )}

      {/* Brands */}
      {data?.brand?.status && (
        <section className="section-b-space section-t-space">
          <HomeBrand brandIds={data?.brand?.brand_ids || []} />
        </section>
      )}
    </>
  );
};

export default Fashion1;
