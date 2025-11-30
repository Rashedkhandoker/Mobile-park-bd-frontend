"use client";
import request from "@/utils/axiosUtils";
import { ThemeAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useSearchParams } from "next/navigation";

import ElectronicsThree from "../themes/electronics/electronicsThree";
import { useContext } from "react";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Loader from "@/layout/loader";

const ActiveTheme = () => {
  const { data, isLoading } = useFetchQuery([ThemeAPI], () => request({ url: ThemeAPI }), { enabled: true, refetchOnWindowFocus: false, select: (res) => res?.data.data });
  const search = useSearchParams();
  const themeBySlug = search.get("theme");
  const activeTheme = data?.find((elem) => elem.status === 1);
  const { isLoading: themeLoading } = useContext(ThemeOptionContext);

  const checkActive = {
    
    electronics_three: <ElectronicsThree />,
    
  };

  if (themeLoading) return <Loader />;
  return themeBySlug ? checkActive[themeBySlug] : checkActive[activeTheme?.slug];
};

export default ActiveTheme;
