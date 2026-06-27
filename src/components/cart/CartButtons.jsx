import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";

const CartButtons = () => {
  const { t } = useTranslation("common");
  return (
    <Row className="cart-buttons align-items-stretch g-3">
      <Col xs="6" className="d-flex">
        <Link href="/collections" className="btn w-100 d-flex align-items-center justify-content-center">
          {t("ContinueShopping")}
        </Link>
      </Col>
      <Col xs="6" className="d-flex">
        <Link href="/checkout" className="btn w-100 d-flex align-items-center justify-content-center">
          {t("Checkout")}
        </Link>
      </Col>
    </Row>
  );
};

export default CartButtons;
