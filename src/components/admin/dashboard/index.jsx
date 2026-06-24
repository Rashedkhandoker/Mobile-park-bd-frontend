'use client';
import { useState } from 'react';
import StatCard from '../StatCard';
import { RiShoppingBag3Line, RiListOrdered, RiUserLine, RiMoneyDollarCircleLine, RiCoupon3Line } from 'react-icons/ri';
import { useProducts } from '@/utils/hooks/useProducts';

const STATUS_COLORS = {
  PENDING: '#ed8936',
  PAID: '#38a169',
  FAILED: '#e53e3e',
};

export default function AdminDashboard() {
  const { data: productPage } = useProducts({ paginate: 200 });
  const products = productPage?.data ?? [];

  // orders still via fetch (no order service yet)
  const [orders, setOrders] = useState([]);
  useState(() => {
    fetch('/api/order').then(r => r.json()).then(d => setOrders(d.data || []));
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const recentOrders = orders.slice(0, 8);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="Total Products" value={products.length || 0} icon={RiShoppingBag3Line} color="#6366f1" change={12} />
        <StatCard title="Total Orders" value={orders.length || 0} icon={RiListOrdered} color="#3182ce" change={8} />
        <StatCard title="Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={RiMoneyDollarCircleLine} color="#38a169" change={5} />
        <StatCard title="Customers" value="—" icon={RiUserLine} color="#ed8936" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Recent orders */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#1a202c' }}>
            Recent Orders
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f7fafc' }}>
                  {['Order #', 'Amount', 'Payment', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 600, color: '#6366f1' }}>#{order.order_number}</td>
                    <td style={{ padding: '10px 16px' }}>${order.total?.toFixed(2)}</td>
                    <td style={{ padding: '10px 16px', textTransform: 'uppercase', fontSize: '0.75rem' }}>{order.payment_method}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
                        background: `${STATUS_COLORS[order.payment_status] || '#718096'}18`,
                        color: STATUS_COLORS[order.payment_status] || '#718096',
                      }}>
                        {order.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#a0aec0' }}>No orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
            <div style={{ fontWeight: 600, color: '#1a202c', marginBottom: 16 }}>Quick Stats</div>
            {[
              { label: 'Avg Order Value', value: orders.length ? `$${(totalRevenue / orders.length).toFixed(2)}` : '$0' },
              { label: 'Digital Orders', value: orders.filter(o => o.is_digital_only).length },
              { label: 'COD Orders', value: orders.filter(o => o.payment_method === 'cod').length },
              { label: 'Paid Orders', value: orders.filter(o => o.payment_status === 'PAID').length },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem' }}>
                <span style={{ color: '#718096' }}>{label}</span>
                <span style={{ fontWeight: 600, color: '#1a202c' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 12, padding: 20, color: '#fff' }}>
            <RiCoupon3Line size={32} style={{ opacity: 0.8, marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>Manage Coupons</div>
            <div style={{ opacity: 0.8, fontSize: '0.8rem', marginBottom: 16 }}>Create discount codes for customers</div>
            <a href="/admin/coupons" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              View Coupons →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
