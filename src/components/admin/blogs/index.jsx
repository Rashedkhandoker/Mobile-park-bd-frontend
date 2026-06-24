'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(d => {
      setBlogs(d.data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'title', label: 'Title',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {row.blog_thumbnail?.original_url && (
            <img src={row.blog_thumbnail.original_url} alt={v} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.style.display='none'} />
          )}
          <span style={{ fontWeight: 500, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{v}</span>
        </div>
      )
    },
    { key: 'is_featured', label: 'Featured', render: v => v ? <span style={{ color: '#6366f1', fontWeight: 600 }}>★ Yes</span> : 'No' },
    { key: 'is_sticky', label: 'Sticky', render: v => v ? 'Yes' : 'No' },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{
          padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
          background: v === 1 ? '#38a16918' : '#e53e3e18',
          color: v === 1 ? '#38a169' : '#e53e3e',
        }}>{v === 1 ? 'Published' : 'Draft'}</span>
      )
    },
    { key: 'created_at', label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return <DataTable columns={columns} data={blogs} searchKey="title" />;
}
