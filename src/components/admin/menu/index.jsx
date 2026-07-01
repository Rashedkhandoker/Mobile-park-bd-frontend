'use client';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/utils/backendApi/adminApi';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine, RiArrowRightSLine } from 'react-icons/ri';

const ACCENT = '#6366f1';

/** Flatten parent/child list into display order with depth for indentation. */
function flattenTree(items) {
  const byParent = new Map();
  for (const item of items) {
    const key = item.parent_id || 'root';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(item);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  }
  const out = [];
  const walk = (parentKey, depth) => {
    for (const item of byParent.get(parentKey) || []) {
      out.push({ ...item, depth });
      walk(item.id, depth + 1);
    }
  };
  walk('root', 0);
  return out;
}

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

const emptyForm = {
  title: '', path: '', linkType: 'link', sort: 0, parentId: '',
  badgeText: '', badgeColor: '', isTargetBlank: false, isActive: true,
};

function MenuFormModal({ open, item, parentOptions, onClose }) {
  const queryClient = useQueryClient();
  const isEdit = !!item;
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || '',
        path: item.path || '',
        linkType: item.link_type || 'link',
        sort: item.sort ?? 0,
        parentId: item.parent_id || '',
        badgeText: item.badge_text || '',
        badgeColor: item.badge_color || '',
        isTargetBlank: item.is_target_blank === 1,
        isActive: true,
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [item, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        path: form.linkType === 'link' ? form.path || null : null,
        linkType: form.linkType,
        sort: parseInt(form.sort) || 0,
        parentId: form.parentId || null,
        badgeText: form.badgeText || null,
        badgeColor: form.badgeColor || null,
        isTargetBlank: form.isTargetBlank,
        isActive: form.isActive,
      };
      if (isEdit) {
        await updateMenuItem(item.id, payload);
      } else {
        await createMenuItem(payload);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
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
      <div style={{ ...modalBoxStyle, maxWidth: 520, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h5 style={{ margin: 0, fontWeight: 600, color: '#1a202c' }}>
            {isEdit ? 'Edit Menu Item' : 'New Menu Item'}
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
            <label style={labelStyle}>Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.linkType} onChange={e => setForm(f => ({ ...f, linkType: e.target.value }))} style={inputStyle}>
                <option value="link">Link</option>
                <option value="sub">Dropdown (has children)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input type="number" value={form.sort} onChange={e => setForm(f => ({ ...f, sort: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          {form.linkType === 'link' && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Path</label>
              <input value={form.path} onChange={e => setForm(f => ({ ...f, path: e.target.value }))} placeholder="/category/iphone" style={inputStyle} />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Parent Item</label>
            <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))} style={inputStyle}>
              <option value="">— None (top level) —</option>
              {parentOptions
                .filter(p => !isEdit || p.id !== item?.id)
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {' '.repeat(p.depth * 4)}{p.title}
                  </option>
                ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Badge Text</label>
              <input value={form.badgeText} onChange={e => setForm(f => ({ ...f, badgeText: e.target.value }))} placeholder="New" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Badge Color</label>
              <input value={form.badgeColor} onChange={e => setForm(f => ({ ...f, badgeColor: e.target.value }))} placeholder="warning" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isTargetBlank} onChange={e => setForm(f => ({ ...f, isTargetBlank: e.target.checked }))} />
              Open in new tab
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

export default function AdminMenu() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-menu'],
    queryFn: getMenuItems,
  });

  const flat = useMemo(() => flattenTree(data?.data || []), [data]);

  const deleteMut = useMutation({
    mutationFn: (id) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] });
      setDeleteTarget(null);
    },
  });

  return (
    <>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '0.8rem', color: '#718096' }}>
            {flat.length} menu item{flat.length !== 1 ? 's' : ''} — changes appear on the storefront navbar immediately
          </div>
          <button onClick={() => { setEditItem(null); setFormOpen(true); }} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RiAddLine size={18} /> Add Menu Item
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Title', 'Type', 'Path', 'Sort', 'Badge', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</td></tr>
                ) : flat.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>No menu items yet</td></tr>
                ) : flat.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: item.depth === 0 ? 600 : 400, color: '#1a202c' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: item.depth * 24 }}>
                        {item.depth > 0 && <RiArrowRightSLine size={14} style={{ color: '#a0aec0', marginRight: 4 }} />}
                        {item.title}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600,
                        background: item.link_type === 'sub' ? `${ACCENT}18` : '#38a16918',
                        color: item.link_type === 'sub' ? ACCENT : '#38a169',
                      }}>
                        {item.link_type === 'sub' ? 'Dropdown' : 'Link'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {item.path ? (
                        <code style={{ fontSize: '0.8rem', background: '#f7fafc', padding: '2px 6px', borderRadius: 4 }}>{item.path}</code>
                      ) : <span style={{ color: '#cbd5e0' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4a5568' }}>{item.sort}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {item.badge_text ? (
                        <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600, background: '#fefcbf', color: '#975a16' }}>
                          {item.badge_text}
                        </span>
                      ) : <span style={{ color: '#cbd5e0' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditItem(item); setFormOpen(true); }} title="Edit" style={iconBtn}>
                          <RiEditLine size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(item)} title="Delete" style={{ ...iconBtn, color: '#e53e3e' }}>
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MenuFormModal
        open={formOpen}
        item={editItem}
        parentOptions={flat}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Menu Item"
        message={`Delete "${deleteTarget?.title}"? All of its sub-items will be deleted too. This cannot be undone.`}
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
