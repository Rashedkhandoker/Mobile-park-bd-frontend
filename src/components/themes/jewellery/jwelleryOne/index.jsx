import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider5, instagramSlider5, jewelleryCategorySlider } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import { ImagePath } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect } from "react";
import { Container } from "reactstrap";
import HomeBrand from "../../widgets/HomeBrand";
import HomeCategorySidebar from "../../widgets/HomeCategorySidebar";
import HomeProduct from "../../widgets/HomeProduct";
import HomeProductTab from "../../widgets/HomeProductTab";
import HomeServices from "../../widgets/HomeService";
import HomeSlider from "../../widgets/HomeSlider";
import HomeSocialMedia from "../../widgets/HomeSocialMedia";

const JewelleryOne = () => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "jewellery_one" });
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const { setGetBlogIds, isLoading: blogLoading } = useContext(BlogIdsContext);

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
    document.body.classList.add("home", "bg_cls");
    return () => {
      document.body.classList.remove("home", "bg_cls");
    };
  }, []);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home Banner */}
      <WrapperComponent classes={{ sectionClass: "p-0 overflow-hidden", fluidClass: "home-slider" }} colProps={{ xl: "12" }}>
        <HomeSlider bannerData={data?.home_banner} height={966} width={1835} />
      </WrapperComponent>

      {/* Categories */}
      {data?.categories?.status && (
        <Container>
          <section className="border-section border-top-0 border-bottom-0 section-t-space">
            <HomeCategorySidebar categoryIds={data?.categories?.category_ids} style="standard" slider={true} sliderOptions={jewelleryCategorySlider} />
          </section>
        </Container>
      )}

      {/* Product List 1  */}
      {data?.products_list?.status && (
        <WrapperComponent classes={{ sectionClass: "section-b-space pt-0", fluidClass: "container" }} noRowCol={true}>
          <TitleBox title={data?.products_list} type="jewellery" space={true} />
          <HomeProduct productIds={data?.products_list?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider5} />
        </WrapperComponent>
      )}

      {/* Services */}
      {data?.services && (
        <Container className={!data?.products_list?.status ? "section-t-space" : ""}>
          <section className="pt-0 service section-b-space section-t-space">
            <HomeServices services={data?.services?.banners} type="simple" />
          </section>
        </Container>
      )}

      {/* Full Banner */}
      {data?.full_banner?.status && (
        <section className="p-0 section-t-space">
          <ImageLink imgUrl={data?.full_banner} placeholder={`${ImagePath}/full_column_banner.png`} height={562} width={1835} />
        </section>
      )}

      {/* Category Products */}
      {data?.category_product?.status && (
        <>
          <TitleBox type="jewellery" title={data?.category_product} space={true} />
          <WrapperComponent classes={{ sectionClass: "pt-0 ", fluidClass: "container" }} noRowCol={true}>
            <HomeProductTab categoryIds={data?.category_product?.category_ids} product_box_style="vertical" style="vertical" />
          </WrapperComponent>
        </>
      )}

      {/* Social Media */}
      {data?.social_media?.status && (
        <WrapperComponent classes={{ sectionClass: "instagram section-b-space ratio_square", col: "p-0", row: "m-0", fluidClass: "container" }} colProps={{ md: 12 }}>
          <HomeSocialMedia sliderOptions={instagramSlider5} media={data?.social_media || []} classes="container" type="borderless" />
        </WrapperComponent>
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

export default JewelleryOne;
