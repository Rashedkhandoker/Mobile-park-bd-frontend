'use client';
import { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import { RiUserLine } from 'react-icons/ri';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/self').then(r => r.json()).then(d => {
      const data = d.data || (d.id ? [d] : []);
      setUsers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'name', label: 'Name',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {row.profile_image?.original_url ? (
            <img src={row.profile_image.original_url} alt={v} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
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
    { key: 'phone', label: 'Phone' },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{
          padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
          background: v === 1 ? '#38a16918' : '#71809618',
          color: v === 1 ? '#38a169' : '#718096',
        }}>{v === 1 ? 'Active' : 'Inactive'}</span>
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

  return <DataTable columns={columns} data={users} searchKey="name" />;
}
