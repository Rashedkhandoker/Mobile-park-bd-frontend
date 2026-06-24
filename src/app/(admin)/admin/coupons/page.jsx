import AdminHeader from '@/components/admin/AdminHeader';
import AdminCoupons from '@/components/admin/coupons';

export default function CouponsPage() {
  return (
    <>
      <AdminHeader title="Coupons" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminCoupons />
      </main>
    </>
  );
}
