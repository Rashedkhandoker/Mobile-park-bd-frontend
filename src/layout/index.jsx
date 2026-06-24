"use client";
import AccountProvider from "@/context/accountContext/AccountProvider";
import BrandProvider from "@/context/brandContext/BrandProvider";
import BrandIdsProvider from "@/context/brandIdsContext/BrandIdsProvider";
import CartProvider from "@/context/cartContext/CartProvider";
import CategoryProvider from "@/context/categoryContext/CategoryProvider";
import CurrencyProvider from "@/context/currencyContext/CurrencyProvider";
import ProductProvider from "@/context/productContext/ProductProvider";
import ProductIdsProvider from "@/context/productIdsContext/ProductIdsProvider";
import SettingProvider from "@/context/settingContext/SettingProvider";
import ThemeOptionProvider from "@/context/themeOptionsContext/ThemeOptionProvider";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import SubLayout from "./SubLayout";

const MainLayout = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={children.dehydratedState}>
          <SettingProvider>
            <CategoryProvider>
              <ThemeOptionProvider>
                <BrandProvider>
                  <CurrencyProvider>
                    <ProductIdsProvider>
                      <AccountProvider>
                        <CartProvider>
                          <BrandIdsProvider>
                            <ProductProvider>
                              <SubLayout children={children} />
                            </ProductProvider>
                          </BrandIdsProvider>
                        </CartProvider>
                      </AccountProvider>
                    </ProductIdsProvider>
                  </CurrencyProvider>
                </BrandProvider>
              </ThemeOptionProvider>
            </CategoryProvider>
          </SettingProvider>
        </HydrationBoundary>
      </QueryClientProvider>
      <ToastContainer autoClose={2000} theme="colored" />
    </>
  );
};

export default MainLayout;
