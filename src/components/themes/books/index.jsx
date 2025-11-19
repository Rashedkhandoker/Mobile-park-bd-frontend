"use client";
import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { bookSlider, categorySlider5, horizontalProductSlider5 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import { storageURL } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import HomeBlog from "../widgets/HomeBlog";
import HomeBrand from "../widgets/HomeBrand";
import HomeCategorySidebar from "../widgets/HomeCategorySidebar";
import HomeFourColumnProduct from "../widgets/HomeFourColumnProduct";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeSlider from "../widgets/HomeSlider";
import HomeTitle from "../widgets/HomeTitle";

const BooksHomePage = () => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "books" });
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { setGetBlogIds, isLoading: blogLoading } = useContext(BlogIdsContext);
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
    document.body.classList.add("home", "header-style-light");
    return () => {
      document.body.classList.remove("home", "header-style-light");
    };
  }, []);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home Section*/}
      <WrapperComponent classes={{ sectionClass: "p-0 layout-7", fluidClass: "home-slider" }} noRowCol={true}>
        <HomeSlider bannerData={data?.home_banner} height={620} width={1835} />
      </WrapperComponent>

      {/* Categories 1  */}
      {data?.categories_1?.status && (
        <WrapperComponent classes={{ sectionClass: `vector-category`, fluidClass: "container" }} noRowCol={true}>
          <div className="vector-slide-8 category-slide ratio_square">
            <HomeCategorySidebar categoryIds={data?.categories_1?.category_ids || []} style="books" sliderOptions={bookSlider} />
          </div>
        </WrapperComponent>
      )}

      {/* Product slider*/}
      {data?.category_product?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space", fluidClass: "container" }}>
          <HomeTitle title={data?.category_product} type="standard" />
          <HomeProductTab paginate={5} categoryIds={data?.category_product?.category_ids} style="vertical" classes="row-cols-xl-5 row-cols-xl-4 row-cols-md-3 row-cols-2" sliderOptions={horizontalProductSlider5} />
        </WrapperComponent>
      )}

      {data?.categories_2?.status && (
        <Container className="category-button">
          <section className="section-b-space border-section border-bottom-0 section-t-space">
            <HomeCategorySidebar categoryIds={data?.categories_2?.category_ids || []} style="books2" sliderOptions={categorySlider5} />
          </section>
        </Container>
      )}

      {/* Four Column Product */}
      {data?.slider_products?.status && (
        <section className="section-b-space card-white-bg bg-size section-t-space" style={{ backgroundImage: `url(${storageURL + data?.slider_products?.image_url})` }}>
          <Container>
            <Row className="g-sm-4 g-3">
              <Col xs="12">
                <HomeTitle title={data?.slider_products} type="standard" />
              </Col>
            </Row>
            <HomeFourColumnProduct data={data?.slider_products} style="horizontal" />
          </Container>
        </section>
      )}

      {/* Offer Banners */}
      {(data?.offer_banner?.banner_1?.status || data?.offer_banner?.banner_2?.status) && (
        <WrapperComponent classes={{ sectionClass: "pb-0 ratio2_1 banner-section", fluidClass: "container", row: "g-sm-4 g-3" }} customCol={true}>
          {data?.offer_banner?.banner_1?.status && (
            <div className={data?.offer_banner?.banner_2?.status ? "col-md-6" : "col-12"}>
              <div className="position-relative">
                <ImageLink imgUrl={data?.offer_banner?.banner_1} height={338} width={676} />
              </div>
            </div>
          )}
          {data?.offer_banner?.banner_2?.status && (
            <div className={data?.offer_banner?.banner_1?.status ? "col-md-6" : "col-12"}>
              <div className="position-relative">
                <ImageLink imgUrl={data?.offer_banner?.banner_2} height={338} width={676} />
              </div>
            </div>
          )}
        </WrapperComponent>
      )}

      {/* Product Slider Section */}
      {data?.featured_blogs?.status && (
        <Container>
          <WrapperComponent classes={{ sectionClass: "section-b-space border-section border-top-0" }}>
            <HomeTitle title={data?.products_list} type="standard" />
            <HomeProduct productIds={data?.products_list?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider5} />
          </WrapperComponent>
        </Container>
      )}

      {/* Blog Section  */}
      {data?.featured_blogs?.status && (
        <WrapperComponent classes={{ sectionClass: "blog blog-section section-b-space ratio3_2", fluidClass: "container" }} colProps={{ md: "12" }}>
          <TitleBox title={data?.featured_blogs} type="standard" />
          <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
        </WrapperComponent>
      )}

      {/* Brand Section  */}
      {data?.brand?.status && (
        <section className="section-b-space pt-0 section-t-space">
          <HomeBrand brandIds={data?.brand?.brand_ids || []} />
        </section>
      )}
    </>
  );
};

export default BooksHomePage;
