import ThemeOptionContext from "@/context/themeOptionsContext";
import { Href } from "@/utils/constants";
import { t } from "i18next";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { RiHome2Line, RiShoppingBagLine, RiUserLine } from "react-icons/ri";

const MobileMenu = () => {
  const { setOpenAuthModal, setCartCanvas } = useContext(ThemeOptionContext);

  const isAuthenticated = Cookies.get("uat");
  const router = useRouter();
  const handleProfileClick = (path) => {
    isAuthenticated ? router.push("/account/dashboard") : setOpenAuthModal(true);
    handleActive(5);
  };
  const [active, setActive] = useState(1);
  const handleActive = (num) => {
    setActive(num);
  };
  return (
    <div className="mobile-menu d-md-none d-block mobile-cart">
      <ul>
        <li className={active == "1" ? "active" : ""} onClick={() => handleActive(1)}>
          <Link href={"/"}>
            <RiHome2Line />
            <span>{t("Home")}</span>
          </Link>
        </li>
        <li className={active == "3" ? "active" : ""}>
          <a href={Href} onClick={() => setCartCanvas(true)}>
            <RiShoppingBagLine />
            <span>{t("Cart")}</span>
          </a>
        </li>
        <li className={active == "5" ? "active" : ""} onClick={() => handleProfileClick()}>
          <a href={Href}>
            <RiUserLine />
            <span>{t("User")}</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;
