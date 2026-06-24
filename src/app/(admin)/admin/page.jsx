import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboard from '@/components/admin/dashboard';

export default function AdminPage() {
  return (
    <>
      <AdminHeader title="Dashboard" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminDashboard />
      </main>
    </>
  );
}
