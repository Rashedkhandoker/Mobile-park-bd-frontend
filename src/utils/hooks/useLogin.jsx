import AccountContext from "@/context/accountContext";
import CartContext from "@/context/cartContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { loginCustomer } from "../backendApi/customerAuthApi";
import { YupObject, emailSchema, passwordSchema, recaptchaSchema } from "../validation/ValidationSchema";

export const LogInSchema = YupObject({
  email: emailSchema,
  password: passwordSchema,
  recaptcha: recaptchaSchema,
});

const useHandleLogin = (setShowBoxMessage) => {
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const CallBackUrl = Cookies.get("CallBackUrl") ? Cookies.get("CallBackUrl") : "/account/dashboard";
  const { refetch } = useContext(AccountContext);
  const { refetch: cartRefetch } = useContext(CartContext);
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }) => loginCustomer(email, password),
    onSuccess: (body) => {
      const token = body?.data?.token;
      const customer = body?.data?.customer;
      if (!token) {
        setShowBoxMessage?.(body?.message || "Login failed");
        return;
      }
      Cookies.set("uat", token, { path: "/", expires: 1 });
      if (customer) {
        Cookies.set("account", JSON.stringify(customer), { path: "/" });
        if (typeof window !== "undefined") {
          localStorage.setItem("account", JSON.stringify(customer));
        }
      }
      refetch?.();
      cartRefetch?.();
      setOpenAuthModal?.(false);
      localStorage.removeItem("cart");
      router.push(CallBackUrl);
    },
    onError: (err) => {
      setShowBoxMessage?.(err?.response?.data?.message || "Invalid email or password");
    },
  });
};

export default useHandleLogin;
