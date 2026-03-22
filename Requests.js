import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Browse', icon: '🔍' },
  { to: '/add-item', label: 'Share Item', icon: '＋' },
  { to: '/requests', label: 'Requests', icon: '📋' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>🌿</span>
            <span style={styles.logoText}>CampusShare</span>
          </Link>

          {/* Desktop links */}
          <div style={styles.links}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  ...styles.link,
                  ...(location.pathname === link.to ? styles.linkActive : {})
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={styles.right}>
            {user ? (
              <div style={styles.userArea}>
                <span style={styles.coins}>🪙 {user.coins ?? 50}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </div>
            ) : (
              <Link to="/auth" style={styles.loginBtn}>Sign In</Link>
            )}
            {/* Mobile hamburger */}
            <button style={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="menu">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.mobileLink,
                ...(location.pathname === link.to ? styles.mobileLinkActive : {})
              }}
              onClick={() => setMenuOpen(false)}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <div style={styles.mobileDivider} />
              <div style={{ padding: '12px 20px', color: '#6b7280', fontSize: 13 }}>
                🪙 {user.coins ?? 50} coins · {user.name}
              </div>
              <button onClick={handleLogout} style={styles.mobileLogout}>Logout</button>
            </>
          ) : (
            <Link to="/auth" style={styles.mobileLoginBtn} onClick={() => setMenuOpen(false)}>
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e5e7e0', height: 64,
  },
  inner: {
    maxWidth: 1100, margin: '0 auto', padding: '0 20px',
    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' },
  logoIcon: { fontSize: 22 },
  logoText: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#1a6b3c', letterSpacing: '-0.02em' },
  links: { display: 'flex', gap: 4, '@media(maxWidth:768px)': { display: 'none' } },
  link: {
    padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
    color: '#4a4a45', textDecoration: 'none', transition: 'all 0.15s',
  },
  linkActive: { background: '#f0fdf4', color: '#1a6b3c', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  userArea: { display: 'flex', alignItems: 'center', gap: 10 },
  coins: { fontSize: 13, fontWeight: 600, color: '#b45309', background: '#fffbeb', padding: '4px 10px', borderRadius: 99 },
  logoutBtn: {
    padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
    background: 'transparent', border: '1.5px solid #e5e7e0', color: '#4a4a45',
    cursor: 'pointer',
  },
  loginBtn: {
    padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
    background: '#1a6b3c', color: '#fff', textDecoration: 'none',
  },
  hamburger: {
    display: 'none', background: 'none', border: 'none', fontSize: 20,
    cursor: 'pointer', padding: '4px 8px', color: '#1c1c1a',
    '@media(maxWidth:768px)': { display: 'block' }
  },
  mobileMenu: {
    position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
    background: '#fff', borderBottom: '1px solid #e5e7e0',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column',
  },
  mobileLink: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 20px', fontSize: 15, fontWeight: 500,
    color: '#4a4a45', borderBottom: '1px solid #f3f4f6',
    textDecoration: 'none',
  },
  mobileLinkActive: { color: '#1a6b3c', background: '#f0fdf4' },
  mobileDivider: { height: 1, background: '#e5e7e0' },
  mobileLogout: {
    padding: '14px 20px', textAlign: 'left', background: 'none',
    border: 'none', fontSize: 15, fontWeight: 500, color: '#ef4444', cursor: 'pointer',
  },
  mobileLoginBtn: {
    margin: 16, padding: '12px 20px', borderRadius: 10,
    background: '#1a6b3c', color: '#fff', textAlign: 'center',
    fontWeight: 600, fontSize: 15, textDecoration: 'none',
  },
};

// Inject responsive CSS
const css = `
  @media (max-width: 768px) {
    nav .links { display: none !important; }
    nav .hamburger { display: block !important; }
    nav .userArea .logoutBtn { display: none; }
    nav .coins { display: none; }
  }
  @media (min-width: 769px) {
    .mobileMenu { display: none !important; }
  }
`;
const styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);
