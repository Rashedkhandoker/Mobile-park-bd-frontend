import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { attributeSlider, categorySlider, instagramSlider5, productSlider4 } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import request from "@/utils/axiosUtils";
import { AttributesAPI } from "@/utils/axiosUtils/API";
import { Href } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Container } from "reactstrap";
import HomeBlog from "../widgets/HomeBlog";
import HomeBrand from "../widgets/HomeBrand";
import HomeCategorySidebar from "../widgets/HomeCategorySidebar";
import HomeFourColumnProduct from "../widgets/HomeFourColumnProduct";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeServices from "../widgets/HomeService";
import HomeSlider from "../widgets/HomeSlider";
import HomeSocialMedia from "../widgets/HomeSocialMedia";
import NoDataFound from "@/components/widgets/NoDataFound";

const ShoesHomePage = () => {
  const { data, refetch, isLoading } = useCustomDataQuery({ params: "shoes" });
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { isLoading: blogLoading } = useContext(BrandIdsContext);
  const [attributeId, setAttributeId] = useState("");
  const {
    data: attributeAPIData,
    isLoading: attributeLoading,
    refetch: attributeRefetch,
  } = useFetchQuery([AttributesAPI], () => request({ url: `${AttributesAPI}/${attributeId}`, params: { status: 1 } }), {
    enabled: !!attributeId,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });

  useEffect(() => {
    if (data?.attribute?.status) {
      setAttributeId(data?.attribute?.attribute_id);
    }
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

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
        <HomeSlider bannerData={data?.home_banner} height={724} width={1835} />
      </WrapperComponent>

      {/* Categories */}
      {data?.categories_1?.status && (
        <Container>
          <WrapperComponent classes={{ sectionClass: "section-b-space border-section border-top-0 category-width" }}>
            <HomeCategorySidebar style='digital' categoryIds={data?.categories_1?.category_ids || []} sliderOptions={categorySlider} />
          </WrapperComponent>
        </Container>
      )}

      {/* About Us And Banners */}
      {data?.about_banner?.status && (
        <>
          <WrapperComponent classes={{ fluidClass: "container", col: "offset-lg-2" }} colProps={{ lg: "8" }}>
            <TitleBox title={data?.about_banner} type='luxury' />
          </WrapperComponent>

          <WrapperComponent classes={{ sectionClass: "section-b-space banner-section pt-0 ratio_40", fluidClass: "container", row: "g-sm-4 g-3" }} customCol={true}>
            {data?.about_banner?.collection_banner?.banner_1?.status && (
              <div className={data?.about_banner?.collection_banner?.banner_2?.status ? "col-md-6" : "col-12"}>
                <ImageLink imgUrl={data?.about_banner?.collection_banner?.banner_1} bgImg={true} />
              </div>
            )}
            {data?.about_banner?.collection_banner?.banner_2?.status && (
              <div className={data?.about_banner?.collection_banner?.banner_1?.status ? "col-md-6" : "col-12"}>
                <ImageLink imgUrl={data?.about_banner?.collection_banner?.banner_2} bgImg={true} />
              </div>
            )}
          </WrapperComponent>
        </>
      )}

      {/* Products List  */}
      {data?.products_list?.status && (
        <WrapperComponent classes={{ sectionClass: `section-b-space ${data?.about_banner?.status ? "pt-0" : "section-t-space"}`, fluidClass: "container" }} noRowCol={true}>
          <TitleBox title={data?.products_list} type='luxury' />
          <HomeProduct productIds={data?.products_list?.product_ids || []} style='vertical' slider={true} sliderOptions={productSlider4} />
        </WrapperComponent>
      )}

      {/* Categories 2 */}
      {data?.categories_2?.status && (
        <WrapperComponent classes={{ sectionClass: "p-0 ratio2_1", fluidClass: "container-fluid" }} noRowCol={true}>
          <HomeCategorySidebar style='shoes' categoryIds={data?.categories_2?.category_ids || []} />
        </WrapperComponent>
      )}

      {/* Four Column Products Or Slider Products*/}
      {data?.slider_products && (
        <WrapperComponent classes={{ fluidClass: "container" }} noRowCol={true}>
          <HomeFourColumnProduct data={data?.slider_products} style='horizontal' />
        </WrapperComponent>
      )}

      {/* Attribute Slider Section */}
      {data?.attribute?.status && (
        <WrapperComponent classes={{ fluidClass: "container", row: "background shoes-category-section" }} customCol={true}>
          {attributeAPIData?.attribute_values?.length ? (
            <Slider {...attributeSlider}>
              {attributeAPIData?.attribute_values?.map((attribute, i) => (
                <a key={i} href={Href}>
                  <div className='contain-bg'>
                    <h4 data-hover='size 06'>{attribute?.value}</h4>
                  </div>
                </a>
              ))}
            </Slider>
          ) : (
            <NoDataFound title={"NoAttributesFound"} customClass={"no-data-added"} />
          )}
        </WrapperComponent>
      )}

      {/* Category Products */}
      {data?.category_product?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space", fluidClass: "container" }}>
          <HomeProductTab categoryIds={data?.category_product?.category_ids} style='vertical' tab_title_class='tab-title2' />
        </WrapperComponent>
      )}

      {/* Featured Blogs */}
      {data?.featured_blogs?.status && (
        <WrapperComponent classes={{ sectionClass: "blog blog-bg section-b-space ratio2_3 ", fluidClass: "container" }} colProps={{ md: "12" }}>
          <TitleBox title={data?.featured_blogs} type='luxury' space={false} />
          <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
        </WrapperComponent>
      )}

      {/* Services */}
      {data?.services && (
        <Container>
          <section className='service border-section small-section border-top-0 section-t-space'>
            <HomeServices services={data?.services?.banners} />
          </section>
        </Container>
      )}

      {/* Social Media */}
      {data?.social_media?.banners?.length && data?.social_media?.status && (
        <section className='instagram ratio_square section-t-space'>
          <HomeSocialMedia sliderOptions={instagramSlider5} media={data?.social_media || []} classes='container' type='borderless' />
        </section>
      )}

      {/* Brand */}
      {data?.brand?.status && (
        <section className='section-b-space section-t-space'>
          <HomeBrand brandIds={data?.brand?.brand_ids || []} />
        </section>
      )}
    </>
  );
};

export default ShoesHomePage;
