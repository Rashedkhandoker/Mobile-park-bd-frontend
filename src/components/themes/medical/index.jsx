"use client";
import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { categorySlider5 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect, useState } from "react";
import { Col } from "reactstrap";
import HomeBlog from "../widgets/HomeBlog";
import HomeBrand from "../widgets/HomeBrand";
import HomeCategorySidebar from "../widgets/HomeCategorySidebar";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeServices from "../widgets/HomeService";
import HomeSlider from "../widgets/HomeSlider";

const Medical = ({ slug }) => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "medical" });
  const [filteredBanners, setFilteredBanners] = useState([]);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);
  useEffect(() => {
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
    if (data && data.offer_banner && data.offer_banner.banners) {
      const banners = data.offer_banner.banners.filter((banner) => banner.status);
      setFilteredBanners(banners);
    }
  }, [data]);

  useEffect(() => {
    document.body.classList.add("home", "theme-color-22");
    return () => {
      document.body.classList.remove("home", "theme-color-22");
    };
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home */}
      <WrapperComponent classes={{ sectionClass: "p-0 position-relative overflow-hidden", fluidClass: "home-slider" }}>
        <HomeSlider bannerData={data?.home_banner} height={724} width={1835} />
      </WrapperComponent>

      {/* Categories Slider */}
      {data?.categories?.status && (
        <div className="container">
          <WrapperComponent classes={{ sectionClass: "section-b-space border-section border-top-0 category-width" }}>
            <div className="slide-6 no-arrow">
              <HomeCategorySidebar sliderOptions={categorySlider5} style="digital" categoryIds={data?.categories?.category_ids || []} />
            </div>
          </WrapperComponent>
        </div>
      )}

      {/* Products Categories */}
      {data?.category_product?.status && (
        <>
          <TitleBox title={data?.category_product} type="basic" />
          <WrapperComponent classes={{ sectionClass: "section-b-space pt-0", fluidClass: "container" }} noRowCol={true}>
            <HomeProductTab paginate={5} categoryIds={data?.category_product?.category_ids} style="vertical" classes="row-cols-xxl-5 row-cols-xl-4 row-cols-md-3 row-cols-2 g-sm-4 g-3" />
          </WrapperComponent>
        </>
      )}

      {/* Offer Banners */}
      <WrapperComponent classes={{ sectionClass: `banner-section banner-padding banner-furniture ratio_40 ${!data?.categories?.status && !data?.category_product?.status ? "section-t-space" : "pt-0"}`, fluidClass: "container-fluid", row: "g-sm-4 g-3" }} customCol={true}>
        {filteredBanners.map((banner, i) =>
          filteredBanners.length >= 2 ? (
            <div key={i} className={i == 0 || i == 1 ? "col-md-6" : i > 1 && filteredBanners.length % 2 == 0 ? "col-md-6" : i > 1 && filteredBanners.length == 5 ? "col-md-4" : "col-12"}>
              <ImageLink imgUrl={banner} bgImage={true} height={338} width={676} />
            </div>
          ) : (
            <Col xs="12">
              <ImageLink imgUrl={banner} bgImage={true} height={338} width={676} />
            </Col>
          )
        )}
      </WrapperComponent>

      {/* Column Banners And Products */}
      {data?.column_banner_product?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space ratio3_2", fluidClass: "container", row: "multiple-slider" }} customCol={true}>
          {data?.column_banner_product?.offer_banner_1?.status && (
            <div className={data?.column_banner_product?.product_list_1?.status ? "col-xl-3 col-sm-6" : "col-sm-6"}>
              <div className="collection-banner h-100 tl-content banner-section">
                <ImageLink imgUrl={data?.column_banner_product?.offer_banner_1} classes="img-part h-100" bgImg={true} height={515} width={326} />
              </div>
            </div>
          )}
          {data?.column_banner_product?.product_list_1?.status && (
            <div className={data?.column_banner_product?.offer_banner_1?.status ? "col-xl-3 col-sm-6" : "col-sm-6"}>
              <div className="theme-card">
                <h5 className="title-border pt-cls-slider">{data?.column_banner_product?.product_list_1?.title}</h5>
                <div className="offer-slider slide-1">
                  <HomeProduct style="horizontal" productIds={data?.column_banner_product?.product_list_1?.product_ids || []} />
                </div>
              </div>
            </div>
          )}
          {data?.column_banner_product?.offer_banner_2?.status && (
            <div className={data?.column_banner_product?.product_list_2?.status ? "col-xl-3 col-sm-6" : "col-sm-6"}>
              <div className="collection-banner h-100 tl-content banner-section">
                <ImageLink imgUrl={data?.column_banner_product?.offer_banner_2} classes="img-part h-100" bgImg={true} height={515} width={326} />
              </div>
            </div>
          )}
          {data?.column_banner_product?.product_list_2?.status && (
            <div className={data?.column_banner_product?.offer_banner_2?.status ? "col-xl-3 col-sm-6" : "col-sm-6"}>
              <div className="theme-card">
                <h5 className="title-border pt-cls-slider">{data?.column_banner_product?.product_list_2?.title}</h5>
                <div className="offer-slider slide-1">
                  <HomeProduct style="horizontal" productIds={data?.column_banner_product?.product_list_2?.product_ids || []} />
                </div>
              </div>
            </div>
          )}
        </WrapperComponent>
      )}

      {/* Blogs */}
      {data?.featured_blogs?.status && (
        <WrapperComponent classes={{ sectionClass: "blog ratio3_2 left-blog pt-0", fluidClass: "container border-section border-bottom-0" }} noRowCol={true}>
          <TitleBox title={data?.featured_blogs} type="basic" />
          <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
        </WrapperComponent>
      )}

      {/* Services */}
      {data?.services && (
        <WrapperComponent classes={{ sectionClass: "tools-service service-w-bg section-b-space", fluidClass: "container" }} customCol={false}>
          <HomeServices services={data?.services?.banners || []} />
        </WrapperComponent>
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

export default Medical;
