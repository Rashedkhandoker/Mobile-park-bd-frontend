'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import AdminModal from '../AdminModal';
import FormField from '../FormField';

const PAYMENT_COLORS = { PENDING: '#ed8936', PAID: '#38a169', FAILED: '#e53e3e' };

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'FAILED', label: 'Failed' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ payment_status: 'PENDING', order_status_name: 'pending' });

  const load = () => {
    fetch('/api/order').then(r => r.json()).then(d => {
      setOrders(d.data || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const openEdit = row => {
    setEditRow(row);
    setForm({ payment_status: row.payment_status, order_status_name: row.order_status?.name || 'pending' });
    setEditModal(true);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const body = {
      id: editRow.id,
      payment_status: form.payment_status,
      order_status: { ...editRow.order_status, name: form.order_status_name, slug: form.order_status_name },
    };
    await fetch('/api/order', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setOrders(prev => prev.map(o => o.id === editRow.id ? { ...o, ...body } : o));
    setEditModal(false);
  };

  const columns = [
    { key: 'order_number', label: 'Order #', render: v => <span style={{ fontWeight: 600, color: '#6366f1' }}>#{v}</span> },
    {
      key: 'billing_address', label: 'Customer',
      render: (v) => (
        <div>
          <div style={{ fontWeight: 500 }}>{v?.title || '—'}</div>
          <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{v?.city}{v?.country?.name ? `, ${v.country.name}` : ''}</div>
        </div>
      )
    },
    { key: 'grand_total', label: 'Total', render: (v, row) => <span style={{ fontWeight: 600 }}>${(v || row.total || 0).toFixed(2)}</span> },
    { key: 'payment_method', label: 'Method', render: v => <span style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{v || '—'}</span> },
    {
      key: 'payment_status', label: 'Payment',
      render: v => (
        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, background: `${PAYMENT_COLORS[v] || '#718096'}18`, color: PAYMENT_COLORS[v] || '#718096' }}>
          {v}
        </span>
      )
    },
    {
      key: 'order_status', label: 'Order Status',
      render: v => (
        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, background: '#eef2ff', color: '#6366f1', textTransform: 'capitalize' }}>
          {v?.name || '—'}
        </span>
      )
    },
    { key: 'created_at', label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return (
    <>
      <DataTable columns={columns} data={orders} searchKey="order_number" onEdit={openEdit} />

      <AdminModal open={editModal} onClose={() => setEditModal(false)} title={`Update Order #${editRow?.order_number}`} width={420}>
        <form onSubmit={handleSubmit}>
          <FormField label="Order Status" name="order_status_name" type="select" value={form.order_status_name} onChange={handleChange} options={ORDER_STATUSES} />
          <FormField label="Payment Status" name="payment_status" type="select" value={form.payment_status} onChange={handleChange} options={PAYMENT_STATUSES} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={() => setEditModal(false)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Update</button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
