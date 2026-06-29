'use client';
import { useState, useEffect } from 'react';
import DataTable from '../DataTable';
import AdminModal from '../AdminModal';
import FormField from '../FormField';

const EMPTY = { name: '', description: '', type: 'product', status: '1', parent_id: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    fetch('/api/category').then(r => r.json()).then(d => {
      setCategories(d.data || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = row => { setEditing(row); setForm({ name: row.name, description: row.description || '', type: row.type || 'product', status: String(row.status), parent_id: row.parent_id || '' }); setModal(true); };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch('/api/category', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setModal(false);
    setLoading(true);
    load();
  };

  const handleDelete = async () => {
    await fetch('/api/category', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteConfirm.id }) });
    setDeleteConfirm(null);
    setLoading(true);
    load();
  };

  const parentOptions = categories
    .filter(c => !c.parent_id)
    .map(c => ({ value: c.id, label: c.name }));

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    { key: 'name', label: 'Name', render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: 'type', label: 'Type', render: v => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
    { key: 'products_count', label: 'Products', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, background: v === 1 ? '#38a16918' : '#e53e3e18', color: v === 1 ? '#38a169' : '#e53e3e' }}>
          {v === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'parent_id', label: 'Parent', render: v => v ? `#${v}` : <span style={{ color: '#a0aec0' }}>Root</span> },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        addLabel="Add Category"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
      />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit}>
          <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Type" name="type" type="select" value={form.type} onChange={handleChange}
              options={[{ value: 'product', label: 'Product' }, { value: 'blog', label: 'Blog' }]} />
            <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange}
              options={[{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }]} />
          </div>
          <FormField label="Parent Category" name="parent_id" type="select" value={form.parent_id} onChange={handleChange} options={parentOptions} />
          <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={3} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={() => setModal(false)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Category" width={400}>
        <p style={{ color: '#4a5568', marginBottom: 20 }}>Delete <strong>{deleteConfirm?.name}</strong>? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding: '8px 18px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Delete</button>
        </div>
      </AdminModal>
    </>
  );
}
