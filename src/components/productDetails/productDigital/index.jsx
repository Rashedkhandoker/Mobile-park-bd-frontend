import WrapperComponent from "@/components/widgets/WrapperComponent";
import { Href } from "@/utils/constants";
import { dateFormat } from "@/utils/customFunctions/DateFormat";
import Link from "next/link";
import { Col } from "reactstrap";
import ProductContent from "../common/ProductContent";
import ProductWholesale from "../common/ProductWholesale";
import VendorContains from "../common/VendorContains";
import DigitalImage from "./DigitalImage";

const ProductDigital = ({ productState, setProductState }) => {
  return (
    <WrapperComponent classes={{ sectionClass: "product-section section-b-space theme-product-section", row: "g-4" }} customCol={true}>
      <Col xl={8} lg={7}>
        <DigitalImage productState={productState} />
      </Col>
      <Col xl={4} lg={5} className="vendor-right-box">
        <div className="right-box-contain">
          <div className="main-right-box-contain">
            <div className="vendor-box">
              <VendorContains productState={productState} />
              <div className="vendor-detail">
                <p>{productState.product.short_description}</p>
              </div>
            </div>

            <ProductContent productState={productState} setProductState={setProductState} />

            <div className="pickup-box">
              <div className="product-title">
                <h4>{"Assets Information"}</h4>
              </div>

              <div className="product-info">
                <ul className="product-info-list product-info-list-2">
                  <li>
                    {"Created"} :<Link href={Href}>{dateFormat(productState?.product?.created_at)}</Link>
                  </li>
                  {productState.product.updated_at && (
                    <li>
                      {"Last Update "}:<Link href={Href}>{dateFormat(productState?.product?.updated_at)}</Link>
                    </li>
                  )}

                  {productState?.product?.tags?.length ? (
                    <li className="d-flex align-items-center">
                      <span>{"Tags"} :</span>
                      <ul className="tag-list">
                        {productState?.product?.tags?.map((tag, i) => (
                          <li key={i}>
                            <Link href={Href}>{tag.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {!productState?.product?.wholesales?.length ? (
          <>
            <ProductWholesale productState={productState} />
          </>
        ) : null}
      </Col>
    </WrapperComponent>
  );
};

export default ProductDigital;
