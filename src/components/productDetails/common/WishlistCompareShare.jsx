import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiShareLine } from "react-icons/ri";
import ShareModal from "./ShareModal";

const WishlistCompareShare = ({ productState }) => {
  const { t } = useTranslation("common");
  const [modal, setModal] = useState(false);

  return (
    <>
      <div className="buy-box">
        {productState?.product?.social_share ? (
          <a onClick={() => setModal(true)}>
            <RiShareLine />
            <span>{t("Share")}</span>
          </a>
        ) : null}
      </div>
      <ShareModal productState={productState} modal={modal} setModal={setModal} />
    </>
  );
};

export default WishlistCompareShare;
