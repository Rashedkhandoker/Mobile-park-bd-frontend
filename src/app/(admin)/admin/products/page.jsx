import AdminHeader from '@/components/admin/AdminHeader';
import AdminProducts from '@/components/admin/products';

export default function ProductsPage() {
  return (
    <>
      <AdminHeader title="Products" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminProducts />
      </main>
    </>
  );
}
