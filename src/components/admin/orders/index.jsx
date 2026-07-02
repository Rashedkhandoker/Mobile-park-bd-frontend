'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderById, updateOrderStatus, cancelOrder } from '@/utils/backendApi/adminApi';
import { RiSearchLine, RiEyeLine, RiCloseLine, RiTruckLine } from 'react-icons/ri';

const ACCENT = '#6366f1';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS = {
  PENDING: '#ed8936',
  CONFIRMED: '#3182ce',
  SHIPPED: '#805ad5',
  DELIVERED: '#38a169',
  CANCELLED: '#e53e3e',
};

function Badge({ label, color }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600,
      background: `${color}18`, color,
    }}>{label}</span>
  );
}

function OrderDetailModal({ open, orderId, onClose }) {
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState('');
  const [statusError, setStatusError] = useState('');

  const { data: orderRes, isLoading } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId && open,
  });

  const order = orderRes?.data;

  useEffect(() => {
    if (order) setNewStatus(order.status);
  }, [order]);

  const statusMut = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
      setStatusError('');
    },
    onError: (err) => setStatusError(err?.response?.data?.message || 'Update failed'),
  });

  const cancelMut = useMutation({
    mutationFn: (id) => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
    },
  });

  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalBoxStyle, maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h5 style={{ margin: 0, fontWeight: 600, color: '#1a202c' }}>
            Order #{orderId}
          </h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0' }}>
            <RiCloseLine size={22} />
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</div>
        ) : !order ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Order not found</div>
        ) : (
          <>
            {/* Order summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              <InfoCard label="Status">
                <Badge label={order.status} color={STATUS_COLORS[order.status] || '#718096'} />
              </InfoCard>
              <InfoCard label="Total">
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>৳{parseFloat(order.totalAmount || 0).toFixed(2)}</span>
              </InfoCard>
              <InfoCard label="Date">
                {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
              </InfoCard>
            </div>

            {/* Shipping address */}
            {order.shippingAddress && (
              <div style={{ background: '#f7fafc', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Shipping Address</div>
                <div style={{ fontSize: '0.85rem', color: '#2d3748' }}>
                  {order.shippingAddress.street && <div>{order.shippingAddress.street}</div>}
                  {order.shippingAddress.city && <span>{order.shippingAddress.city}, </span>}
                  {order.shippingAddress.state && <span>{order.shippingAddress.state} </span>}
                  {order.shippingAddress.zipCode && <span>{order.shippingAddress.zipCode}</span>}
                </div>
              </div>
            )}

            {/* Order items */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>Items ({order.items?.length || 0})</div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f7fafc' }}>
                      <th style={thStyle}>Product</th>
                      <th style={thStyle}>Qty</th>
                      <th style={thStyle}>Unit Price</th>
                      <th style={thStyle}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {item.product?.thumbnailUrl || item.product?.images?.[0]?.imageUrl ? (
                              <img src={item.product.thumbnailUrl || item.product.images[0].imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: 36, height: 36, borderRadius: 6, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#a0aec0' }}>IMG</div>
                            )}
                            <span style={{ fontWeight: 500 }}>{item.product?.name || `Product #${item.productId}`}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '10px 12px' }}>৳{parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 500 }}>৳{(item.quantity * parseFloat(item.unitPrice || 0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status update */}
            <div style={{ background: '#f7fafc', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', marginBottom: 8 }}>Update Status</div>
              {statusError && (
                <div style={{ padding: '8px 12px', borderRadius: 6, marginBottom: 10, background: '#fed7d7', color: '#c53030', fontSize: '0.8rem' }}>
                  {statusError}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', minWidth: 160 }}
                >
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={() => statusMut.mutate({ id: orderId, status: newStatus })}
                  disabled={statusMut.isPending || newStatus === order.status}
                  style={{ ...btnPrimary, opacity: newStatus === order.status ? 0.5 : 1 }}
                >
                  {statusMut.isPending ? 'Updating...' : 'Update Status'}
                </button>
                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                  <button
                    onClick={() => { if (confirm('Cancel this order?')) cancelMut.mutate(orderId); }}
                    disabled={cancelMut.isPending}
                    style={{ ...btnPrimary, background: '#e53e3e' }}
                  >
                    {cancelMut.isPending ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, children }) {
  return (
    <div style={{ background: '#f7fafc', borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ fontSize: '0.72rem', color: '#718096', marginBottom: 4 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [detailOrderId, setDetailOrderId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () => getOrders({
      page, limit: 15, sortBy: 'createdAt', sortDir: 'desc',
      ...(statusFilter && { status: statusFilter }),
    }),
  });

  const orders = data?.data || [];
  const pagination = data?.meta?.pagination || data?.pagination || { total: 0, page: 1, limit: 15 };
  const totalPages = Math.ceil((pagination.total || 0) / (pagination.limit || 15));

  return (
    <>
      <div style={{ padding: '20px 24px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              style={{ ...inputStyle, width: 'auto', minWidth: 150 }}
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#718096' }}>
            {pagination.total || orders.length} order{(pagination.total || orders.length) !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Status summary chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {ORDER_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(statusFilter === s ? '' : s); setPage(1); }}
              style={{
                padding: '5px 14px', borderRadius: 20, border: '1px solid',
                borderColor: statusFilter === s ? STATUS_COLORS[s] : '#e2e8f0',
                background: statusFilter === s ? `${STATUS_COLORS[s]}12` : '#fff',
                color: STATUS_COLORS[s], fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#a0aec0' }}>No orders found</td></tr>
                ) : orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 600, color: ACCENT }}>#{o.id}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4a5568', fontSize: '0.85rem' }}>
                      {o.customerId || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {o.itemCount ?? o.items?.length ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                      ৳{parseFloat(o.totalAmount || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge label={o.status} color={STATUS_COLORS[o.status] || '#718096'} />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#4a5568', fontSize: '0.85rem' }}>
                      {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => setDetailOrderId(o.id)} title="View" style={iconBtn}>
                        <RiEyeLine size={16} />
                      </button>
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

      <OrderDetailModal
        open={!!detailOrderId}
        orderId={detailOrderId}
        onClose={() => setDetailOrderId(null)}
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
  height: 38, padding: '0 12px',
  border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem',
  outline: 'none', color: '#1a202c', background: '#fff', boxSizing: 'border-box',
};

const thStyle = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#4a5568', fontSize: '0.8rem' };

const btnPrimary = {
  padding: '8px 18px', border: 'none', borderRadius: 8,
  background: `linear-gradient(135deg, ${ACCENT}, #8b5cf6)`,
  color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
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
