import Btn from "@/elements/buttons/Btn";
import { Href } from "@/utils/constants";
import useHandleForgotPassword, { ForgotPasswordSchema } from "@/utils/hooks/useForgotPassword";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ForgotPasswordForm = ({ setState }) => {
  const [showBoxMessage, setShowBoxMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { t } = useTranslation("common");
  const { mutate, isPending } = useHandleForgotPassword(setShowBoxMessage, setSuccessMessage);
  return (
    <>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => mutate(values)}
      >
        {({ errors, touched }) => (
          <Form className="auth-form-box">
            {showBoxMessage && (
              <div role="alert" className="alert alert-danger login-alert">
                <i className="ri-error-warning-line"></i> {showBoxMessage}
              </div>
            )}
            {successMessage && (
              <div role="alert" className="alert alert-success login-alert">
                <i className="ri-checkbox-circle-line"></i> {successMessage}
              </div>
            )}
            <div className="auth-box mb-3">
              <label htmlFor="email">{t("Email")}</label>
              <Field name="email" className="form-control" id="email" placeholder={t("Email")} required />
              {errors.email && touched.email && <ErrorMessage name="email" render={(msg) => <div className="invalid-feedback d-block">{errors.email}</div>} />}
            </div>
            <Btn loading={isPending} type="submit" title={"Send"} />
            <a onClick={() => setState("login")} href={Href} className="modal-back">
              <i className="ri-arrow-left-line"></i>
            </a>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ForgotPasswordForm;
