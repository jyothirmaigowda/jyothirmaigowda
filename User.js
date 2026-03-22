import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.signup(form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-up">
        <div style={styles.header}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🌿</div>
          <h1 style={styles.title}>CampusShare</h1>
          <p style={styles.sub}>{mode === 'login' ? 'Welcome back!' : 'Join your campus community'}</p>
        </div>

        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }} onClick={() => setMode('login')}>Sign In</button>
          <button style={{ ...styles.tab, ...(mode === 'signup' ? styles.tabActive : {}) }} onClick={() => setMode('signup')}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>College / University</label>
                <input name="college" value={form.college} onChange={handleChange} placeholder="e.g. IIT Bombay" />
              </div>
            </>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required minLength={6} />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {mode === 'login' && (
          <div style={styles.hint}>
            <strong>Demo:</strong> sign up with any email to try it out.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #fafaf9 60%)',
  },
  card: {
    background: '#fff', border: '1px solid #e5e7e0',
    borderRadius: 20, padding: '36px 32px',
    width: '100%', maxWidth: 420,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  },
  header: { textAlign: 'center', marginBottom: 24 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#1a6b3c' },
  sub: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  tabs: {
    display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 14, fontWeight: 500,
    background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabActive: { background: '#fff', color: '#1a6b3c', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  error: {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 8, padding: '10px 14px',
    color: '#ef4444', fontSize: 13,
  },
  submitBtn: {
    padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 700,
    background: '#1a6b3c', color: '#fff', border: 'none', cursor: 'pointer',
    marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
    ':hover': { background: '#15593 2' },
  },
  hint: {
    marginTop: 16, background: '#f0fdf4', borderRadius: 8, padding: '10px 14px',
    fontSize: 12, color: '#4b7a5a', textAlign: 'center',
  },
};
