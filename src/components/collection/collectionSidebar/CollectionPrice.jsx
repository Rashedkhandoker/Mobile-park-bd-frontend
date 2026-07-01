import { FilterPrice } from "@/data/CustomData";
import { useCustomSearchParams } from "@/utils/hooks/useCustomSearchParams";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AccordionBody, AccordionHeader, AccordionItem, Input, Label } from "reactstrap";

const CollectionPrice = ({ setFilter, attributeAPIData, isOffCanvas }) => {
  const router = useRouter();
  const [category, attribute, sortBy, field, rating, layout, priceParam] = useCustomSearchParams(["category", "attribute", "sortBy", "field", "rating", "layout", "price"]);
  const { t } = useTranslation("common");
  const pathname = usePathname();

  const currentPrices = priceParam?.price ? priceParam.price.split(",").filter(Boolean) : [];

  const checkPrice = (value) => currentPrices.includes(value);

  const applyPrice = (event) => {
    const value = event.target.value;
    let temp = event.target.checked
      ? [...currentPrices, value]
      : currentPrices.filter((p) => p !== value);

    setFilter((prev) => ({ ...prev, price: temp }));

    if (temp.length > 0) {
      const queryParams = new URLSearchParams({ ...category, ...attribute, ...sortBy, ...field, ...rating, ...layout, price: temp.join(",") }).toString();
      router.push(`${pathname}?${queryParams}`);
    } else {
      const queryParams = new URLSearchParams({ ...category, ...attribute, ...sortBy, ...field, ...rating, ...layout }).toString();
      router.push(`${pathname}?${queryParams}`);
    }
  };

  return (
    <AccordionItem className={`open ${isOffCanvas ? "col-lg-3" : ""}`}>
      <AccordionHeader targetId={(attributeAPIData?.length + 3).toString()}>
        <span>{t("Price")}</span>
      </AccordionHeader>
      <AccordionBody accordionId={(attributeAPIData?.length + 3).toString()}>
        <div className="custom-sidebar-height">
          <ul className="shop-category-list ">
            {FilterPrice.map((price, i) => (
              <div key={i} className="form-check collection-filter-checkbox">
                <Input className="checkbox_animated" type="checkbox" id={`price-${price.id}`} value={price?.value} checked={checkPrice(price?.value)} onChange={applyPrice} />
                <Label className="form-check-label" htmlFor={`price-${price.id}`}>
                  {price?.price ? (
                    <span className="name">{price.text} ${price.price}</span>
                  ) : (
                    <span className="name">${price.minPrice} - ${price.maxPrice}</span>
                  )}
                </Label>
              </div>
            ))}
          </ul>
        </div>
      </AccordionBody>
    </AccordionItem>
  );
};

export default CollectionPrice;
