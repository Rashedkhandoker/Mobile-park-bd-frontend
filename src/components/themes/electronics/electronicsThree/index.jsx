import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { bookSlider, horizontalProductSlider5 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import { Href, storageURL } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import HomeBrand from "../../widgets/HomeBrand";
import HomeCategorySidebar from "../../widgets/HomeCategorySidebar";
import HomeProduct from "../../widgets/HomeProduct";
import HomeProductAPI from "../../widgets/HomeProductAPI";
import HomeProductTab from "../../widgets/HomeProductTab";
import HomeServices from "../../widgets/HomeService";
import HomeSlider from "../../widgets/HomeSlider";
import { useBestSellingProducts, useNewTrendsProducts, useNewArrivalProducts, useFeaturedProducts } from "@/utils/hooks/useProducts";

const ElectronicsThree = () => {
  const { data, refetch, isLoading } = useCustomDataQuery({ params: "electronics_three" });
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { isLoading: brandLoading } = useContext(BrandIdsContext);

  useEffect(() => {
    if (data?.products_ids) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
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

  useSkeletonLoader2([productLoad, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home Banners */}
      <WrapperComponent classes={{sectionClass: "small-section pt-res-0", fluidClass:"container"}} noRowCol={true}> 
        <Container className=" banner-slider">
        <Row className="g-sm-4 g-3">
          {data?.home_banner?.banner_1?.status && (
            <Col xs="12" md="7">
              <div className="position-relative">
                <ImageLink homeBanner={true} imgUrl={data?.home_banner?.banner_1} height={802} width={793} />
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
          )}
          <Col xs="12" md="5">
            <Row className=" home-banner g-sm-4 g-3">
              {data &&
                Object?.keys(data?.home_banner)
                  .map((item) => data?.home_banner[item])
                  .slice(1)
                  ?.map(
                    (banner, index) =>
                      banner?.status && (
                        <Col xs="6" md="12" key={index}>
                          <div className="position-relative">
                            <ImageLink imgUrl={banner} height={387} width={560} />
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
            </Row>
          </Col>
        </Row>
      </Container>
      </WrapperComponent>
      

      {/* Services */}
      {data?.services && (
        <WrapperComponent classes={{ sectionClass: "service-w-bg pt-0 tools-service", fluidClass: "container" }} noRowCol={true}>
          <HomeServices services={data?.services?.banners} />
        </WrapperComponent>
      )}
      {/* Categories 1  */}
      {data?.categories_1?.status && (
        <WrapperComponent classes={{ sectionClass: `vector-category`, fluidClass: "container" }} noRowCol={true}>
          <HomeCategorySidebar categoryIds={data?.categories_1?.category_ids || []} style="flat-grid" />
        </WrapperComponent>
      )}
      {/* New Trends */}
      <WrapperComponent classes={{ sectionClass: "ratio_square no-arrow", fluidClass: "container" }} colProps={{ xs: "12" }}>
        <TitleBox type="basic" title={data?.products_list_1 || { title: "New Trends" }} />
        <HomeProductAPI useHook={useNewTrendsProducts} hookParams={{ limit: 10 }} slider={true} sliderOptions={horizontalProductSlider5} style="vertical" />
      </WrapperComponent>
      {/* Featured Products */}
      <WrapperComponent classes={{ sectionClass: "ratio_square no-arrow", fluidClass: "container" }} colProps={{ xs: "12" }}>
        <TitleBox type="basic" title={data?.category_product_2 || { title: "Featured Products" }} />
        <HomeProductAPI useHook={useFeaturedProducts} hookParams={{ limit: 10 }} slider={true} sliderOptions={horizontalProductSlider5} style="vertical" />
      </WrapperComponent>
      {/*Banners  */}
      <section className="banner-style-1 section-t-space">
        <div className="full-box">
          <Container>
            <Row className=" ratio2_1">
              {data?.banner?.main_banner?.status && (
                <Col lg="5" md="7" className="card-margin">
                  <div className="banner-padding pt-0">
                      <div className="collection-banner tl-content">
                        <ImageLink imgUrl={data?.banner.main_banner} bgImg={true} classes="img-part custom-height" />
                      </div>
                  </div>
                </Col>
              )}
              <Col lg="4" md="5">
                <div className="banner-padding pt-0 ratio2_1">
                  <Container className=" p-0">
                    <Row>
                      {data?.banner?.grid_banner_1?.status && (
                        <Col xs="12" className=" mb-4">
                            <div className="collection-banner">
                              <ImageLink imgUrl={data?.banner.grid_banner_1} bgImg={true} classes="img-part" />
                            </div>
                        </Col>
                      )}
                      {data?.banner?.grid_banner_2?.status && (
                        <Col xs="12" className="col-12">
                            <div className="collection-banner">
                              <ImageLink imgUrl={data?.banner.grid_banner_2} bgImg={true} classes="img-part" />
                            </div>
                        </Col>
                      )}
                    </Row>
                  </Container>
                </div>
              </Col>
              {data?.banner?.grid_banner_3?.status && (
                <Col lg="3" xs="12" className="d-lg-block d-none">
                  <div className="banner-padding pt-0">
                      <div className="collection-banner tl-content">
                        <ImageLink imgUrl={data?.banner.grid_banner_3} bgImg={true} classes="img-part custom-height" />
                      </div>
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </div>
      </section>
      {/* New Arrivals */}
      <WrapperComponent classes={{ sectionClass: "ratio_square no-arrow", fluidClass: "container" }} colProps={{ xs: "12" }}>
        <TitleBox type="basic" title={data?.products_list_3 || { title: "New Arrivals" }} />
        <HomeProductAPI useHook={useNewArrivalProducts} hookParams={{ limit: 10 }} slider={true} sliderOptions={horizontalProductSlider5} style="vertical" />
      </WrapperComponent>
      {/* Offer Banner 2 */}
      {data?.offer_banner_1?.status && (
        <section className="container section-t-space">
          <Image className="img-fluid" src={storageURL + data?.offer_banner_1?.image_url} height={211} width={1776} alt="offer-banner-2" />
        </section>
      )}
      {/* Best Selling */}
      <WrapperComponent classes={{ sectionClass: "ratio_square no-arrow", fluidClass: "container" }} colProps={{ xs: "12" }}>
        <TitleBox type="basic" title={data?.products_list_2 || { title: "Best Selling" }} />
        <HomeProductAPI useHook={useBestSellingProducts} hookParams={{ limit: 10 }} slider={true} sliderOptions={horizontalProductSlider5} style="vertical" />
      </WrapperComponent>
      {/* Brands */}
      {data?.brand?.status && (
        <section className="section-b-space blog-wo-bg section-t-space">
          <TitleBox type="basic" title={data?.brand} />
          <HomeBrand brandIds={data?.brand?.brand_ids} />
        </section>
      )}
    </>
  );
};

export default ElectronicsThree;
