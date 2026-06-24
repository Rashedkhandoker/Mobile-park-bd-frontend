export default function StatCard({ title, value, icon: Icon, color, change }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '20px 24px',
      border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', lineHeight: 1.2 }}>{value}</div>
        {change && <div style={{ fontSize: '0.75rem', color: change > 0 ? '#38a169' : '#e53e3e', marginTop: 2 }}>
          {change > 0 ? '▲' : '▼'} {Math.abs(change)}% vs last month
        </div>}
      </div>
    </div>
  );
}
