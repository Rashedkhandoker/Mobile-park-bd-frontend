import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import ProductIdsContext from "@/context/productIdsContext";
import { horizontalProductSlider5 } from "@/data/sliderSetting/SliderSetting";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HomeBlog from "../../widgets/HomeBlog";
import HomeBrand from "../../widgets/HomeBrand";
import HomeCategorySidebar from "../../widgets/HomeCategorySidebar";
import HomeProduct from "../../widgets/HomeProduct";
import HomeProductTab from "../../widgets/HomeProductTab";
import HomeServices from "../../widgets/HomeService";
import HomeSlider from "../../widgets/HomeSlider";
import HomeTitle from "../../widgets/HomeTitle";
import Loader from "@/layout/loader";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";

const VegetablesThree = () => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "vegetables_three" });
  const { t } = useTranslation("common");
  const [banners, setBanners] = useState([]);
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
    if (data?.banner?.banners?.length > 0) {
      let banners = data?.banner?.banners?.filter((item) => {
        return item?.status;
      });
      setBanners(banners);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [isLoading]);

  useEffect(() => {
    document.body.classList.add("home", "having-sidemenu");
    return () => {
      document.body.classList.remove("home", "having-sidemenu");
    };
  }, []);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Category Sidebar */}
      <header className="left-header left-header-sm">
        <div className="metro">
          <div className="main-menu">
            <div className="menu-left">
              <div className="sidenav svg-icon-menu">
                <nav>
                  <div>
                    <div className="sidebar-back text-start d-xl-none d-block">{t("Back")}</div>
                  </div>
                  <div className="left-sidebar_center">
                    <HomeCategorySidebar categoryIds={data?.sidebar_category?.category_ids} height={48} width={48} style="classic_vertical" />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-0 section-t-space">
        <section className="p-0 section-t-space">
          {/* Home Banner */}
          <WrapperComponent classes={{ sectionClass: "pt-0 overflow-hidden", fluidClass: "container-fluid p-0" }}>
              <div className="home-slider">
                <HomeSlider bannerData={data?.home_banner} height={777} width={1376} />
                </div>
          </WrapperComponent>
        </section>

        <div className="container-fluid p-0-xl">
          {/* Services */}
          {data?.services && (
            <WrapperComponent classes={{ sectionClass: "service-w-bg banner-padding", fluidClass: "container-fluid" }} noRowCol={true}>
              <HomeServices services={data?.services?.banners} />
            </WrapperComponent>
          )}

          {/* Category Product */}
          {data?.category_product?.status && (
            <WrapperComponent classes={{ sectionClass: "ratio_square bg-title wo-bg", fluidClass: "container" }} customCol={false}>
              <HomeTitle title={data?.category_product} type="basic" space={false} />
              <HomeProductTab paginate={5} classes={"row-cols-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-5"} categoryIds={data?.category_product?.category_ids} style="vertical" tabStyle="basic" title={data?.category_product} />
            </WrapperComponent>
          )}

          {/* Banners */}
          {banners?.length && (
            <WrapperComponent classes={{ sectionClass: `pb-0 ratio2_1 banner-section`, fluidClass: "ratio2_1 container", row: "g-sm-4 g-3" }} customCol={true}>
              {banners?.map((banner, index) => (
                <div key={index} className={banners.length == 3 ? "col-md-4" : banners.length == 2 ? "col-md-6" : "col-12"}>
                  <ImageLink imgUrl={banner} bgImg={true} />
                </div>
              ))}
            </WrapperComponent>
          )}

          {/* Product List  */}
          {data?.products_list?.status && (
            <WrapperComponent classes={{ fluidClass: "container" }} colProps={{ xs: "12" }}>
              <TitleBox title={data?.products_list} type="basic" space={false} />
              <HomeProduct productIds={data?.products_list?.product_ids || []} style="vertical" slider={true} sliderOptions={horizontalProductSlider5} />
            </WrapperComponent>
          )}

          {/* Featured Blogs */}
          {data?.featured_blogs?.status && (
            <WrapperComponent classes={{ sectionClass: "blog left-blog ratio3_2", fluidClass: "container" }} customCol={true}>
              <HomeTitle title={data?.featured_blogs} type="basic" space={false} />
              <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} blogEffect="basic-effect" />
            </WrapperComponent>
          )}

          {/* Brand */}
          {data?.brand?.status && (
            <section className="section-b-space section-t-space">
              <HomeBrand brandIds={data?.brand?.brand_ids || []} />
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default VegetablesThree;
