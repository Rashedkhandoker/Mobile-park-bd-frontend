import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import Loader from "@/layout/loader";
import { brandSlider3, horizontalProductSlider } from "@/data/sliderSetting/SliderSetting";
import { ImagePath } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import React, { useContext, useEffect } from "react";
import { Container } from "reactstrap";
import HomeBrand from "../widgets/HomeBrand";
import HomeFourColumnProduct from "../widgets/HomeFourColumnProduct";
import HomeParallaxBanner from "../widgets/HomeParallaxBanner";
import HomeProduct from "../widgets/HomeProduct";
import HomeProductTab from "../widgets/HomeProductTab";
import HomeSlider from "../widgets/HomeSlider";

const Game = () => {
  const { data, refetch, isLoading } = useCustomDataQuery({ params: "game" });
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
      <WrapperComponent classes={{ sectionClass: "p-0 effect-cls", fluidClass: "home-slider" }} noRowCol={true}>
        <HomeSlider bannerData={data?.home_banner} height={627} width={1835} />
      </WrapperComponent>

      {/* Offer Banner 1 */}
      {(data?.offer_banner_1?.banner_1?.status || data?.offer_banner_1?.banner_2?.status) && (
        <WrapperComponent classes={{ sectionClass: "pb-0 banner-section ratio_45", fluidClass: "container", row: "g-4" }} customCol={true}>
          {data?.offer_banner_1?.banner_1?.status && (
            <div className={data?.offer_banner_1?.banner_1?.status ? "col-6" : "col-12"}>
              <div className="position-relative">
                <ImageLink imgUrl={data?.offer_banner_1?.banner_1} placeholder={`${ImagePath}/two_column_banner.png`} height={304} width={676} />
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
          )}
          {data?.offer_banner_1?.banner_2?.status && (
            <div className={data?.offer_banner_1?.banner_2?.status ? "col-6" : "col-12"}>
              <div className="position-relative">
                <ImageLink imgUrl={data?.offer_banner_1?.banner_2} placeholder={`${ImagePath}/two_column_banner.png`} height={304} width={676} />
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
          )}
        </WrapperComponent>
      )}

      {/* Category Products */}
      {data?.category_product?.status && (
        <>
          <TitleBox title={data?.category_product} type="basic" />
          <WrapperComponent classes={{ sectionClass: "section-b-space category-tab-section pt-0", fluidClass: "container" }}>
            <HomeProductTab categoryIds={data?.category_product?.category_ids} style="vertical" />
          </WrapperComponent>
        </>
      )}

      {/* Offer Banner 2 */}
      {data?.offer_banner_2?.status && (
        <section className="p-0 banner-sale section-t-space">
          <div className="container">
            <ImageLink imgUrl={data?.offer_banner_2} height={126} width={1376} />
          </div>
        </section>
      )}

      {/* Four Column Products Or Slider Products*/}
      {data?.slider_products && (
        <WrapperComponent classes={{ sectionClass: "section-b-space", fluidClass: "container" }} noRowCol={true}>
          <HomeFourColumnProduct data={data?.slider_products} style="horizontal" />
        </WrapperComponent>
      )}

      {/* Parallax Or Full Banner */}
      {data?.parallax_banner?.status && (
        <section className="p-0 game-parallax effect-cls section-t-space">
          <HomeParallaxBanner banners={data?.parallax_banner} />
        </section>
      )}

      {/* Products List  */}
      {data?.products_list?.status && (
        <>
          <div className="title-1">
            <TitleBox title={data?.products_list} type="basic" />
          </div>
          <Container>
            <HomeProduct productIds={data?.products_list?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider} />
          </Container>
        </>
      )}

      {/* Brand */}
      {data?.brand?.status && (
        <section className="section-b-space section-t-space">
          <HomeBrand sliderOptions={brandSlider3} brandIds={data?.brand?.brand_ids || []} />
        </section>
      )}
    </>
  );
};

export default Game;
