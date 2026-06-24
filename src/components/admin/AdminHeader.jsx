'use client';
import { RiBellLine, RiUserLine } from 'react-icons/ri';

export default function AdminHeader({ title }) {
  return (
    <header style={{
      height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <h6 style={{ margin: 0, fontWeight: 600, color: '#1a202c', fontSize: '1rem' }}>{title}</h6>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096', position: 'relative' }}>
          <RiBellLine size={20} />
          <span style={{
            position: 'absolute', top: -4, right: -4, width: 8, height: 8,
            background: '#6366f1', borderRadius: '50%',
          }} />
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer',
        }}>
          <RiUserLine size={18} />
        </div>
      </div>
    </header>
  );
}
