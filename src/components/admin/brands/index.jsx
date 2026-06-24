'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brand').then(r => r.json()).then(d => {
      setBrands(d.data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    { key: 'name', label: 'Brand Name', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'slug', label: 'Slug', render: v => <code style={{ fontSize: '0.8rem', background: '#f7fafc', padding: '2px 6px', borderRadius: 4 }}>{v}</code> },
    { key: 'meta_title', label: 'Meta Title' },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{
          padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
          background: v === 1 ? '#38a16918' : '#e53e3e18',
          color: v === 1 ? '#38a169' : '#e53e3e',
        }}>{v === 1 ? 'Active' : 'Inactive'}</span>
      )
    },
    { key: 'created_at', label: 'Created', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return <DataTable columns={columns} data={brands} searchKey="name" />;
}
