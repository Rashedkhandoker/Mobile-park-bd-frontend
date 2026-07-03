import NoDataFound from "@/components/widgets/NoDataFound";
import Pagination from "@/components/widgets/Pagination";
import AccountContext from "@/context/accountContext";
import SettingContext from "@/context/settingContext";
import { getCustomerOrders } from "@/utils/backendApi/orderApi";
import { showMonthWiseDateAndTime } from "@/utils/customFunctions/DateFormat";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiEyeLine } from "react-icons/ri";
import { Card, CardBody, Table } from "reactstrap";
import AccountHeading from "../common/AccountHeading";
import Loader from "@/layout/loader";

const STATUS_BADGE = {
  PENDING: "bg-pending",
  CONFIRMED: "bg-pending",
  SHIPPED: "bg-pending",
  DELIVERED: "bg-completed",
  CANCELLED: "bg-cancelled",
};

const MyOrders = () => {
  const [page, setPage] = useState(1);
  const { t } = useTranslation("common");
  const { convertCurrency } = useContext(SettingContext);
  const { accountData } = useContext(AccountContext);
  // Cookie is client-only — gate on mount so SSR and hydration render match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  let customerId = accountData?.id;
  if (!customerId && mounted) {
    try {
      customerId = JSON.parse(Cookies.get("account") || "{}")?.id;
    } catch {
      customerId = undefined;
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["customer-orders", customerId, page],
    queryFn: () => getCustomerOrders(customerId, { page, limit: 10 }),
    enabled: !!customerId,
  });

  const orders = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0 };

  if (!mounted || isLoading)
    return (
      <div className="box-loader">
        <Loader classes={"blur-bg"} />
      </div>
    );

  return (
    <Card className="dashboard-table mt-0">
      <CardBody className="p-0">
        <AccountHeading title="MyOrders" classes={"top-sec"} />
        {orders.length > 0 ? (
          <>
            <div className="total-box mt-0">
              <div className="wallet-table mt-0">
                <div className="table-responsive">
                  <Table className="table cart-table order-table">
                    <thead>
                      <tr className="table-head">
                        <th>{t("OrderNumber")}</th>
                        <th>{t("Date")}</th>
                        <th>{t("Amount")}</th>
                        <th>{t("Status")}</th>
                        <th>Items</th>
                        <th>{t("Option")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <span className="fw-bolder">#{order.id}</span>
                          </td>
                          <td>{showMonthWiseDateAndTime(order?.orderDate || order?.createdAt)}</td>
                          <td>{convertCurrency ? convertCurrency(parseFloat(order?.totalAmount || 0)) : `৳${parseFloat(order?.totalAmount || 0).toFixed(2)}`}</td>
                          <td>
                            <div className={`badge ${STATUS_BADGE[order.status] || "bg-pending"} custom-badge rounded-0`}>
                              <span>{order.status}</span>
                            </div>
                          </td>
                          <td>{order.items?.length ?? "—"}</td>
                          <td>
                            <Link href={`/account/order/details/${order.id}`}>
                              <RiEyeLine />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            {meta.total > meta.limit && (
              <div className="product-pagination">
                <div className="theme-pagination-block">
                  <nav>
                    <Pagination current_page={meta.page} total={meta.total} per_page={meta.limit} setPage={setPage} />
                  </nav>
                </div>
              </div>
            )}
          </>
        ) : (
          <NoDataFound customClass="no-data-added" imageUrl={`/assets/svg/empty-items.svg`} title="NoOrdersFound" description="NoOrdersHaveBeenMadeYet" height="300" width="300" />
        )}
      </CardBody>
    </Card>
  );
};

export default MyOrders;
