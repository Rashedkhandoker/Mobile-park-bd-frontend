import CustomModal from "@/components/widgets/CustomModal";
import NoDataFound from "@/components/widgets/NoDataFound";
import AccountContext from "@/context/accountContext";
import Btn from "@/elements/buttons/Btn";
import { getCustomerAddresses, createAddress, updateAddress, deleteAddress } from "@/utils/backendApi/addressApi";
import { ToastNotification } from "@/utils/customFunctions/ToastNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Row } from "reactstrap";

const emptyForm = { addressLine: "", city: "", region: "", postalCode: "", country: "Bangladesh" };

const AddressForm = ({ initial, onSubmit, isLoading, onCancel }) => {
  const { t } = useTranslation("common");
  const [form, setForm] = useState(initial || emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial || emptyForm);
    setError("");
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.addressLine?.trim() || !form.city?.trim()) {
      setError("Address line and city are required");
      return;
    }
    onSubmit(form);
  };

  const field = (key, label, placeholder, required) => (
    <div className="mb-3">
      <label className="form-label" htmlFor={`addr-${key}`}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={`addr-${key}`}
        className="form-control"
        value={form[key] || ""}
        placeholder={placeholder}
        required={required}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div role="alert" className="alert alert-danger">
          {error}
        </div>
      )}
      {field("addressLine", t("Address"), "House, Road, Area", true)}
      <Row>
        <Col sm={6}>{field("city", t("City"), "Dhaka", true)}</Col>
        <Col sm={6}>{field("region", t("State"), "Dhaka Division")}</Col>
      </Row>
      <Row>
        <Col sm={6}>{field("postalCode", t("Pincode"), "1213")}</Col>
        <Col sm={6}>{field("country", t("Country"), "Bangladesh")}</Col>
      </Row>
      <div className="d-flex gap-2 justify-content-end mt-2">
        <Btn color="transparent" className="btn-outline" type="button" onClick={onCancel}>
          {t("Cancel")}
        </Btn>
        <Btn className="btn-solid" type="submit" loading={isLoading}>
          {t("Save")}
        </Btn>
      </div>
    </form>
  );
};

const AddressHeader = () => {
  const { t } = useTranslation("common");
  const { accountData } = useContext(AccountContext);
  const queryClient = useQueryClient();
  const [modal, setModal] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // Cookie is only readable on the client — gate rendering on mount so the
  // SSR and first client render match (avoids hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Customer id from backend profile; fall back to the account cookie set at login.
  let customerId = accountData?.id;
  if (!customerId && mounted) {
    try {
      customerId = JSON.parse(Cookies.get("account") || "{}")?.id;
    } catch {
      customerId = undefined;
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["customer-addresses", customerId],
    queryFn: () => getCustomerAddresses(customerId),
    enabled: !!customerId,
  });

  const addresses = data?.data || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });

  const createMut = useMutation({
    mutationFn: (form) => createAddress({ ...form, customerId }),
    onSuccess: () => {
      invalidate();
      setModal("");
      ToastNotification("success", "Address added successfully");
    },
    onError: (err) => ToastNotification("error", err?.response?.data?.message || "Failed to add address"),
  });

  const updateMut = useMutation({
    mutationFn: (form) => updateAddress(editTarget.id, form),
    onSuccess: () => {
      invalidate();
      setModal("");
      setEditTarget(null);
      ToastNotification("success", "Address updated successfully");
    },
    onError: (err) => ToastNotification("error", err?.response?.data?.message || "Failed to update address"),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => deleteAddress(id),
    onSuccess: () => {
      invalidate();
      setModal("");
      setDeleteTarget(null);
      ToastNotification("success", "Address removed");
    },
    onError: (err) => ToastNotification("error", err?.response?.data?.message || "Failed to delete address"),
  });

  return (
    <Card>
      <CardBody>
        <div className="top-sec">
          <h3>{t("AddressBook")}</h3>
          <Btn tag="a" size="sm" color="transparent" className=" btn-solid" onClick={() => { setEditTarget(null); setModal("add"); }}>
            + {t("AddNew")}
          </Btn>
        </div>

        {!mounted || isLoading ? (
          <div className="py-5 text-center text-muted">Loading...</div>
        ) : addresses.length > 0 ? (
          <div className="address-book-section">
            <Row className="g-4">
              {addresses.map((address) => (
                <Col xl={4} md={6} key={address.id}>
                  <div className="select-box">
                    <div className="address-box">
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <td>{t("Address")} :</td>
                              <td>{address.addressLine || "—"}</td>
                            </tr>
                            <tr>
                              <td>{t("City")} :</td>
                              <td>{address.city || "—"}</td>
                            </tr>
                            <tr>
                              <td>{t("State")} :</td>
                              <td>{address.region || "—"}</td>
                            </tr>
                            <tr>
                              <td>{t("Pincode")} :</td>
                              <td>{address.postalCode || "—"}</td>
                            </tr>
                            <tr>
                              <td>{t("Country")} :</td>
                              <td>{address.country || "—"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bottom">
                        <Btn color="transparent" className="bottom_btn" onClick={() => { setEditTarget(address); setModal("edit"); }}>
                          {t("Edit")}
                        </Btn>
                        <Btn color="transparent" className="bottom_btn" onClick={() => { setDeleteTarget(address); setModal("remove"); }}>
                          {t("Remove")}
                        </Btn>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <NoDataFound customClass="no-data-added" imageUrl={`/assets/svg/empty-items.svg`} title="NoAddressFound" description="NoAddressDescription" height="300" width="300" />
        )}

        <div className="checkout-detail">
          <CustomModal
            modal={modal == "add" || modal == "edit"}
            setModal={setModal}
            classes={{ modalClass: "theme-modal-2 view-modal address-modal", title: modal == "add" ? "AddAddress" : "EditAddress" }}
          >
            <div className="right-sidebar-box">
              <AddressForm
                initial={modal == "edit" && editTarget ? {
                  addressLine: editTarget.addressLine || "",
                  city: editTarget.city || "",
                  region: editTarget.region || "",
                  postalCode: editTarget.postalCode || "",
                  country: editTarget.country || "",
                } : emptyForm}
                isLoading={createMut.isPending || updateMut.isPending}
                onCancel={() => { setModal(""); setEditTarget(null); }}
                onSubmit={(form) => (modal == "edit" ? updateMut.mutate(form) : createMut.mutate(form))}
              />
            </div>
          </CustomModal>

          <CustomModal
            modal={modal == "remove"}
            setModal={setModal}
            classes={{ modalClass: "theme-modal-2 view-modal", title: "Confirmation" }}
          >
            <p className="mb-3">Remove this address? This cannot be undone.</p>
            <div className="d-flex gap-2 justify-content-end">
              <Btn color="transparent" className="btn-outline" onClick={() => { setModal(""); setDeleteTarget(null); }}>
                {t("Cancel")}
              </Btn>
              <Btn className="btn-solid" loading={deleteMut.isPending} onClick={() => deleteMut.mutate(deleteTarget.id)}>
                {t("Remove")}
              </Btn>
            </div>
          </CustomModal>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddressHeader;
