'use client';
import { RiBellLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { useAdminAuth } from '@/context/adminAuthContext';
import { useRouter } from 'next/navigation';

export default function AdminHeader({ title }) {
  const { user, logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'A';

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.8rem', fontWeight: 600,
          }}>
            {initials}
          </div>
          {user?.email && (
            <span style={{ fontSize: '0.8rem', color: '#4a5568', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'none', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '6px 12px', cursor: 'pointer', color: '#718096',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e53e3e'; e.currentTarget.style.color = '#e53e3e'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#718096'; }}
        >
          <RiLogoutBoxRLine size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
