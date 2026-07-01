import AdminHeader from '@/components/admin/AdminHeader';
import AdminMenu from '@/components/admin/menu';

export default function MenuPage() {
  return (
    <>
      <AdminHeader title="Menu" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminMenu />
      </main>
    </>
  );
}
