import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider5 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import HomeBlog from "../../widgets/HomeBlog";
import HomeBrand from "../../widgets/HomeBrand";
import HomeProduct from "../../widgets/HomeProduct";
import HomeServices from "../../widgets/HomeService";
import HomeSlider from "../../widgets/HomeSlider";
import HomeTitle from "../../widgets/HomeTitle";

const VegetablesOne = () => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "vegetables_one" });
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);

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
      {/* Home Banner */}
      <section className="p-0 section-t-space">
        <div className="home-slider">
          <HomeSlider bannerData={data?.home_banner} height={729} width={1850} />
        </div>
      </section>

      {/* Services */}
      {data?.services && (
        <WrapperComponent classes={{ sectionClass: "banner-padding absolute-banner pb-0 ", fluidClass: "container" }} noRowCol={true}>
          <div className="absolute-bg">
            <div className="service p-0">
              <HomeServices services={data?.services?.banners} />
            </div>
          </div>
        </WrapperComponent>
      )}

      {/* Product List 1 */}
      {data?.products_list_1?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space no-arrow", fluidClass: "container" }}>
          <TitleBox title={data?.products_list_1} type="premium" />
          <div className="product-5 product-m">
            <HomeProduct productIds={data?.products_list_1?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider5} />
          </div>
        </WrapperComponent>
      )}

      {/* Parallax Or Full Banner */}
      {data?.full_banner?.status && (
        <section className="p-0 section-t-space">
          <ImageLink imgUrl={data?.full_banner} height={1230} width={1835} />
        </section>
      )}

      {/* Product List 2 */}
      {data?.products_list_2?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space no-arrow", fluidClass: "full-box" }} noRowCol={true}>
          <Container>
            <TitleBox title={data?.products_list_2} type="premium" />
            <div className="product-5 product-m">
              <HomeProduct productIds={data?.products_list_2?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider5} />
            </div>
          </Container>
        </WrapperComponent>
      )}

      {/* Featured Blogs */}
      {data?.featured_blogs?.status && (
        <>
          <Container>
            <Row>
              <Col>
                <HomeTitle title={data?.featured_blogs} type="premium" space={false} />
              </Col>
            </Row>
          </Container>
          <WrapperComponent classes={{ sectionClass: "blog section-b-space pt-0 ratio2_3", fluidClass: "container" }} colProps={{ md: "12" }}>
            <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
          </WrapperComponent>
        </>
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

export default VegetablesOne;
