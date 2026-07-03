import CustomModal from "@/components/widgets/CustomModal";
import AccountContext from "@/context/accountContext";
import { changeCustomerPassword, updateCustomerProfile } from "@/utils/backendApi/customerAuthApi";
import { ToastNotification } from "@/utils/customFunctions/ToastNotification";
import { YupObject, nameSchema, passwordConfirmationSchema, passwordSchema } from "@/utils/validation/ValidationSchema";
import { Form, Formik } from "formik";
import { useContext } from "react";
import EmailPasswordForm from "./EmailPasswordForm";
import UpdatePasswordForm from "./UpdatePasswordForm";

const EmailPasswordModal = ({ modal, setModal }) => {
  const { accountData, setAccountData, refetch } = useContext(AccountContext);

  return (
    <>
      <CustomModal modal={modal == "email" || modal == "password" ? true : false} setModal={setModal} classes={{ modalClass: "theme-modal-2", modalBodyClass: "address-form", title: `${modal == "email" ? "Edit Profile" : "ChangePassword"}` }}>
        <Formik
          enableReinitialize
          initialValues={{
            name: accountData?.name || "",
            email: accountData?.email,
            country_code: accountData?.country_code || "880",
            phone: accountData?.phone || "",
            current_password: "",
            password: "",
            password_confirmation: "",
          }}
          validationSchema={YupObject({
            name: nameSchema,
            current_password: modal == "password" && nameSchema,
            password: modal == "password" && passwordSchema,
            password_confirmation: modal == "password" && passwordConfirmationSchema,
          })}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            try {
              if (modal == "password") {
                await changeCustomerPassword(values.current_password, values.password, values.password_confirmation);
                ToastNotification("success", "Password changed successfully");
              } else {
                await updateCustomerProfile({ name: values.name, phone: values.phone });
                setAccountData((prev) => ({ ...prev, name: values.name, phone: values.phone }));
                refetch?.();
                ToastNotification("success", "Profile updated successfully");
              }
              setModal("");
              resetForm();
            } catch (err) {
              ToastNotification("error", err?.response?.data?.message || "Update failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form>
            {modal == "email" && <EmailPasswordForm  setModal={setModal} />}
            {modal == "password" && <UpdatePasswordForm  setModal={setModal} />}
          </Form>
        </Formik>
      </CustomModal>
    </>
  );
};

export default EmailPasswordModal;
