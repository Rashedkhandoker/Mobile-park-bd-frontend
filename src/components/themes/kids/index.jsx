"use client";
import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
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
import HomeBrand from "../widgets/HomeBrand";
import HomeFourColumnProduct from "../widgets/HomeFourColumnProduct";
import HomeProduct from "../widgets/HomeProduct";
import HomeSlider from "../widgets/HomeSlider";
import HomeSocialMedia from "../widgets/HomeSocialMedia";

const KidsHomePage = ({ slug }) => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "kids" });
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
  }, [data]);

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
      <WrapperComponent classes={{ sectionClass: "p-0", fluidClass: "home-slider" }} noRowCol={true}>
        <HomeSlider bannerData={data?.home_banner} height={729} width={1850} />
      </WrapperComponent>

      {/* Offer Banner  */}
      <WrapperComponent classes={{ sectionClass: "banner-padding absolute-banner pb-0 ratio2_1", fluidClass: "container overflow-hidden absolute-bg", row: "g-sm-4 g-3" }} customCol={true}>
        {data?.offer_banner?.banner_1?.status && (
          <div className={data?.offer_banner?.banner_1?.status ? "col-6" : "col-12"}>
            <div className="position-relative">
              <ImageLink imgUrl={data?.offer_banner?.banner_1} bgImg={true} />
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
              <ImageLink imgUrl={data?.offer_banner?.banner_2} bgImg={true} />
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
      </WrapperComponent>

      {/* Products List */}
      {data?.products_list?.status && (
        <>
          <TitleBox title={data?.products_list || []} type="basic" />
          <WrapperComponent classes={{ sectionClass: "section-b-space pt-0", fluidClass: "container" }} noRowCol={true}>
            <HomeProduct productIds={data?.products_list?.product_ids} style="vertical" slider="true" sliderOptions={horizontalProductSlider} />
          </WrapperComponent>
        </>
      )}

      {/* Full Banner */}
      {data?.full_banner?.status && (
        <section className="p-0 section-t-space">
          <ImageLink imgUrl={data?.full_banner} placeholder={`${ImagePath}/full_column_banner.png`} height={564} width={1835} />
        </section>
      )}

      {/* Four Column Products*/}
      {data?.slider_products?.status && (
        <WrapperComponent classes={{ fluidClass: "container" }} noRowCol={true}>
          <HomeFourColumnProduct data={data?.slider_products} style="horizontal" />
        </WrapperComponent>
      )}

      {/* Social Media  */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className="instagram ratio_square section-t-space">
          <HomeSocialMedia media={data?.social_media || []} type="borderless" />
        </section>
      )}

      {/* Brand */}
      {data?.brand?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space logo-section blog-wo-bg overflow-hidden" }}>
          <HomeBrand bgLight={false} brandIds={data?.brand?.brand_ids || []} />
        </WrapperComponent>
      )}
    </>
  );
};

export default KidsHomePage;
