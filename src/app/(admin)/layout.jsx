import AdminQueryProvider from '@/components/admin/AdminQueryProvider';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Admin Panel',
};

export default function AdminLayout({ children }) {
  return (
    <AdminQueryProvider>
      <AdminShell>{children}</AdminShell>
    </AdminQueryProvider>
  );
}
