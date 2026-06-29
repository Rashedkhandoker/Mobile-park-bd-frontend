'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import AdminModal from '../AdminModal';
import FormField from '../FormField';
import { RiUserLine } from 'react-icons/ri';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: '1' });

  const load = () => {
    fetch('/api/self').then(r => r.json()).then(d => {
      const data = d.data || (d.id ? [d] : []);
      setUsers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = row => {
    setEditRow(row);
    setForm({ name: row.name || '', email: row.email || '', phone: row.phone || '', status: String(row.status) });
    setEditModal(true);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setUsers(prev => prev.map(u => u.id === editRow.id ? { ...u, ...form, status: Number(form.status) } : u));
    setEditModal(false);
  };

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'name', label: 'Name',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {row.profile_image?.original_url ? (
            <img src={row.profile_image.original_url} alt={v} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiUserLine size={16} color="#6366f1" />
            </div>
          )}
          <span style={{ fontWeight: 500 }}>{v || '—'}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: v => v || <span style={{ color: '#a0aec0' }}>—</span> },
    {
      key: 'role', label: 'Role',
      render: v => <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', padding: '2px 8px', background: '#eef2ff', color: '#6366f1', borderRadius: 6 }}>{v?.name || '—'}</span>
    },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, background: v === 1 ? '#38a16918' : '#71809618', color: v === 1 ? '#38a169' : '#718096' }}>
          {v === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'created_at', label: 'Joined', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  if (users.length === 0) return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 48, textAlign: 'center' }}>
      <RiUserLine size={48} color="#e2e8f0" style={{ marginBottom: 16 }} />
      <p style={{ color: '#a0aec0', margin: 0 }}>User data requires authentication. Login to view users.</p>
    </div>
  );

  return (
    <>
      <DataTable columns={columns} data={users} searchKey="name" onEdit={openEdit} />

      <AdminModal open={editModal} onClose={() => setEditModal(false)} title="Edit User">
        <form onSubmit={handleSubmit}>
          <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange}
            options={[{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }]} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={() => setEditModal(false)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Update</button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
