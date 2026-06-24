import AdminHeader from '@/components/admin/AdminHeader';
import AdminBlogs from '@/components/admin/blogs';

export default function BlogsPage() {
  return (
    <>
      <AdminHeader title="Blogs" />
      <main style={{ padding: 24, flex: 1 }}>
        <AdminBlogs />
      </main>
    </>
  );
}
