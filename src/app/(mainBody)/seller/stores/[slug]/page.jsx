import SingleStoreDetail from "@/components/seller/stores/singleStoreDetail";

const SellerStoreDetail = ({ params }) => {
  return <SingleStoreDetail params={params?.slug} />;
};
export default SellerStoreDetail;
