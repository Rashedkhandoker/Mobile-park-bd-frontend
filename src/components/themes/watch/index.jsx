"use client";
import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { brandSlider4, horizontalProductSlider, instagramSlider5, toolsCategorySliderSettings } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import HomeBlog from "../widgets/HomeBlog";
import HomeBrand from "../widgets/HomeBrand";
import HomeCategorySidebar from "../widgets/HomeCategorySidebar";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeServices from "../widgets/HomeService";
import HomeSlider from "../widgets/HomeSlider";
import HomeSocialMedia from "../widgets/HomeSocialMedia";

const Watch = ({ slug }) => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "watch" });
  const [filteredBanners, setFilteredBanners] = useState([]);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data?.offer_banner_2 && data?.offer_banner_2) {
      const filteredBanners = Object.keys(data?.offer_banner_2)
        ?.map((item) => data?.offer_banner_2[item])
        ?.filter((banner) => banner.status);
      setFilteredBanners(filteredBanners);
    }
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
      <WrapperComponent classes={{ sectionClass: "p-0 position-relative overflow-hidden", fluidClass: "home-slider" }}>
        <HomeSlider bannerData={data?.home_banner} height={729} width={1850} />
      </WrapperComponent>

      {/* Brands */}
      {data?.brand?.status && (
        <WrapperComponent classes={{ sectionClass: "overflow-hidden" }}>
          <HomeBrand sliderOptions={brandSlider4} brandIds={data?.brand?.brand_ids || []} />
        </WrapperComponent>
      )}

      {/* Offer Banner 1 */}
      {data?.offer_banner_1?.status && (
        <WrapperComponent classes={{ fluidClass: "container" }} noRowCol={true}>
          <div className="position-relative">
            <ImageLink classes="banner-text" imgUrl={data?.offer_banner_1} bgImage={true} height={123} width={1350} />
          </div>
        </WrapperComponent>
      )}

      {/* Products Categories */}
      {data?.categories?.status && (
        <div className="container">
          <WrapperComponent classes={{ sectionClass: "section-b-space border-section border-top-0 category-width" }}>
            <div className="row">
              <div className="col">
                <div className="slide-4 category-m no-arrow">
                  <HomeCategorySidebar style="one" categoryIds={data?.categories?.category_ids || []} sliderOptions={toolsCategorySliderSettings} />
                </div>
              </div>
            </div>
          </WrapperComponent>
        </div>
      )}

      {/* Category Products */}
      {data?.category_product?.status && (
        <WrapperComponent classes={{ sectionClass: "p-0", fluidClass: "tab-bg m-0 overflow-hidden container-fluid w-100" }} noRowCol={true}>
          <TitleBox title={data?.category_product} type="premium" />
          <HomeProductTab categoryIds={data?.category_product?.category_ids} style="horizontal" product_box_style="horizontal" />
        </WrapperComponent>
      )}

      {/* Product List 1  */}
      {data?.products_list_1?.status && (
        <WrapperComponent classes={{ fluidClass: "container" }}>
          <TitleBox title={data?.products_list_1} type="premium" />
          <HomeProduct slider={true} style="vertical" productIds={data?.products_list_1?.product_ids || []} sliderOptions={horizontalProductSlider} />
        </WrapperComponent>
      )}

      {/* Offer Banners */}
      <WrapperComponent classes={{ sectionClass: `ratio_45 banner-section`, fluidClass: "container", row: "g-sm-4 g-3" }} customCol={true}>
        {filteredBanners?.map(
          (banner, i) =>
            banner?.status && (
              <div key={i} className={filteredBanners.length == 3 ? "col-md-4" : filteredBanners.length == 2 ? "col-md-6" : "col-12"}>
                <ImageLink imgUrl={banner} bgImg={true} />
              </div>
            )
        )}
      </WrapperComponent>

      {/* Products List 2 */}
      {data?.products_list_2?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space", fluidClass: "container" }}>
          <TitleBox title={data?.products_list_2} type="premium" />
          <HomeProduct slider={true} style="vertical" productIds={data?.products_list_2?.product_ids || []} sliderOptions={horizontalProductSlider} />
        </WrapperComponent>
      )}

      {/* Featured Blogs */}
      {data?.featured_blogs?.status && (
        <>
          <WrapperComponent classes={{ sectionClass: "blog blog-bg section-b-space ratio2_3", fluidClass: "container" }} colProps={{ md: "12" }}>
            <TitleBox title={data?.featured_blogs} type="premium" />
            <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
          </WrapperComponent>
        </>
      )}

      {/* Services */}
      {data?.services && (
        <Container>
          <WrapperComponent classes={{ sectionClass: "service section-b-space wo-box border-section border-top-0" }} noRowCol={true}>
            <HomeServices type="simple" services={data?.services?.banners || []} />
          </WrapperComponent>
        </Container>
      )}

      {/* Social Media */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <WrapperComponent classes={{ sectionClass: "instagram ratio_square section-b-space" }} noRowCol={true}>
          <HomeSocialMedia sliderOptions={instagramSlider5} media={data?.social_media || []} classes="container" type="borderless" />
        </WrapperComponent>
      )}
    </>
  );
};

export default Watch;
