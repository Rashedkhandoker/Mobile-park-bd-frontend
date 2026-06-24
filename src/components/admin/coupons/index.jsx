'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/coupon').then(r => r.json()).then(d => {
      setCoupons(d.data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    { key: 'title', label: 'Title', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    {
      key: 'code', label: 'Code',
      render: v => <code style={{ background: '#eef2ff', color: '#6366f1', padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontSize: '0.85rem' }}>{v}</code>
    },
    {
      key: 'type', label: 'Type',
      render: (v, row) => (
        <span>{v === 'percentage' ? `${row.amount}%` : `$${row.amount}`} off</span>
      )
    },
    { key: 'min_spend', label: 'Min Spend', render: v => `$${v}` },
    { key: 'used', label: 'Used', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    {
      key: 'status', label: 'Status',
      render: (v, row) => (
        <span style={{
          padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
          background: row.is_expired ? '#e53e3e18' : v === 1 ? '#38a16918' : '#71809618',
          color: row.is_expired ? '#e53e3e' : v === 1 ? '#38a169' : '#718096',
        }}>{row.is_expired ? 'Expired' : v === 1 ? 'Active' : 'Inactive'}</span>
      )
    },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return <DataTable columns={columns} data={coupons} searchKey="code" />;
}
