'use client';
import { useState, useEffect } from 'react';
import DataTable from '../DataTable';
import AdminModal from '../AdminModal';
import FormField from '../FormField';

const EMPTY = { name: '', meta_title: '', meta_description: '', status: '1' };

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    fetch('/api/brand').then(r => r.json()).then(d => {
      setBrands(d.data || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = row => { setEditing(row); setForm({ name: row.name, meta_title: row.meta_title || '', meta_description: row.meta_description || '', status: String(row.status) }); setModal(true); };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch('/api/brand', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setModal(false);
    setLoading(true);
    load();
  };

  const handleDelete = async () => {
    await fetch('/api/brand', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteConfirm.id }) });
    setDeleteConfirm(null);
    setLoading(true);
    load();
  };

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    { key: 'name', label: 'Brand Name', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'slug', label: 'Slug', render: v => <code style={{ fontSize: '0.8rem', background: '#f7fafc', padding: '2px 6px', borderRadius: 4 }}>{v}</code> },
    { key: 'meta_title', label: 'Meta Title', render: v => v || <span style={{ color: '#a0aec0' }}>—</span> },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, background: v === 1 ? '#38a16918' : '#e53e3e18', color: v === 1 ? '#38a169' : '#e53e3e' }}>
          {v === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'created_at', label: 'Created', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return (
    <>
      <DataTable
        columns={columns}
        data={brands}
        searchKey="name"
        addLabel="Add Brand"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
      />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Brand' : 'Add Brand'}>
        <form onSubmit={handleSubmit}>
          <FormField label="Brand Name" name="name" value={form.name} onChange={handleChange} required />
          <FormField label="Meta Title" name="meta_title" value={form.meta_title} onChange={handleChange} placeholder="SEO title" />
          <FormField label="Meta Description" name="meta_description" type="textarea" value={form.meta_description} onChange={handleChange} rows={3} placeholder="SEO description" />
          <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange}
            options={[{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }]} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={() => setModal(false)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Brand" width={400}>
        <p style={{ color: '#4a5568', marginBottom: 20 }}>Delete <strong>{deleteConfirm?.name}</strong>? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding: '8px 18px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Delete</button>
        </div>
      </AdminModal>
    </>
  );
}
