import NoDataFound from "@/components/widgets/NoDataFound";
import Pagination from "@/components/widgets/Pagination";
import ProductBox from "@/components/widgets/productBox";
import ProductSkeleton from "@/components/widgets/skeletonLoader/ProductSkeleton";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { getProducts } from "@/utils/services/productService";
import { ImagePath } from "@/utils/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import ListProductBox from "./ListProductBox";

const CollectionProducts = ({ filter, grid, infiniteScroll, categorySlug }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const [adjustGrid, setAdjustGrid] = useState("col-6 col-lg-4");
  const { t } = useTranslation("common");
  const [infiniteScrollData, setInfiniteScrollData] = useState([]);
  const param = useSearchParams();
  const tagParam = param.get("tag");


  const fetchData = async () => {
    return getProducts({
      page,
      status: 1,
      paginate: filter?.paginate,
      category: categorySlug ? categorySlug : filter?.category.join(",") || tagParam,
      brand: filter.brand.join(","),
      price: filter?.price?.join(","),
      sortBy: filter?.sortBy ?? "asc",
      store_slug: slug ?? null,
    });
  };

  const { data, fetchNextPage, isRefetching, isLoading, fetchStatus, refetch } = useInfiniteQuery({
    queryKey: ["infiniteScroll",filter],
    queryFn: fetchData,
    retryOnMount: false,
    enabled: false,
    getNextPageParam: ({ page, last_page }) => last_page > page && { page: page + 1 },
  });

  const lastPage = data?.pages?.[data?.pages?.length - 1];

  const onLoad = () => {
    if (!isLoading && lastPage?.last_page !== infiniteScrollData.length) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (data?.pages?.length > 0) {
      lastPage?.data?.length && setInfiniteScrollData([...infiniteScrollData, lastPage?.data]);
    }
  }, [data]);

  useEffect(() => {
    fetchNextPage();
    if (!infiniteScroll) {
      window.scroll(0, 0);
    }
  }, [page]);

  useEffect(() => {
    if (grid == 2) {
      setAdjustGrid("col-6");
    } else if (grid == 3) {
      setAdjustGrid("col-xl-4 col-lg-6 col-md-4 col-6");
    } else if (grid == 4) {
      setAdjustGrid("col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-6");
    } else if (grid == "list") {
      setAdjustGrid("col-6 col-sm-12");
    }
  }, [grid]);

  useEffect(() => {
    categorySlug && !isRefetching;
  }, [categorySlug]);

  useEffect(() => {
    refetch()
    setInfiniteScrollData([]); // Reset infinite scroll data when filter changes
  setPage(1); 
  }, [refetch, filter]);

  console.log(data, filter)

  return (
    <>
      {(!infiniteScroll && fetchStatus != "idle") || isLoading ? (
        <Row className="g-xl-4 g-lg-3 g-sm-4 g-3">
          {new Array(40).fill(null).map((_, i) => (
            <Col className={adjustGrid} key={i}>
              <ProductSkeleton />
            </Col>
          ))}
        </Row>
      ) : data?.pages?.length > 0 && lastPage?.data?.length ? (
        <div className={`product-wrapper-grid ${infiniteScroll ? "product-load-more" : ""} ${grid == "list" ? "list-view" : ""} ${themeOption?.product?.full_border ? "full_border" : ""} ${themeOption?.product?.image_bg ? "product_img_bg" : ""} ${themeOption?.product?.product_box_bg ? "full_bg" : ""} ${themeOption?.product?.product_box_border ? "product_border" : ""}`}>
          {!infiniteScroll ? (
            <Row className="g-xl-4 g-lg-3 g-sm-4 g-3">
              {lastPage?.data?.map((product, i) => (
                <Col className={adjustGrid} key={i}>
                  {grid == "list" ? <ListProductBox product={product} /> : <ProductBox product={product} style="vertical" />}
                </Col>
              ))}
            </Row>
          ) : (
            <Row className="g-xl-4 g-lg-3 g-sm-4 g-3">
              {infiniteScrollData?.map((product, i) => (
                <React.Fragment key={i}>
                  {product?.map((item, index) => (
                    <Col className={adjustGrid} key={index}>
                      <ProductBox product={item} style="vertical" />
                    </Col>
                  ))}
                </React.Fragment>
              ))}
            </Row>
          )}
        </div>
      ) : (
        <NoDataFound customClass="no-data-added " title="NoProductFound" description="Please check if you have misspelt something or try searching with other way." height="345" width="345" imageUrl={`/assets/svg/empty-items.svg`} />
      )}
      {!infiniteScroll ? (
        lastPage?.data?.length > 0 && (
          <div className="product-pagination">
            <div className="theme-pagination-block">
              <nav>
                <Pagination current_page={lastPage?.current_page} total={lastPage?.total} per_page={lastPage?.per_page} setPage={setPage} />
              </nav>
            </div>
          </div>
        )
      ) : (
        <div className="load-more-sec">{fetchStatus != "idle" ? <img src={`${ImagePath}/loader.gif`} /> : <a onClick={() => onLoad()}>{t("LoadMore")}</a>}</div>
      )}
    </>
  );
};

export default CollectionProducts;
