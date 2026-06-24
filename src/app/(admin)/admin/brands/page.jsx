import AdminHeader from '@/components/admin/AdminHeader';
import AdminBrands from '@/components/admin/brands';

export default function BrandsPage() {
  return (
    <>
      <AdminHeader title="Brands" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminBrands />
      </main>
    </>
  );
}
