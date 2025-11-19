"use client";
import ImageLink from "@/components/widgets/imageLink";
import TitleBox from "@/components/widgets/title";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import BlogIdsContext from "@/context/blogIdsContext";
import BrandIdsContext from "@/context/brandIdsContext";
import CategoryContext from "@/context/categoryContext";
import ProductIdsContext from "@/context/productIdsContext";
import { DarkCategory } from "@/data/sliderSetting/SliderSetting";
import Loader from "@/layout/loader";
import { Href, ImagePath, storageURL } from "@/utils/constants";
import useCustomDataQuery from "@/utils/hooks/useCustomDataQuery";
import { useSkeletonLoader2 } from "@/utils/hooks/useSkeleton2";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import Slider from "react-slick";
import { Col, Container, Row } from "reactstrap";
import HomeBlog from "../widgets/HomeBlog";
import HomeBrand from "../widgets/HomeBrand";
import HomeProduct from "../widgets/HomeProduct";
import HomeServices from "../widgets/HomeService";
import HomeSlider from "../widgets/HomeSlider";
import HomeTitle from "../widgets/HomeTitle";

const FurnitureDark = ({ slug }) => {
  const { data, isLoading, refetch } = useCustomDataQuery({ params: "furniture_dark" });
  const { setGetProductIds, isRefetching: productLoad } = useContext(ProductIdsContext);
  const { filterCategory } = useContext(CategoryContext);
  const { setGetBlogIds, isLoading: blogLoading } = useContext(BlogIdsContext);
  const { setGetBrandIds, isLoading: brandLoading } = useContext(BrandIdsContext);
  const categoryData = filterCategory("product");

  useEffect(() => {
    if (data?.products_ids?.length > 0) {
      setGetProductIds({ ids: Array.from(new Set(data?.products_ids))?.join(",") });
    }
    if (data?.brands?.brand_ids?.length > 0) {
      setGetBrandIds({ ids: Array.from(new Set(data?.brands?.brand_ids))?.join(",") });
    }
  }, [data]);

  const filterCategoryData = (categoryData, categoryIds) => {
    if (!categoryData || !categoryIds) {
      return [];
    }

    const filteredCategories = [];
    const filteredSubCategoryIds = new Set(categoryIds);

    const filterCategory = (category) => {
      if (filteredSubCategoryIds.has(category.id)) {
        filteredCategories.push(category);
      }
      if (category.subcategories) {
        category.subcategories.forEach((subcategory) => {
          filterCategory(subcategory);
        });
        return;
      }
    };
    categoryData.forEach(filterCategory);
    return filteredCategories;
  };

  const mainCategories = filterCategoryData(categoryData, data?.categories_icon_list?.category_ids);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    document.body.classList.add("dark2", "home", "dark-demo");
    return () => {
      document.body.classList.remove("dark2", "home", "dark-demo");
    };
  }, []);

  useSkeletonLoader2([productLoad, blogLoading, brandLoading]);
  if (isLoading && document.body) return <Loader />;

  return (
    <>
      {/* Home Banner */}
      <WrapperComponent classes={{ sectionClass: "p-0", fluidClass: "slide-1 home-slider" }} noRowCol={true}>
        <HomeSlider bannerData={data?.home_banner} height={650} width={1920} />
      </WrapperComponent>

      {/* Offer Banners */}
      <WrapperComponent classes={{ sectionClass: "banner-padding absolute-banner banner-style-2 pb-0 ratio2_1", fluidClass: "absolute-bg" }} noRowCol={true}>
        <div className="container">
          <Row className="g-lg-4 g-sm-3 g-2">
            {data?.offer_banner?.banner_1?.status && (
              <Col lg="4" sm="6">
                <a href={Href}>
                  <div className="collection-banner p-right text-center dark-banner-skeleton">
                    <div className="absolute-img">
                      <img src={storageURL + data?.offer_banner?.banner_1?.image_url} className="img-fluid" alt="offers" />
                    </div>
                    <div className="contain-banner banner-3">
                      <div>
                        <h4>{data?.offer_banner?.banner_1?.title}</h4>
                        <h2>{data?.offer_banner?.banner_1?.sub_title}</h2>
                      </div>
                    </div>
                  </div>
                </a>
              </Col>
            )}

            {/* Offer Banners 2 */}
            {data?.offer_banner?.banner_2?.status && (
              <Col lg="4" sm="6">
                <a href={Href}>
                  <div className="collection-banner p-right text-center dark-banner-skeleton">
                    <div className="absolute-img">
                      <img src={storageURL + data?.offer_banner?.banner_2?.image_url} className="img-fluid" alt="" />
                    </div>
                    <div className="contain-banner banner-3">
                      <div>
                        <h4>{data?.offer_banner?.banner_2?.title}</h4>
                        <h2>{data?.offer_banner?.banner_2?.sub_title}</h2>
                      </div>
                    </div>
                  </div>
                </a>
              </Col>
            )}

            {/* Offer Banners 3*/}
            {data?.offer_banner?.banner_3?.status && (
              <Col lg="4" sm="6">
                <a href={Href}>
                  <div className="collection-banner p-right text-center dark-banner-skeleton">
                    <div className="absolute-img">
                      <img src={storageURL + data?.offer_banner?.banner_3?.image_url} className="img-fluid" alt="" />
                    </div>
                    <div className="contain-banner banner-3">
                      <div>
                        <h4>{data?.offer_banner?.banner_3?.title}</h4>
                        <h2>{data?.offer_banner?.banner_3?.sub_title}</h2>
                      </div>
                    </div>
                  </div>
                </a>
              </Col>
            )}
          </Row>
        </div>
      </WrapperComponent>

      {/* Products List 1  */}
      {data?.products_list_1?.status && (
        <>
          <TitleBox type="basic" title={data?.products_list_1} />
          <WrapperComponent classes={{ sectionClass: "pt-0 section-b-space", fluidClass: "container" }} noRowCol={true}>
            <HomeProduct style="vertical" productIds={data?.products_list_1?.product_ids} rowClass="row-cols-xxl-5 row-cols-xl-4 row-cols-md-3 row-cols-2 g-sm-4 g-3" />
          </WrapperComponent>
        </>
      )}

      {/* Product Categories */}
      {data?.categories_icon_list?.status && (
        <div className="container category-button button-dark">
          <section className="section-b-space border-section section-t-space">
            <div className="no-arrow">
              <Slider {...DarkCategory}>
                {mainCategories?.map((category, index) => (
                  <div key={index} className="me-2">
                    <Link className="btn btn-outline btn-block" href={`/category/${category?.slug}`}>
                      <Image className="img-fluid" src={category?.category_icon?.original_url ? category?.category_icon?.original_url : `${ImagePath}/placeholder/category.png`} height={200} width={200} alt={category?.slug} />
                      <span>{category?.name}</span>
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
          </section>
        </div>
      )}

      {/* Banners */}
      {data?.banner?.status && (
        <div className="category-bg onerow-cat ratio3_2">
          <Container fluid className="p-0">
            <Row className="order-section">
              <Col sm="4" className="p-0">
                <ImageLink imgUrl={data?.banner?.banner_1} classes="image-block" bgImg={true} />
              </Col>
              <Col sm="4" className="p-0">
                <ImageLink imgUrl={data?.banner?.banner_2} classes="image-block" bgImg={true} />
              </Col>
              <Col sm="4" className="p-0">
                <ImageLink imgUrl={data?.banner?.banner_3} classes="image-block" bgImg={true} />
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Products */}
      {data?.product_list_2?.status && (
        <WrapperComponent classes={{ sectionClass: "container" }} customCol={true}>
          {data?.product_list_2?.left_panel?.status && (
            <Col xl="3" className=" d-xl-block d-none left-panel">
              <ImageLink imgUrl={data?.product_list_2?.left_panel} height={804} width={326} />
            </Col>
          )}
          {!data?.product_list_2?.products?.status && (
            <Col xl="9">
              <Container className="p-0">
                <Row>
                  <Col>
                    <Row className="four-product dark-box">
                      <Col>
                        <HomeProduct style="vertical" productIds={data?.product_list_2?.products?.product_ids || []} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </Col>
          )}
        </WrapperComponent>
      )}

      {/* Services */}
      {data?.services && (
        <Container className="section-t-space">
          <section className="service border-section small-section section-t-space">
            <HomeServices services={data?.services?.banners} />
          </section>
        </Container>
      )}

      {/* Blogs */}
      {data?.featured_blogs?.status && (
        <>
          <Container>
            <Row>
              <Col>
                <HomeTitle title={data?.featured_blogs} type="basic" />
              </Col>
            </Row>
          </Container>
          <WrapperComponent classes={{ sectionClass: "blog pt-0 section-b-space left-blog ratio2_3", fluidClass: "container" }} colProps={{ md: "12" }}>
            <HomeBlog blogIds={data?.featured_blogs?.blog_ids || []} />
          </WrapperComponent>
        </>
      )}

      {/* Brands */}
      {data?.brand?.status && (
        <section className="section-b-space section-t-space">
          <HomeBrand brandIds={data?.brand?.brand_ids || []} bgLight={true} />
        </section>
      )}
    </>
  );
};

export default FurnitureDark;
