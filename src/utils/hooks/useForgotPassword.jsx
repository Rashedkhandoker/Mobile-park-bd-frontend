import { useMutation } from "@tanstack/react-query";
import { customerForgotPassword } from "../backendApi/customerAuthApi";
import { YupObject, emailSchema } from "../validation/ValidationSchema";

export const ForgotPasswordSchema = YupObject({ email: emailSchema });

/**
 * Backend flow: POST /customers/password/forgot sends a reset link to the
 * email (link points at /reset-password?token=...). Always returns 200 to
 * avoid email enumeration — so we always show the "check your email" note.
 */
const useHandleForgotPassword = (setShowBoxMessage, setSuccessMessage) => {
  return useMutation({
    mutationFn: (data) => customerForgotPassword(data.email),
    onSuccess: (body) => {
      setShowBoxMessage?.("");
      setSuccessMessage?.(body?.message || "If your email is registered, a password reset link has been sent");
    },
    onError: (err) => {
      setSuccessMessage?.("");
      setShowBoxMessage?.(err?.response?.data?.message || "Failed to send reset email");
    },
  });
};
export default useHandleForgotPassword;
