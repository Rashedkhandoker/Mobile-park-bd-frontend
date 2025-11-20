import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider, instagramSlider6 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import { storageURL } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container } from "reactstrap";
import HomeBrand from "../../widgets/HomeBrand";
import HomeProduct from "../../widgets/HomeProduct";
import HomeProductTab from "../../widgets/HomeProductTab";
import HomeServices from "../../widgets/HomeService";
import HomeSlider from "../../widgets/HomeSlider";
import HomeSocialMedia from "../../widgets/HomeSocialMedia";

const MarketplaceOne = () => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "marketplace_one" });
  const [offerBanners, setOfferBanners] = useState([]);
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);

  useEffect(() => {
    if (data?.offer_banner_1) {
      let banners = [];
      if (data?.offer_banner_1?.banner_1?.status) {
        banners = [...banners, data?.offer_banner_1?.banner_1];
      }
      if (data?.offer_banner_1?.banner_2?.status) {
        banners = [...banners, data?.offer_banner_1?.banner_2];
      }
      if (data?.offer_banner_1?.banner_3?.status) {
        banners = [...banners, data?.offer_banner_1?.banner_3];
      }
      if (data?.offer_banner_1?.banner_3?.status) {
        banners = [...banners, data?.offer_banner_1?.banner_4];
      }
      setOfferBanners(banners);
    }
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
  }, [data, isLoading]);

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
      <section className="p-0 layout-7 section-t-space">
        <div className="home-slider">
          <HomeSlider bannerData={data?.home_banner} height={730} width={1850} />
        </div>
      </section>

      {/* Offer Banner 1 */}
      <WrapperComponent classes={{ sectionClass: "banner-padding banner-section ratio2_1", fluidClass: "container-fluid", row: "g-sm-4 g-3" }} customCol={true}>
        {offerBanners?.map(
          (banner, index) =>
            banner?.status && (
              <div key={index} className={offerBanners?.length == 4 ? "col-lg-3 col-6" : offerBanners?.length == 3 ? "col-lg-4 col-6" : offerBanners?.length == 2 ? "col-6" : "col-12"}>
                <div className="position-relative">
                  <ImageLink bgImg={true} imgUrl={banner} />
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
            )
        )}
      </WrapperComponent>

      {/* Product List 1 */}
      {data?.product_list_1?.status && (
        <>
          <TitleBox title={data?.product_list_1} type="basic" />
          <WrapperComponent classes={{ sectionClass: "pt-0 section-b-space", fluidClass: "container" }} noRowCol={true}>
            <div>
              <HomeProduct productIds={data?.product_list_1?.product_ids || []} style="vertical" rowClass="row-cols-xxl-5 row-cols-xl-4 row-cols-md-3 row-cols-2 g-sm-4 g-3" />
            </div>
          </WrapperComponent>
        </>
      )}

      {/* Offer Banner 2 */}
      {data?.offer_banner_2?.status && (
        <section className="p-0 section-t-space">
          <ImageLink imgUrl={data?.offer_banner_2} height={590} width={1835} />
        </section>
      )}

      {/* Category Products */}
      {data?.category_product?.status && (
        <WrapperComponent classes={{ sectionClass: "tools_product bg-title section-b-space", fluidClass: "container", row: "g-4" }} customCol={true}>
          {data?.category_product?.left_panel?.status && (
            <Col xl="4" lg="4" md="12">
              <div className="theme-card">
                <h5 className="title-border"> {data?.category_product?.left_panel?.title}</h5>
                <div className="offer-slider ">
                  <HomeProduct productIds={data?.category_product?.left_panel?.product_ids || []} style="horizontal" />
                </div>
              </div>
            </Col>
          )}
          <div className={data?.category_product?.left_panel?.status ? "col-xl-8 col-lg-8" : "col-12"}>
            <HomeProductTab categoryIds={data?.category_product?.right_panel?.product_category?.category_ids} style="vertical" tabStyle="classic" title={data?.category_product?.right_panel?.product_category} slider={true} sliderOptions={horizontalProductSlider} />
            <div className="banner-tools">
              <Image src={storageURL + data?.category_product?.right_panel?.product_banner?.image_url} height={224} width={909} alt="banner" className="img-fluid" />
            </div>
          </div>
        </WrapperComponent>
      )}

      {/* Services */}
      {data?.services && (
        <Container>
          <section className="service border-section small-section section-t-space">
            <HomeServices services={data?.services?.banners} />
          </section>
        </Container>
      )}

      {/* Social Media */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className="instagram ratio_square section-t-space">
          <HomeSocialMedia media={data?.social_media || []} type="borderless" sliderOptions={instagramSlider6} />
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

export default MarketplaceOne;
