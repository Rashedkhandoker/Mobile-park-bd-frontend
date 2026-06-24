'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiDashboardLine, RiShoppingBag3Line, RiListOrdered, RiPriceTag3Line, RiMedalLine, RiUserLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: RiDashboardLine },
  { href: '/admin/products', label: 'Products', icon: RiShoppingBag3Line },
  { href: '/admin/orders', label: 'Orders', icon: RiListOrdered },
  { href: '/admin/categories', label: 'Categories', icon: RiPriceTag3Line },
  { href: '/admin/brands', label: 'Brands', icon: RiMedalLine },

  { href: '/admin/users', label: 'Users', icon: RiUserLine },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #2d3748' }}>
        <h5 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px' }}>
          Admin Panel
        </h5>
        <small style={{ color: '#a0aec0', fontSize: '0.75rem' }}>Management Console</small>
      </div>
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 24px',
              color: isActive(href) ? '#fff' : '#a0aec0',
              background: isActive(href) ? 'rgba(99,102,241,0.2)' : 'transparent',
              borderLeft: isActive(href) ? '3px solid #6366f1' : '3px solid transparent',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: isActive(href) ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #2d3748' }}>
        <Link href="/" style={{ color: '#a0aec0', fontSize: '0.8rem', textDecoration: 'none' }}>
          ← Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="d-lg-none"
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 1100,
          background: '#1a202c', border: 'none', borderRadius: 8,
          color: '#fff', padding: '8px 10px', cursor: 'pointer',
        }}
      >
        {open ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1049 }}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="d-none d-lg-block" style={{
        width: 240, minHeight: '100vh', background: '#1a202c',
        position: 'fixed', top: 0, left: 0, zIndex: 100,
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <aside className="d-lg-none" style={{
        width: 240, height: '100vh', background: '#1a202c',
        position: 'fixed', top: 0, left: open ? 0 : -240, zIndex: 1050,
        transition: 'left 0.25s ease',
      }}>
        {sidebarContent}
      </aside>
    </>
  );
}
