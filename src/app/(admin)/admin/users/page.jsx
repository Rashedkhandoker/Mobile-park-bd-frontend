import AdminHeader from '@/components/admin/AdminHeader';
import AdminUsers from '@/components/admin/users';

export default function UsersPage() {
  return (
    <>
      <AdminHeader title="Users" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminUsers />
      </main>
    </>
  );
}
