import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { blog4Slider, CouponSliderSettings, horizontalProductSlider5 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import request from "@/utils/axiosUtils";
import { CouponAPI } from "@/utils/axiosUtils/API";
import { Href, ImagePath } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Col, Container, Row } from "reactstrap";
import HomeBlog from "../widgets/HomeBlog";
import HomeBrand from "../widgets/HomeBrand";
import HomeCategorySidebar from "../widgets/HomeCategorySidebar";
import HomeParallaxBanner from "../widgets/HomeParallaxBanner";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeSlider from "../widgets/HomeSlider";
import HomeSocialMedia from "../widgets/HomeSocialMedia";

const Gradient = () => {
  const { data, refetch, isLoading } = useCustomDataQuery({ params: "gradient" });
  const { data: couponsData, isLoading: couponLoading, refetch: couponRefetch } = useFetchQuery(["Coupon"], () => request({ url: CouponAPI }), { enabled: false, refetchOnWindowFocus: false, select: (res) => res?.data?.data });
  const [banners, setBanners] = useState([]);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);
  const blogSliderSettings = blog4Slider(data?.featured_blogs?.blog_ids?.length);
  const filteredCoupons = data?.coupons?.coupon_ids && couponsData ? couponsData.filter((item) => data.coupons.coupon_ids.includes(item.id)) : [];

  const images = [`${ImagePath}/gradient/deal-bg/1.jpg`, `${ImagePath}/gradient/deal-bg/2.jpg`, `${ImagePath}/gradient/deal-bg/3.jpg`, `${ImagePath}/gradient/deal-bg/4.jpg`, `${ImagePath}/gradient/deal-bg/5.jpg`, `${ImagePath}/gradient/deal-bg/6.jpg`];

  useEffect(() => {
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
    if (data?.offer_banner?.banners?.length > 0) {
      const banners = Object.keys(data?.offer_banner?.banners).map((item) => data?.offer_banner?.banners[item]);
      setBanners(banners);
    }
  }, [data]);

  useEffect(() => {
    couponRefetch();
  }, [couponLoading]);

  useEffect(() => {
    document.body.classList.add("home");
    return () => {
      document.body.classList.remove("home");
    };
  }, []);

  useEffect(() => {
    refetch();
  }, [isLoading]);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home Banner */}
      <WrapperComponent classes={{ sectionClass: "p-0 layout-7", fluidClass: "home-slider" }} noRowCol={true}>
        <HomeSlider bannerData={data?.home_banner} height={730} width={1850} />
      </WrapperComponent>

      {/* Category Products */}
      {data?.categories_1?.status && (
        <WrapperComponent classes={{ sectionClass: "small-section pb-0", fluidClass: "container container-lg" }} noRowCol={true}>
          <HomeCategorySidebar categoryIds={data?.categories_1?.category_ids || []} style="gradient" />
        </WrapperComponent>
      )}

      {/* Offer Banners */}
      <WrapperComponent classes={{ sectionClass: "pb-0 ratio2_1", fluidClass: "container container-lg", row: "g-sm-4 g-3" }} customCol={true}>
        {banners?.map((banner, i) =>
          banners.length >= 2 ? (
            <div key={i} className={i == 0 || i == 1 ? "col-6" : i > 1 && banners.length % 2 == 0 ? "col-6" : i > 1 && banners.length == 5 ? "col-md-4 col-6" : "col-12"}>
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
          ) : (
            <Col xs="12" className="col-12">
              <ImageLink imgUrl={banner} bgImg={true} />
            </Col>
          )
        )}
      </WrapperComponent>

      {/* Category Products */}
      {data?.category_product?.status && (
        <>
          <TitleBox title={data?.category_product} type="gradient" />
          <WrapperComponent classes={{ sectionClass: "pt-0", fluidClass: "container container-lg" }} noRowCol={true}>
            <HomeProductTab categoryIds={data?.category_product?.category_ids} style="vertical" paginate={5} classes={"row-cols-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-5"} />
          </WrapperComponent>
        </>
      )}

      {/* Product List */}
      {data?.products_list?.status && (
        <WrapperComponent classes={{ sectionClass: "gradient-slider pt-0", fluidClass: "container container-lg" }} customCol={false}>
          <TitleBox type="gradient" classes="title-gradient" title={data?.products_list} />
          <HomeProduct productIds={data?.products_list?.product_ids || []} style="vertical" tab_title_class="tab-title2" slider={true} sliderOptions={horizontalProductSlider5} />
        </WrapperComponent>
      )}

      {/* Discount Coupons */}
      {data?.coupons?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space no-arrow", fluidClass: "container container-lg" }} noRowCol={true}>
          <div className="ratio_square">
            <Slider {...CouponSliderSettings}>
              {filteredCoupons?.map((coupon, i) => (
                <a href={Href} key={i}>
                  <div className="deal-category">
                    <img src={images[i % images.length]} className="img-fluid w-100" alt={coupon?.title} />
                    <div className="deal-content">
                      <div>
                        <h2>{coupon?.title}</h2>
                        <h2>#{coupon?.code}</h2>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </Slider>
          </div>
        </WrapperComponent>
      )}

      {/* Parallax Banner */}
      {data?.parallax_banner?.banner_1?.status && (
        <section className="p-0 pet-parallax section-t-space">
          <HomeParallaxBanner banners={data?.parallax_banner?.banner_1} text_right={true} />
        </section>
      )}

      {/* Parallax Banner */}
      {data?.parallax_banner?.banner_2?.status && (
        <section className="p-0 pet-parallax section-t-space">
          <HomeParallaxBanner banners={data?.parallax_banner?.banner_2} />
        </section>
      )}

      {/* Featured Blogs */}
      {data?.featured_blogs?.status && (
        <>
          <Container>
            <Row>
              <Col>
                <TitleBox title={data?.featured_blogs} type="gradient" classes="title-gradient" />
              </Col>
            </Row>
          </Container>
          <WrapperComponent classes={{ sectionClass: "blog left-blog pt-0 ratio_115", fluidClass: "container container-lg" }}>
            <HomeBlog blogEffect="basic-effect" blogIds={data?.featured_blogs?.blog_ids || []} slideOptions={blogSliderSettings} />
          </WrapperComponent>
        </>
      )}

      {/* Social Media */}
      {data?.social_media?.status && (
        <section className="instagram ratio_square gym-parallax section-t-space">
          <HomeSocialMedia media={data?.social_media || []} classes="container-fluid p-0" type="borderless" />
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

export default Gradient;
