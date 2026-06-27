import CartContext from "@/context/cartContext";
import SettingContext from "@/context/settingContext";
import { Href } from "@/utils/constants";
import Link from "next/link";
import { useContext } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Avatar from "../widgets/Avatar";
import { placeHolderImage } from "../widgets/Placeholder";
import HandleQuantity from "./HandleQuantity";

const MobileCartCard = ({ elem }) => {
  const { removeCart } = useContext(CartContext);
  const { convertCurrency } = useContext(SettingContext);

  const removeItem = () => {
    removeCart(elem?.variation_id ? elem?.variation_id : elem.product_id, elem?.id);
  };

  return (
    <div className="mobile-cart-card">
      <div className="mobile-cart-card-top">
        <Link href={`/product/${elem?.product?.slug}`} className="mobile-cart-img">
          <Avatar customClass="product-image" customImageClass="img-fluid" data={elem?.variation?.variation_image ?? elem?.product?.product_thumbnail} placeHolder={placeHolderImage} name={elem?.product?.name} />
        </Link>
        <div className="mobile-cart-info">
          <Link href={`/product/${elem?.product?.slug}`} className="mobile-cart-name">
            {elem?.variation?.name ?? elem?.product?.name}
          </Link>
          <h4 className="mobile-cart-price td-color">{convertCurrency(elem?.product?.sale_price)}</h4>
          <p className="mobile-cart-subtotal">Total: {convertCurrency(elem?.sub_total)}</p>
        </div>
      </div>
      <div className="mobile-cart-card-bottom">
        <div className="qty-box">
          <HandleQuantity productObj={elem?.product} classes={{ customClass: "quantity-price" }} elem={elem} />
        </div>
        <a href={Href} className="mobile-cart-delete" onClick={removeItem}>
          <RiDeleteBin6Line />
        </a>
      </div>
    </div>
  );
};

export default MobileCartCard;
