"use client";
import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider, surfboardCategorySlider } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect, useState } from "react";
import HomeBrand from "../widgets/HomeBrand";
import HomeCategorySidebar from "../widgets/HomeCategorySidebar";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeSlider from "../widgets/HomeSlider";
import HomeSocialMedia from "../widgets/HomeSocialMedia";

const Surfboard = ({ slug }) => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "surfboard" });
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const [banners, setBanners] = useState([]);

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
    if (data?.offer_banner?.banners?.length > 0) {
      const banners = data?.offer_banner?.banners?.filter((banner) => banner?.status);
      setBanners(banners);
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

      {/* Categories */}
      {data?.categories?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space pt-0 no-arrow", fluidClass: "container" }} noRowCol={true}>
          <TitleBox title={data?.categories} type="basic" />
          <HomeCategorySidebar style="basic" categoryIds={data?.categories?.category_ids || []} sliderOptions={surfboardCategorySlider} slider={true} />
        </WrapperComponent>
      )}

      {/* Products List */}
      {data?.products_list?.status && (
        <>
          <WrapperComponent classes={{ sectionClass: "p-0", fluidClass: "tab-bg tab-grey-bg w-100 overflow-hidden" }}>
            <div className="container">
              <TitleBox title={data?.products_list} type="basic" space={false} />
              <HomeProduct productIds={data?.products_list?.product_ids} style="vertical" slider={true} sliderOptions={horizontalProductSlider} />
            </div>
          </WrapperComponent>
        </>
      )}

      {banners.length && (
        <WrapperComponent classes={{ sectionClass: "banner-6 ratio2_1 section-t-space section-b-space", fluidClass: "container", row: "g-sm-4 g-3" }} customCol={true}>
          {banners?.map((banner, i) => (
            <div className="col-6" key={i}>
              <ImageLink imgUrl={banner} bgImg="true" />
            </div>
          ))}
        </WrapperComponent>
      )}

      {/* Category Products  */}
      {data?.category_product?.status && (
        <WrapperComponent classes={{ sectionClass: "p-0", fluidClass: "tab-bg tab-grey-bg w-100 overflow-hidden" }}>
          <div className="container">
            <TitleBox title={data?.category_product} type="basic" space={false} />
            <HomeProductTab style="vertical" title={data?.category_product} categoryIds={data?.category_product?.category_ids} />
          </div>
        </WrapperComponent>
      )}

      {/*Social Media  */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className="instagram ratio_square section-b-space section-t-space">
          <HomeSocialMedia media={data?.social_media || []} type="borderless" classes="container" />
        </section>
      )}

      {/* Brand */}
      {data?.brand?.status && (
        <section className="section-b-space section-t-space">
          <HomeBrand bgLight={true} brandIds={data?.brand?.brand_ids || []} />
        </section>
      )}
    </>
  );
};

export default Surfboard;
