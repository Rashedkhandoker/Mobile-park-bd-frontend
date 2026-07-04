'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } from '@/utils/backendApi/adminApi';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine, RiCloseLine } from 'react-icons/ri';

const ACCENT = '#6366f1';

function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div style={overlayStyle}>
      <div style={{ ...modalBoxStyle, maxWidth: 420 }}>
        <h5 style={{ margin: '0 0 12px', color: '#1a202c', fontWeight: 600 }}>{title}</h5>
        <p style={{ margin: '0 0 24px', color: '#4a5568', fontSize: '0.9rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ ...btnPrimary, background: '#e53e3e' }}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandFormModal({ open, brand, onClose, onSaved }) {
  const queryClient = useQueryClient();
  const isEdit = !!brand;
  const [form, setForm] = useState({ name: '', slug: '', topBrandsFlag: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (brand) {
      setForm({ name: brand.name || '', slug: brand.slug || '', topBrandsFlag: !!brand.topBrandsFlag });
    } else {
      setForm({ name: '', slug: '', topBrandsFlag: false });
    }
    setError('');
  }, [brand, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        slug: form.slug || undefined,
        topBrandsFlag: form.topBrandsFlag,
      };
      if (isEdit) {
        await updateBrand(brand.id, payload);
      } else {
        await createBrand(payload);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalBoxStyle, maxWidth: 480 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h5 style={{ margin: 0, fontWeight: 600, color: '#1a202c' }}>
            {isEdit ? 'Edit Brand' : 'New Brand'}
          </h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0' }}>
            <RiCloseLine size={22} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: '#fed7d7', color: '#c53030', fontSize: '0.85rem', border: '1px solid #feb2b2' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated if empty" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.topBrandsFlag} onChange={e => setForm(f => ({ ...f, topBrandsFlag: e.target.checked }))} />
              Top Brand
            </label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
            <button type="submit" disabled={saving} style={btnPrimary}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBrands() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-brands', page, debouncedSearch],
    queryFn: () => getBrands({ page, limit: 15, sortBy: 'name', sortDir: 'asc', ...(debouncedSearch && { name: debouncedSearch }) }),
  });

  const brands = data?.data || [];
  const meta = data?.meta?.pagination || { total: 0, page: 1, limit: 15 };
  const totalPages = Math.ceil((meta.total || 0) / (meta.limit || 15));

  const deleteMut = useMutation({
    mutationFn: (id) => deleteBrand(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-brands'] }); setDeleteTarget(null); },
  });

  const handleEdit = async (brand) => {
    setEditBrand(brand);
    setFormOpen(true);
  };

  const handleCreate = () => { setEditBrand(null); setFormOpen(true); };

  return (
    <>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ position: 'relative', width: 300 }}>
            <RiSearchLine style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search brands..."
              style={{ width: '100%', paddingLeft: 36, paddingRight: 12, height: 40, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', color: '#1a202c', background: '#fff', boxSizing: 'border-box' }}
            />
          </div>
          <button onClick={handleCreate} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RiAddLine size={18} /> Add Brand
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: 12 }}>
          {meta.total || brands.length} brand{(meta.total || brands.length) !== 1 ? 's' : ''} total
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Name', 'Slug', 'Top Brand', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</td></tr>
                ) : brands.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>No brands found</td></tr>
                ) : brands.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1a202c' }}>{b.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <code style={{ fontSize: '0.8rem', background: '#f7fafc', padding: '2px 6px', borderRadius: 4 }}>{b.slug}</code>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600,
                        background: b.topBrandsFlag ? `${ACCENT}18` : '#e2e8f018',
                        color: b.topBrandsFlag ? ACCENT : '#a0aec0',
                      }}>
                        {b.topBrandsFlag ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleEdit(b)} title="Edit" style={iconBtn}>
                          <RiEditLine size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(b)} title="Delete" style={{ ...iconBtn, color: '#e53e3e' }}>
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={pageBtn}>Prev</button>
              <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={pageBtn}>Next</button>
            </div>
          )}
        </div>
      </div>

      <BrandFormModal
        open={formOpen}
        brand={editBrand}
        onClose={() => { setFormOpen(false); setEditBrand(null); }}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['admin-brands'] })}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Brand"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleteMut.isPending}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 2000, padding: 16,
};

const modalBoxStyle = {
  background: '#fff', borderRadius: 14, padding: '28px 32px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%',
};

const inputStyle = {
  width: '100%', height: 38, padding: '0 12px',
  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem',
  outline: 'none', color: '#1a202c', background: '#fff', boxSizing: 'border-box',
};

const labelStyle = { display: 'block', marginBottom: 4, fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' };

const btnPrimary = {
  padding: '8px 18px', border: 'none', borderRadius: 8,
  background: `linear-gradient(135deg, ${ACCENT}, #8b5cf6)`,
  color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
};

const btnSecondary = {
  padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8,
  background: '#fff', color: '#4a5568', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
};

const iconBtn = {
  background: 'none', border: '1px solid #e2e8f0', borderRadius: 6,
  padding: '6px 8px', cursor: 'pointer', color: '#4a5568',
  display: 'flex', alignItems: 'center',
};

const pageBtn = {
  padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 6,
  background: '#fff', color: '#4a5568', fontSize: '0.8rem', cursor: 'pointer',
};
