'use client';
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  uploadProductThumbnail, uploadProductImage, deleteProductImage,
  getCategories, getBrands,
} from '@/utils/backendApi/adminApi';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiSearchLine, RiCloseLine, RiImageAddLine, RiEyeLine } from 'react-icons/ri';

const ACCENT = '#6366f1';

function Badge({ label, color }) {
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600,
      background: `${color}18`, color,
    }}>{label}</span>
  );
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

function ProductFormModal({ open, product, onClose, onSaved }) {
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', sku: '',
    stockQty: '', categoryId: '', brandId: '', slug: '',
    featuredFlag: false, preOrderFlag: false, newTrendsFlag: false,
    newArrivalFlag: false, bestSellingFlag: false,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const thumbnailPreview = thumbnailFile ? URL.createObjectURL(thumbnailFile) : null;
  useEffect(() => {
    return () => { if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview); };
  }, [thumbnailPreview]);

  const handleDeleteExistingImage = async (imageId) => {
    if (!product?.id) return;
    setDeletingImageId(imageId);
    try {
      await deleteProductImage(product.id, imageId);
      setExistingImages(imgs => imgs.filter(img => img.id !== imageId));
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete image');
    } finally {
      setDeletingImageId(null);
    }
  };

  const { data: catData } = useQuery({ queryKey: ['admin-categories'], queryFn: () => getCategories({ limit: 200 }), staleTime: 60000 });
  const { data: brandData } = useQuery({ queryKey: ['admin-brands'], queryFn: () => getBrands({ limit: 200 }), staleTime: 60000 });

  const categories = catData?.data || [];
  const brands = brandData?.data || [];

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        sku: product.sku || '',
        stockQty: product.stockQty ?? '',
        categoryId: product.categoryId || product.category?.id || '',
        brandId: product.brandId || product.brand?.id || '',
        slug: product.slug || '',
        featuredFlag: !!product.featuredFlag,
        preOrderFlag: !!product.preOrderFlag,
        newTrendsFlag: !!product.newTrendsFlag,
        newArrivalFlag: !!product.newArrivalFlag,
        bestSellingFlag: !!product.bestSellingFlag,
      });
    } else {
      setForm({
        name: '', description: '', price: '', discountPrice: '', sku: '',
        stockQty: '', categoryId: '', brandId: '', slug: '',
        featuredFlag: false, preOrderFlag: false, newTrendsFlag: false,
        newArrivalFlag: false, bestSellingFlag: false,
      });
    }
    setThumbnailFile(null);
    setImageFiles([]);
    setExistingImages(product?.images || []);
    setError('');
  }, [product, open]);

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        price: form.price ? parseFloat(form.price) : undefined,
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        sku: form.sku || undefined,
        stockQty: form.stockQty !== '' ? parseInt(form.stockQty) : undefined,
        categoryId: form.categoryId || undefined,
        brandId: form.brandId || undefined,
        slug: form.slug || undefined,
        featuredFlag: form.featuredFlag,
        preOrderFlag: form.preOrderFlag,
        newTrendsFlag: form.newTrendsFlag,
        newArrivalFlag: form.newArrivalFlag,
        bestSellingFlag: form.bestSellingFlag,
      };

      let savedProduct;
      if (isEdit) {
        savedProduct = await updateProduct(product.id, payload);
      } else {
        savedProduct = await createProduct(payload);
      }

      const productId = savedProduct?.data?.id || product?.id;

      if (thumbnailFile && productId) {
        await uploadProductThumbnail(productId, thumbnailFile);
      }

      for (const file of imageFiles) {
        if (productId) await uploadProductImage(productId, file);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
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
      <div style={{ ...modalBoxStyle, maxWidth: 680, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h5 style={{ margin: 0, fontWeight: 600, color: '#1a202c' }}>
            {isEdit ? 'Edit Product' : 'New Product'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Name *" span={2}>
              <input required value={form.name} onChange={e => handleChange('name', e.target.value)} style={inputStyle} />
            </FormField>
            <FormField label="Slug">
              <input value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="auto-generated if empty" style={inputStyle} />
            </FormField>
            <FormField label="SKU">
              <input value={form.sku} onChange={e => handleChange('sku', e.target.value)} style={inputStyle} />
            </FormField>
            <FormField label="Price">
              <input type="number" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} style={inputStyle} />
            </FormField>
            <FormField label="Discount Price">
              <input type="number" step="0.01" value={form.discountPrice} onChange={e => handleChange('discountPrice', e.target.value)} style={inputStyle} />
            </FormField>
            <FormField label="Stock Qty">
              <input type="number" value={form.stockQty} onChange={e => handleChange('stockQty', e.target.value)} style={inputStyle} />
            </FormField>
            <FormField label="Category">
              <select value={form.categoryId} onChange={e => handleChange('categoryId', e.target.value)} style={inputStyle}>
                <option value="">-- None --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>
            <FormField label="Brand">
              <select value={form.brandId} onChange={e => handleChange('brandId', e.target.value)} style={inputStyle}>
                <option value="">-- None --</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </FormField>
            <FormField label="Description" span={2}>
              <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </FormField>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '16px 0' }}>
            {[
              ['featuredFlag', 'Featured'],
              ['preOrderFlag', 'Pre-Order'],
              ['newTrendsFlag', 'New Trends'],
              ['newArrivalFlag', 'New Arrival'],
              ['bestSellingFlag', 'Best Selling'],
            ].map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#4a5568', cursor: 'pointer' }}>
                <input type="checkbox" checked={form[key]} onChange={e => handleChange(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <FormField label="Thumbnail">
              {(thumbnailPreview || product?.thumbnailUrl) && (
                <div style={{ marginBottom: 8, position: 'relative', display: 'inline-block' }}>
                  <img
                    src={thumbnailPreview || product.thumbnailUrl}
                    alt="thumbnail"
                    style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                  {thumbnailPreview && (
                    <span style={{ position: 'absolute', top: 4, left: 4, background: ACCENT, color: '#fff', fontSize: '0.6rem', fontWeight: 600, padding: '1px 6px', borderRadius: 8 }}>
                      New
                    </span>
                  )}
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} style={{ fontSize: '0.85rem' }} />
              {product?.thumbnailUrl && !thumbnailFile && (
                <div style={{ fontSize: '0.72rem', color: '#a0aec0', marginTop: 4 }}>Selecting a new file replaces the current thumbnail</div>
              )}
            </FormField>
            <FormField label="Product Images">
              {(existingImages.length > 0 || imageFiles.length > 0) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  {existingImages.map(img => (
                    <div key={img.id} style={{ position: 'relative' }}>
                      <img
                        src={img.imageUrl}
                        alt=""
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', opacity: deletingImageId === img.id ? 0.4 : 1 }}
                        onError={e => e.target.style.display = 'none'}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        disabled={deletingImageId === img.id}
                        title="Delete image"
                        style={{
                          position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                          borderRadius: '50%', border: 'none', background: '#e53e3e', color: '#fff',
                          fontSize: 11, lineHeight: '18px', padding: 0, cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {imageFiles.map((file, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: `2px solid ${ACCENT}` }}
                      />
                      <button
                        type="button"
                        onClick={() => setImageFiles(files => files.filter((_, idx) => idx !== i))}
                        title="Remove from upload"
                        style={{
                          position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                          borderRadius: '50%', border: 'none', background: '#718096', color: '#fff',
                          fontSize: 11, lineHeight: '18px', padding: 0, cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input type="file" accept="image/*" multiple onChange={e => setImageFiles(prev => [...prev, ...e.target.files])} style={{ fontSize: '0.85rem' }} />
              {imageFiles.length > 0 && (
                <div style={{ fontSize: '0.72rem', color: ACCENT, marginTop: 4 }}>{imageFiles.length} new image{imageFiles.length !== 1 ? 's' : ''} will be uploaded on save</div>
              )}
            </FormField>
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

function FormField({ label, children, span }) {
  return (
    <div style={span === 2 ? { gridColumn: 'span 2' } : {}}>
      <label style={{ display: 'block', marginBottom: 4, fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, debouncedSearch],
    queryFn: () => getProducts({ page, limit: 15, sortBy: 'createdAt', sortDir: 'desc', ...(debouncedSearch && { name: debouncedSearch }) }),
  });

  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 15 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  const deleteMut = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); setDeleteTarget(null); },
  });

  const handleEdit = async (id) => {
    try {
      const res = await getProductById(id);
      setEditProduct(res.data);
      setFormOpen(true);
    } catch { /* ignore */ }
  };

  const handleCreate = () => { setEditProduct(null); setFormOpen(true); };

  return (
    <>
      <div style={{ padding: '20px 24px' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20, flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ position: 'relative', width: 300 }}>
            <RiSearchLine style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12, height: 40,
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem',
                outline: 'none', color: '#1a202c', background: '#fff', boxSizing: 'border-box',
              }}
            />
          </div>
          <button onClick={handleCreate} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RiAddLine size={18} /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: 12 }}>
          {meta.total} product{meta.total !== 1 ? 's' : ''} total
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Product', 'Price', 'Stock', 'Category', 'Flags', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>No products found</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.thumbnailUrl || p.images?.[0]?.imageUrl ? (
                          <img src={p.thumbnailUrl || p.images[0].imageUrl} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', fontSize: '0.65rem' }}>IMG</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 500, color: '#1a202c' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>SKU: {p.sku || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#2d3748' }}>
                      <div>৳{parseFloat(p.price || 0).toFixed(2)}</div>
                      {p.discountPrice && <div style={{ fontSize: '0.75rem', color: '#38a169' }}>৳{parseFloat(p.discountPrice).toFixed(2)}</div>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge
                        label={p.stockQty > 0 ? `${p.stockQty} in stock` : 'Out of stock'}
                        color={p.stockQty > 0 ? '#38a169' : '#e53e3e'}
                      />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4a5568', fontSize: '0.85rem' }}>
                      {p.category?.name || '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.featuredFlag && <Badge label="Featured" color={ACCENT} />}
                        {p.newArrivalFlag && <Badge label="New" color="#d69e2e" />}
                        {p.bestSellingFlag && <Badge label="Best" color="#38a169" />}
                        {p.newTrendsFlag && <Badge label="Trend" color="#e53e3e" />}
                        {p.preOrderFlag && <Badge label="Pre-Order" color="#718096" />}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleEdit(p.id)} title="Edit" style={iconBtn}>
                          <RiEditLine size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} title="Delete" style={{ ...iconBtn, color: '#e53e3e' }}>
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={pageBtn}>Prev</button>
              <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={pageBtn}>Next</button>
            </div>
          )}
        </div>
      </div>

      <ProductFormModal
        open={formOpen}
        product={editProduct}
        onClose={() => { setFormOpen(false); setEditProduct(null); }}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['admin-products'] })}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Product"
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
