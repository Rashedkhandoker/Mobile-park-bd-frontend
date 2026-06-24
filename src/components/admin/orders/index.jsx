'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';

const STATUS_COLORS = {
  PENDING: '#ed8936', PAID: '#38a169', FAILED: '#e53e3e',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/order').then(r => r.json()).then(d => {
      setOrders(d.data || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'order_number', label: 'Order #', render: v => <span style={{ fontWeight: 600, color: '#6366f1' }}>#{v}</span> },
    {
      key: 'billing_address', label: 'Customer',
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{v?.title || '—'}</div>
          <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{v?.city}, {v?.country?.name}</div>
        </div>
      )
    },
    { key: 'total', label: 'Total', render: v => <span style={{ fontWeight: 600 }}>${v?.toFixed(2)}</span> },
    { key: 'payment_method', label: 'Method', render: v => <span style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'payment_status', label: 'Payment',
      render: v => (
        <span style={{
          padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
          background: `${STATUS_COLORS[v] || '#718096'}18`,
          color: STATUS_COLORS[v] || '#718096',
        }}>{v}</span>
      )
    },
    { key: 'created_at', label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return <DataTable columns={columns} data={orders} searchKey="order_number" />;
}
