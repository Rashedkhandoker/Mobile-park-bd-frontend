"use client";
import request from "@/utils/axiosUtils";
import { ThemeAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useSearchParams } from "next/navigation";
import Bag from "../themes/bag";
import BeautyHomePage from "../themes/beauty";
import BicycleHomePage from "../themes/bicycle";
import BooksHomePage from "../themes/books";
import Christmas from "../themes/christmas";
import DigitalDownload from "../themes/digitalDownload";
import ElectronicsOne from "../themes/electronics/electronicsOne";
import ElectronicsThree from "../themes/electronics/electronicsThree";
import ElectronicsTwo from "../themes/electronics/electronicsTwo";
import Fashion1 from "../themes/fashion/fashion1";
import Fashion2 from "../themes/fashion/fashion2";
import Fashion3 from "../themes/fashion/fashion3";
import Fashion4 from "../themes/fashion/fashion4";
import Fashion5 from "../themes/fashion/fashion5";
import Fashion6 from "../themes/fashion/fashion6";
import Fashion7 from "../themes/fashion/fashion7";
import FlowerHomePage from "../themes/flower";
import FullPage from "../themes/fullPage";
import Furniture1 from "../themes/furniture/Furniture1";
import Furniture2 from "../themes/furniture/Furniture2";
import FurnitureDark from "../themes/furniture/FurnitureDark";
import Game from "../themes/game";
import GogglesHomePage from "../themes/goggles";
import Gradient from "../themes/gradient";
import GymHomePage from "../themes/gym";
import JewelleryThree from "../themes/jewellery/jewelleryThree";
import JewelleryTwo from "../themes/jewellery/jewelleryTwo";
import JewelleryOne from "../themes/jewellery/jwelleryOne";
import KidsHomePage from "../themes/kids";
import MarijuanaHomePage from "../themes/marijuana";
import MarketplaceFour from "../themes/marketplace/marketplaceFour";
import MarketplaceOne from "../themes/marketplace/marketplaceOne";
import MarketplaceThree from "../themes/marketplace/marketplaceThree";
import MarketplaceTwo from "../themes/marketplace/marketplaceTwo";
import Medical from "../themes/medical";
import NurseryHomePage from "../themes/nursery";
import Parallax from "../themes/parallax";
import Perfume from "../themes/perfume";
import PetsHomePage from "../themes/pets";
import ShoesHomePage from "../themes/shoes";
import SingleProduct from "../themes/singleProduct";
import Surfboard from "../themes/surfBoard";
import ToolsHomePage from "../themes/tools";
import VegetablesFour from "../themes/vegetables/vegetablesFour";
import VegetablesOne from "../themes/vegetables/vegetablesOne";
import VegetablesThree from "../themes/vegetables/vegetablesThree";
import VegetablesTwo from "../themes/vegetables/vegetablesTwo";
import VideoHomePage from "../themes/video";
import VideoSlider from "../themes/videoSlider";
import Watch from "../themes/watch";
import YogaHomePage from "../themes/yoga";
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
    // fashion_one: <Fashion1 />,
    // fashion_two: <Fashion2 />,
    // fashion_three: <Fashion3 />,
    // fashion_four: <Fashion4 />,
    // fashion_five: <Fashion5 />,
    fashion_six: <Fashion6 />,
    // fashion_seven: <Fashion7 />,
    // furniture_one: <Furniture1 />,
    // furniture_two: <Furniture2 />,
    // furniture_dark: <FurnitureDark />,
    // electronics_one: <ElectronicsOne />,
    // electronics_two: <ElectronicsTwo />,
    electronics_three: <ElectronicsThree />,
    // vegetables_one: <VegetablesOne />,
    // vegetables_two: <VegetablesTwo />,
    // vegetables_three: <VegetablesThree />,
    // vegetables_four: <VegetablesFour />,
    // marketplace_one: <MarketplaceOne />,
    // marketplace_two: <MarketplaceTwo />,
    // marketplace_three: <MarketplaceThree />,
    // marketplace_four: <MarketplaceFour />,
    // jewellery_one: <JewelleryOne />,
    // jewellery_two: <JewelleryTwo />,
    // jewellery_three: <JewelleryThree />,
    // parallax: <Parallax />,
    // game: <Game />,
    // gym: <GymHomePage />,
    // flower: <FlowerHomePage />,
    // gradient: <Gradient />,
    // bicycle: <BicycleHomePage />,
    // goggles: <GogglesHomePage />,
    // nursery: <NurseryHomePage />,
    // christmas: <Christmas />,
    // kids: <KidsHomePage />,
    // yoga: <YogaHomePage />,
    // pets: <PetsHomePage />,
    // full_page: <FullPage />,
    // tools: <ToolsHomePage />,
    // perfume: <Perfume />,
    // video: <VideoHomePage />,
    // marijuana: <MarijuanaHomePage />,
    // bag: <Bag />,
    // watch: <Watch />,
    // shoes: <ShoesHomePage />,
    // beauty: <BeautyHomePage />,
    // video_slider: <VideoSlider />,
    // surfboard: <Surfboard />,
    // medical: <Medical />,
    // books: <BooksHomePage />,
    // single_product: <SingleProduct />,
    // digital_download: <DigitalDownload />,
  };

  if (themeLoading) return <Loader />;
  return themeBySlug ? checkActive[themeBySlug] : checkActive[activeTheme?.slug];
};

export default ActiveTheme;
