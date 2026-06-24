'use client';
import DataTable from '../DataTable';
import { useProducts } from '@/utils/hooks/useProducts';

export default function AdminProducts() {
  const { data: page, isLoading: loading } = useProducts({ paginate: 200 });
  const products = page?.data ?? [];

  const columns = [
    { key: 'id', label: '#', render: (v) => <span style={{ color: '#a0aec0', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'name', label: 'Product',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {row.product_thumbnail?.original_url ? (
            <img src={row.product_thumbnail.original_url} alt={v} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} onError={e => e.target.style.display='none'} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#a0aec0' }}>IMG</div>
          )}
          <span style={{ fontWeight: 500, color: '#1a202c' }}>{v}</span>
        </div>
      )
    },
    { key: 'sale_price', label: 'Price', render: (v, row) => `$${(v || row.price || 0).toFixed(2)}` },
    { key: 'product_type', label: 'Type', render: v => <span style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{v}</span> },
    {
      key: 'status', label: 'Status',
      render: v => (
        <span style={{
          padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
          background: v === 1 ? '#38a16918' : '#e53e3e18',
          color: v === 1 ? '#38a169' : '#e53e3e',
        }}>{v === 1 ? 'Active' : 'Inactive'}</span>
      )
    },
    { key: 'unit', label: 'Unit' },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>;

  return <DataTable columns={columns} data={products} searchKey="name" />;
}
