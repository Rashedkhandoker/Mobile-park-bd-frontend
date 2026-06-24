import NoDataFound from "@/components/widgets/NoDataFound";
import ProductBox from "@/components/widgets/productBox";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { useProductsByIds } from "@/utils/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { Col, Row } from "reactstrap";

const MenuMedia = ({ menu }) => {
  const { themeOption } = useContext(ThemeOptionContext);

  const productIds = Array.from(new Set(menu?.product_ids ?? []));
  const { data: filterProduct, refetch: productRefetch } = useProductsByIds(productIds);

  useEffect(() => {
    if (menu?.product_ids?.length > 0) {
      productRefetch();
    }
  }, [menu?.product_ids]);

  return (
    <>
      {menu?.mega_menu_type === "product_box" && (
        <Col xl={6} className="dropdown-column d-xl-block d-none">
          {filterProduct?.length > 0 ? (
            <div className="menu-product-slider">
              <div className={` ${themeOption?.product?.full_border ? "full_border" : ""} ${themeOption?.product?.image_bg ? "product_img_bg" : ""} ${themeOption?.product?.product_box_bg ? "full_bg" : ""} ${themeOption?.product?.product_box_border ? "product_border" : ""} `}>
                <Row>
                  {filterProduct?.slice(0, 2)?.map((product, i) => (
                    <Col xs={6} key={i}>
                      <ProductBox product={product} className="boxClass" style="vertical" />
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          ) : (
            <NoDataFound title="NoProductFound" customClass="menu-no-data" />
          )}
        </Col>
      )}
      {menu.mega_menu_type === "side_banner" && (
        <Col xl={3} className="dropdown-column d-xl-block d-none">
          <div className="menu-img-banner">
            <Link href={`/product/deliciously-sweet-watermelon`} className="text-title">
              {menu?.banner_image && <Image src={menu?.banner_image ? menu?.banner_image?.original_url : SideBanner} alt="banner" className="img-fluid" height={511} width={270} />}
            </Link>
          </div>
        </Col>
      )}
      {menu.mega_menu_type === "bottom_banner" && (
        <Col xl={12} className="dropdown-column d-xl-block d-none">
          <div className="menu-img-banner rounded overflow-hidden mx-0 mt-3 mb-0">{menu?.banner_image && <Image src={menu?.banner_image ? menu?.banner_image?.original_url : BottomBanner} alt="banner_landscape" className="img-fluid" height={190} width={954} />}</div>
        </Col>
      )}
    </>
  );
};

export default MenuMedia;
