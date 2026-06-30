"use client";
import NoDataFound from "@/components/widgets/NoDataFound";
import Pagination from "@/components/widgets/Pagination";
import ProductBox from "@/components/widgets/productBox";
import ProductSkeleton from "@/components/widgets/skeletonLoader/ProductSkeleton";
import WrapperComponent from "@/components/widgets/WrapperComponent";
import { useAllProducts } from "@/utils/hooks/useProducts";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Col, Row } from "reactstrap";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = parseInt(searchParams.get("page")) || 1;
  const sortByParam = searchParams.get("sortBy") || "createdAt";
  const sortDirParam = searchParams.get("sortDir") || "desc";

  const [page, setPage] = useState(pageParam);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [sortDir, setSortDir] = useState(sortDirParam);

  const { data, isLoading } = useAllProducts({
    page,
    limit: 20,
    sortBy,
    sortDir,
  });

  const products = data?.data || [];
  const total = data?.total || 0;
  const perPage = data?.per_page || 20;
  const currentPage = data?.current_page || 1;

  const updateURL = useCallback(
    (newPage) => {
      const params = new URLSearchParams();
      if (newPage > 1) params.set("page", newPage);
      if (sortBy !== "createdAt") params.set("sortBy", sortBy);
      if (sortDir !== "desc") params.set("sortDir", sortDir);
      const qs = params.toString();
      router.push(`/products${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [sortBy, sortDir, router]
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateURL(newPage);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortDir] = e.target.value.split(":");
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setPage(1);
  };

  useEffect(() => {
    updateURL(page);
  }, [sortBy, sortDir]);

  return (
    <>
      <WrapperComponent
        classes={{ sectionClass: "section-b-space", fluidClass: "container" }}
        noRowCol={true}
      >
        <div className="title-header mb-4">
          <h2>All Products</h2>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="mb-0">{total} products found</p>
          <select
            className="form-select w-auto"
            value={`${sortBy}:${sortDir}`}
            onChange={handleSortChange}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="name:asc">Name A-Z</option>
            <option value="name:desc">Name Z-A</option>
            <option value="price:asc">Price Low to High</option>
            <option value="price:desc">Price High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <Row className="g-xl-4 g-lg-3 g-sm-4 g-3">
            {new Array(20).fill(null).map((_, i) => (
              <Col className="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-6" key={i}>
                <ProductSkeleton />
              </Col>
            ))}
          </Row>
        ) : products.length > 0 ? (
          <>
            <Row className="g-xl-4 g-lg-3 g-sm-4 g-3">
              {products.map((product, i) => (
                <Col className="col-xxl-3 col-xl-4 col-lg-6 col-md-4 col-6" key={i}>
                  <ProductBox product={product} style="vertical" />
                </Col>
              ))}
            </Row>

            {total > perPage && (
              <div className="product-pagination mt-4">
                <div className="theme-pagination-block">
                  <nav>
                    <Pagination
                      current_page={currentPage}
                      total={total}
                      per_page={perPage}
                      setPage={handlePageChange}
                    />
                  </nav>
                </div>
              </div>
            )}
          </>
        ) : (
          <NoDataFound
            title="NoProductFound"
            customClass="no-data-added"
            description="No products available at the moment."
            height="345"
            width="345"
            imageUrl="/assets/svg/empty-items.svg"
          />
        )}
      </WrapperComponent>
    </>
  );
};

export default ProductsPage;
