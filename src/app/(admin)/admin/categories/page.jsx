import AdminHeader from '@/components/admin/AdminHeader';
import AdminCategories from '@/components/admin/categories';

export default function CategoriesPage() {
  return (
    <>
      <AdminHeader title="Categories" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminCategories />
      </main>
    </>
  );
}
