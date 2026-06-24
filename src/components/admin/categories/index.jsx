'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/category').then(r => r.json()).then(d => {
      setCategories(d.data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    { key: 'name', label: 'Name', render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: 'type', label: 'Type', render: v => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
    { key: 'products_count', label: 'Products', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
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
    { key: 'parent_id', label: 'Parent', render: v => v ? `#${v}` : <span style={{ color: '#a0aec0' }}>Root</span> },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return <DataTable columns={columns} data={categories} searchKey="name" />;
}
