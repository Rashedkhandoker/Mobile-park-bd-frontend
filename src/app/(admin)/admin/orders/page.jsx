import AdminHeader from '@/components/admin/AdminHeader';
import AdminOrders from '@/components/admin/orders';

export default function OrdersPage() {
  return (
    <>
      <AdminHeader title="Orders" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminOrders />
      </main>
    </>
  );
}
