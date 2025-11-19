import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider5 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import { storageURL } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import HomeBlog from "../widgets/HomeBlog";
import HomeBrand from "../widgets/HomeBrand";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeSlider from "../widgets/HomeSlider";
import HomeSocialMedia from "../widgets/HomeSocialMedia";

const NurseryHomePage = () => {
  const { data, refetch, isLoading } = useCustomDataQuery({ params: "nursery" });
  
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BlogIdsContext);

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
    document.body.classList.add("home", "layout-20");
    document.body.style.backgroundImage = `url(${storageURL + data?.home_banner?.background_image})`;
    document.body.style.setProperty("--theme-color", "#81ba00");
    return () => {
      document.body.classList.remove("home", "layout-20");
      document.body.style = "";
    };
  }, [data]);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <div className='bg-white'>
      {/* Home Banner */}
      <WrapperComponent classes={{ sectionClass: "p-0", fluidClass: "home-slider overflow-hidden" }} noRowCol={true}>
        <HomeSlider bannerData={data?.home_banner} height={724} width={1735} />
      </WrapperComponent>

      {/* Product List */}
      {data?.products_list?.status && (
        <WrapperComponent classes={{ sectionClass: `section-b-space`, fluidClass: "container" }}>
          <TitleBox type='premium' title={data?.products_list} space={false} />
          <HomeProduct productIds={data?.products_list?.product_ids || []} style='vertical' slider={true} sliderOptions={horizontalProductSlider5} />
        </WrapperComponent>
      )}

      {/* Category Products */}
      {data?.category_product?.status && (
        <section className='p-0 section-t-space'>
          <div className='tab-bg tab-grey-bg w-100'>
            <Container fluid>
              <Row>
                <Col>
                  <TitleBox type='premium' title={data?.category_product} space={false} />
                  <HomeProductTab categoryIds={data?.category_product?.category_ids} product_box_style='horizontal' style='horizontal' />
                </Col>
              </Row>
            </Container>
          </div>
        </section>
      )}

      {/* Featured Blogs */}
      {data?.featured_blogs?.status && (
        <WrapperComponent classes={{ sectionClass: "blog ratio2_3", fluidClass: "container" }} colProps={{ md: "12" }}>
          <TitleBox title={data?.featured_blogs} type='premium' space={false} />
          <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
        </WrapperComponent>
      )}

      {/* Brand */}
      {data?.brand?.status && (
        <section className='section-b-space section-t-space'>
          <HomeBrand brandIds={data?.brand?.brand_ids || []} />
        </section>
      )}

      {/* Social Media */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className='instagram ratio_square section-t-space'>
          <HomeSocialMedia media={data?.social_media || []} classes='container-fluid p-0' type='borderless' />
        </section>
      )}
    </div>
  );
};

export default NurseryHomePage;
