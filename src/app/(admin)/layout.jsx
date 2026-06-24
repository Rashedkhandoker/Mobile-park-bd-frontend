import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminQueryProvider from '@/components/admin/AdminQueryProvider';

export const metadata = {
  title: 'Admin Panel',
};

export default function AdminLayout({ children }) {
  return (
    <AdminQueryProvider>
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7fafc' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        className="admin-main-content">
        {children}
      </div>
      <style>{`
        @media (max-width: 991px) {
          .admin-main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
    </AdminQueryProvider>
  );
}
