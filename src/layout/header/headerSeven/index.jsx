import ThemeOptionContext from "@/context/themeOptionsContext";
import { Href } from "@/utils/constants";
import { useHeaderScroll } from "@/utils/hooks/HeaderScroll";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { RiMenuLine, RiUserLine } from "react-icons/ri";
import { Button, Col, Container, Row } from "reactstrap";
import HeaderCart from "../widgets/headerCart";
import HeaderLogo from "../widgets/HeaderLogo";
import HeaderSearchbar from "../widgets/headerSearchbar";
import MainHeaderMenu from "../widgets/mainHeaderMenu";

const HeaderSeven = () => {
  const { themeOption, setMobileSideBar, mobileSideBar } = useContext(ThemeOptionContext);
  const isAuthenticated = Cookies.get("uat");
  const UpScroll = useHeaderScroll(false);
  const { t } = useTranslation("common");
  const router = useRouter();
  const handleProfileClick = () => {
    isAuthenticated ? router.push("/account/dashboard") : setOpenAuthModal(true);
  };

  return (
    <header className={`header-tools header-style ${themeOption?.header?.sticky_header_enable && UpScroll ? "sticky fixed" : ""}`}>
      <div className="logo-menu-part">
        <Container className="border-bottom-0">
          <Row>
            <Col sm="12">
              <div className="main-menu">
                <div className="menu-left">
                  <div className="toggle-nav" onClick={() => setMobileSideBar(!mobileSideBar)}>
                    <RiMenuLine className="sidebar-bar" />
                  </div>
                  <div className="brand-logo">
                    <HeaderLogo />
                  </div>
                </div>
                <div className="menu-right pull-right">
                  <div className="main-navbar">
                    <div id="mainnav">
                      <div className="header-nav-middle">
                        <div className="main-nav navbar navbar-expand-xl navbar-light navbar-sticky">
                          <div className={`offcanvas offcanvas-collapse order-xl-2 ${mobileSideBar ? "show" : ""} `}>
                            <div className="offcanvas-header navbar-shadow">
                              <h5>{t("Menu")}</h5>
                              <Button close className="lead" id="toggle_menu_btn" type="button" onClick={() => setMobileSideBar(false)}>
                                <div>
                                  <i className="ri-close-fill"></i>
                                </div>
                              </Button>
                            </div>
                            <div className="offcanvas-body">
                              <MainHeaderMenu />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="icon-nav">
                      <ul>
                        <li className="onhover-div">
                          <Link href={isAuthenticated ? "/account/dashboard" : Href} onClick={handleProfileClick}>
                            <RiUserLine />
                          </Link>
                        </li>
                        <li className="onhover-div">
                          <HeaderSearchbar />
                        </li>
                        <li className="onhover-div">
                          <HeaderCart />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
};

export default HeaderSeven;
