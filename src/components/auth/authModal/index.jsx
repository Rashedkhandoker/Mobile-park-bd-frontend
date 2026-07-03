import ThemeOptionContext from "@/context/themeOptionsContext";
import { Href } from "@/utils/constants";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = () => {
  const [state, setState] = useState("login");
  const [title, setTitle] = useState("Sign in");
  const { t } = useTranslation("common");
  const [logOrNew, setLogOrNew] = useState(false);
  const { openAuthModal, setOpenAuthModal, themeOption } = useContext(ThemeOptionContext);
  const router = useRouter();

  const handleClick = () => {
    setState(state == "login" ? "register" : "login");
    setLogOrNew(!logOrNew);
  };

  const protectedRoutes = [`/account/dashboard`, `/account/order`, `/account/addresses`];

  useEffect(() => {
    if (state == "forgot") {
      setTitle("ForgotPassword");
    } else if (state == "register") {
      setTitle("CreateAccount");
    } else {
      setTitle("SignIn");
    }
  }, [state]);

  return (
    <Modal toggle={() => setOpenAuthModal(false)} className="auth-modal modal-dialog-centered d-block modal-xl fade show" isOpen={openAuthModal}>
      <div className="modal-dialog ">
        <div className="modal-content">
          <ModalBody>
            <div className="modal-content open">
              <div className="d-flex justify-content-center align-items-center">
                <div className="right-content w-lg-50 w-100">
                  <div>
                    <div className="auth-title">
                      <h3>{t(title)}</h3>
                      <p>{t("AuthModalDescription")}</p>
                    </div>
                    {state == "register" && <RegisterForm />}
                    {state == "login" && <LoginForm setState={setState} />}
                    {state == "forgot" && <ForgotPasswordForm setState={setState} />}
                    {state !== "forgot" && (
                      <>
                        <div className="divider">
                          <span>{t("OR")}</span>
                        </div>
                        <p className="create">
                          {state == "login" ? t("Don'thaveanaccount") : t("Alreadyhaveanaccount")} ?{" "}
                          <a href={Href} onClick={handleClick}>
                            {logOrNew ? t("Login") : t("Register")} {t("Here")}
                          </a>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
