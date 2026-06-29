'use client';
import { useState, useEffect, useRef } from 'react';
import DataTable from '../DataTable';
import AdminModal from '../AdminModal';
import FormField from '../FormField';
import { RiImageAddLine, RiCloseLine } from 'react-icons/ri';

const EMPTY = {
  name: '',
  short_description: '',
  description: '',
  sku: '',
  price: '',
  sale_price: '',
  discount: '',
  unit: '1 Item',
  weight: '',
  quantity: '',
  stock_status: 'in_stock',
  product_type: 'physical',
  type: 'simple',
  brand_id: '',
  category_id: '',
  status: '1',
  is_featured: '0',
  is_trending: '0',
  is_sale_enable: '0',
  is_cod: '0',
  is_free_shipping: '0',
  is_return: '1',
  shipping_days: '',
  estimated_delivery_text: '',
  return_policy_text: '',
  meta_title: '',
  meta_description: '',
  thumbnail_url: '',
};

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, marginTop: 20, paddingBottom: 6, borderBottom: '1px solid #e2e8f0' }}>
      {children}
    </div>
  );
}

function CheckboxField({ label, name, value, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#4a5568' }}>
      <input
        type="checkbox"
        name={name}
        checked={value === '1' || value === 1 || value === true}
        onChange={e => onChange({ target: { name, value: e.target.checked ? '1' : '0' } })}
        style={{ width: 16, height: 16, cursor: 'pointer' }}
      />
      {label}
    </label>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => {
    Promise.all([
      fetch('/api/product?paginate=500').then(r => r.json()),
      fetch('/api/brand').then(r => r.json()),
      fetch('/api/category').then(r => r.json()),
    ]).then(([p, b, c]) => {
      setProducts(p.data ?? []);
      setBrands(b.data ?? []);
      setCategories(c.data ?? []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleImageUpload = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm(f => ({ ...f, thumbnail_url: data.url }));
    setUploading(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      if ((name === 'price' || name === 'sale_price') && next.price && next.sale_price) {
        const disc = Math.round((1 - Number(next.sale_price) / Number(next.price)) * 100);
        next.discount = disc > 0 ? String(disc) : '0';
      }
      return next;
    });
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = row => {
    setEditing(row);
    setForm({
      name: row.name || '',
      short_description: row.short_description || '',
      description: row.description || '',
      sku: row.sku || '',
      price: row.price ?? '',
      sale_price: row.sale_price ?? '',
      discount: row.discount ?? '',
      unit: row.unit || '1 Item',
      weight: row.weight ?? '',
      quantity: row.quantity ?? '',
      stock_status: row.stock_status || 'in_stock',
      product_type: row.product_type || 'physical',
      type: row.type || 'simple',
      brand_id: row.brand_id ? String(row.brand_id) : '',
      category_id: row.categories?.[0]?.id ? String(row.categories[0].id) : '',
      thumbnail_url: row.product_thumbnail?.original_url || '',
      status: String(row.status ?? 1),
      is_featured: String(row.is_featured ?? 0),
      is_trending: String(row.is_trending ?? 0),
      is_sale_enable: String(row.is_sale_enable ?? 0),
      is_cod: String(row.is_cod ?? 0),
      is_free_shipping: String(row.is_free_shipping ?? 0),
      is_return: String(row.is_return ?? 1),
      shipping_days: row.shipping_days ?? '',
      estimated_delivery_text: row.estimated_delivery_text || '',
      return_policy_text: row.return_policy_text || '',
      meta_title: row.meta_title || '',
      meta_description: row.meta_description || '',
    });
    setModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      product_thumbnail: form.thumbnail_url ? { original_url: form.thumbnail_url, asset_url: form.thumbnail_url } : (editing?.product_thumbnail || null),
      price: Number(form.price),
      sale_price: Number(form.sale_price),
      discount: Number(form.discount),
      weight: form.weight !== '' ? Number(form.weight) : null,
      quantity: form.quantity !== '' ? Number(form.quantity) : null,
      shipping_days: form.shipping_days !== '' ? Number(form.shipping_days) : null,
      brand_id: form.brand_id ? Number(form.brand_id) : null,
      status: Number(form.status),
      is_featured: Number(form.is_featured),
      is_trending: Number(form.is_trending),
      is_sale_enable: Number(form.is_sale_enable),
      is_cod: Number(form.is_cod),
      is_free_shipping: Number(form.is_free_shipping),
      is_return: Number(form.is_return),
    };
    if (editing) payload.id = editing.id;
    const method = editing ? 'PUT' : 'POST';
    await fetch('/api/product', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setModal(false);
    setLoading(true);
    load();
  };

  const handleDelete = async () => {
    await fetch('/api/product', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteConfirm.id }) });
    setDeleteConfirm(null);
    setLoading(true);
    load();
  };

  const brandOptions = brands.map(b => ({ value: String(b.id), label: b.name }));
  const categoryOptions = categories.map(c => ({ value: String(c.id), label: c.name }));

  const columns = [
    { key: 'id', label: '#', render: v => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'name', label: 'Product',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {row.product_thumbnail?.original_url ? (
            <img src={row.product_thumbnail.original_url} alt={v} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} onError={e => e.target.style.display = 'none'} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#a0aec0' }}>IMG</div>
          )}
          <div>
            <div style={{ fontWeight: 500, color: '#1a202c' }}>{v}</div>
            {row.sku && <div style={{ fontSize: '0.75rem', color: '#a0aec0' }}>SKU: {row.sku}</div>}
          </div>
        </div>
      )
    },
    { key: 'brand', label: 'Brand', render: (v, row) => v?.name || brands.find(b => b.id === row.brand_id)?.name || <span style={{ color: '#a0aec0' }}>—</span> },
    {
      key: 'categories', label: 'Category',
      render: v => v?.length ? v.map(c => c.name).join(', ') : <span style={{ color: '#a0aec0' }}>—</span>
    },
    { key: 'price', label: 'MRP', render: v => `$${Number(v || 0).toFixed(2)}` },
    { key: 'sale_price', label: 'Sale Price', render: v => `$${Number(v || 0).toFixed(2)}` },
    { key: 'discount', label: 'Discount', render: v => v ? `${v}%` : '—' },
    { key: 'quantity', label: 'Stock', render: (v, row) => (
      <span style={{ color: row.stock_status === 'in_stock' ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
        {v ?? '—'} <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>({row.stock_status === 'in_stock' ? 'In Stock' : 'Out'})</span>
      </span>
    )},
    { key: 'product_type', label: 'Type', render: v => <span style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, background: v === 1 ? '#38a16918' : '#e53e3e18', color: v === 1 ? '#38a169' : '#e53e3e' }}>
          {v === 1 ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        addLabel="Add Product"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
      />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Product' : 'Add Product'} width={680}>
        <form onSubmit={handleSubmit}>

          <SectionTitle>Product Image</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 120, height: 120, border: '2px dashed #e2e8f0', borderRadius: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: '#f7fafc', flexShrink: 0, overflow: 'hidden', position: 'relative',
              }}
            >
              {form.thumbnail_url ? (
                <>
                  <img src={form.thumbnail_url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, thumbnail_url: '' })); }}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', padding: 0 }}
                  >
                    <RiCloseLine size={12} />
                  </button>
                </>
              ) : (
                <>
                  <RiImageAddLine size={28} color="#a0aec0" />
                  <span style={{ fontSize: '0.7rem', color: '#a0aec0', marginTop: 6, textAlign: 'center', padding: '0 8px' }}>
                    {uploading ? 'Uploading...' : 'Click to upload'}
                  </span>
                </>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.8rem', color: '#718096', margin: '0 0 8px' }}>Upload product thumbnail image</p>
              <p style={{ fontSize: '0.75rem', color: '#a0aec0', margin: '0 0 10px' }}>JPG, PNG, WEBP — max 5MB</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: '0.8rem', color: '#4a5568' }}
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </button>
              {form.thumbnail_url && (
                <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#38a169', wordBreak: 'break-all' }}>
                  ✓ {form.thumbnail_url.split('/').pop()}
                </div>
              )}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

          <SectionTitle>Basic Info</SectionTitle>
          <FormField label="Product Name" name="name" value={form.name} onChange={handleChange} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="SKU" name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. PROD-001" />
            <FormField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="1 Item" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Brand" name="brand_id" type="select" value={form.brand_id} onChange={handleChange} options={brandOptions} />
            <FormField label="Category" name="category_id" type="select" value={form.category_id} onChange={handleChange} options={categoryOptions} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Product Type" name="product_type" type="select" value={form.product_type} onChange={handleChange}
              options={[{ value: 'physical', label: 'Physical' }, { value: 'digital', label: 'Digital' }]} />
            <FormField label="Type" name="type" type="select" value={form.type} onChange={handleChange}
              options={[{ value: 'simple', label: 'Simple' }, { value: 'classified', label: 'With Variants' }]} />
          </div>

          <SectionTitle>Pricing & Inventory</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FormField label="MRP Price ($)" name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" required />
            <FormField label="Sale Price ($)" name="sale_price" type="number" value={form.sale_price} onChange={handleChange} placeholder="0.00" required />
            <FormField label="Discount (%)" name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="auto" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FormField label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="0" />
            <FormField label="Weight (g)" name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="0" />
            <FormField label="Stock Status" name="stock_status" type="select" value={form.stock_status} onChange={handleChange}
              options={[{ value: 'in_stock', label: 'In Stock' }, { value: 'out_of_stock', label: 'Out of Stock' }]} />
          </div>

          <SectionTitle>Status & Visibility</SectionTitle>
          <FormField label="Status" name="status" type="select" value={form.status} onChange={handleChange}
            options={[{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }]} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <CheckboxField label="Featured" name="is_featured" value={form.is_featured} onChange={handleChange} />
            <CheckboxField label="Trending" name="is_trending" value={form.is_trending} onChange={handleChange} />
            <CheckboxField label="Sale Enable" name="is_sale_enable" value={form.is_sale_enable} onChange={handleChange} />
            <CheckboxField label="Cash on Delivery" name="is_cod" value={form.is_cod} onChange={handleChange} />
            <CheckboxField label="Free Shipping" name="is_free_shipping" value={form.is_free_shipping} onChange={handleChange} />
            <CheckboxField label="Returnable" name="is_return" value={form.is_return} onChange={handleChange} />
          </div>

          <SectionTitle>Description</SectionTitle>
          <FormField label="Short Description" name="short_description" type="textarea" value={form.short_description} onChange={handleChange} rows={2} />
          <FormField label="Full Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={4} />

          <SectionTitle>Shipping & Returns</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <FormField label="Shipping Days" name="shipping_days" type="number" value={form.shipping_days} onChange={handleChange} placeholder="e.g. 7" />
            <FormField label="Estimated Delivery Text" name="estimated_delivery_text" value={form.estimated_delivery_text} onChange={handleChange} placeholder="Your order is likely to reach you within..." />
          </div>
          <FormField label="Return Policy Text" name="return_policy_text" value={form.return_policy_text} onChange={handleChange} placeholder="Hassle free 15 days return..." />

          <SectionTitle>SEO</SectionTitle>
          <FormField label="Meta Title" name="meta_title" value={form.meta_title} onChange={handleChange} />
          <FormField label="Meta Description" name="meta_description" type="textarea" value={form.meta_description} onChange={handleChange} rows={2} />

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
            <button type="button" onClick={() => setModal(false)} style={{ padding: '9px 20px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
            <button type="submit" style={{ padding: '9px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              {editing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Product" width={400}>
        <p style={{ color: '#4a5568', marginBottom: 20 }}>Delete <strong>{deleteConfirm?.name}</strong>? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '8px 18px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          <button onClick={handleDelete} style={{ padding: '8px 18px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Delete</button>
        </div>
      </AdminModal>
    </>
  );
}
