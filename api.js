import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemsAPI, requestsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CATEGORY_ICONS = { Books:'📚', Electronics:'💻', Sports:'⚽', Stationery:'✏️', Clothing:'👕', Tools:'🔧', Kitchen:'🍳', Other:'📦' };

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    itemsAPI.getById(id)
      .then(r => setItem(r.data))
      .catch(() => setError('Item not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequest = async e => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    setRequesting(true); setError(''); setSuccess('');
    try {
      await requestsAPI.create({ itemId: id, message });
      setSuccess('✅ Borrow request sent! The owner will review it shortly.');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}><div className="spinner" /></div>;
  if (error && !item) return <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>{error}</div>;
  if (!item) return null;

  const isOwner = user && item.owner?._id === user.id;
  const imgSrc = item.image ? `http://localhost:5000${item.image}` : null;

  return (
    <div style={{ padding: '36px 0 60px' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/" style={styles.back}>← Back to browse</Link>
        <div style={styles.grid} className="fade-up">
          {/* Image */}
          <div style={styles.imgWrap}>
            {imgSrc ? (
              <img src={imgSrc} alt={item.title} style={styles.img} />
            ) : (
              <div style={styles.imgPlaceholder}>
                <span style={{ fontSize: 72 }}>{CATEGORY_ICONS[item.category] || '📦'}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={styles.info}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-green">{CATEGORY_ICONS[item.category]} {item.category}</span>
              <span className={`badge ${item.isAvailable ? 'badge-green' : 'badge-red'}`}>
                {item.isAvailable ? '✅ Available' : '🔴 Currently Borrowed'}
              </span>
            </div>

            <h1 style={styles.title}>{item.title}</h1>
            <p style={styles.desc}>{item.description}</p>

            <div style={styles.meta}>
              <div style={styles.metaRow}><span>👤 Owner</span><strong>{item.owner?.name}</strong></div>
              <div style={styles.metaRow}><span>🏫 College</span><strong>{item.owner?.college || 'N/A'}</strong></div>
              {item.coinsRequired > 0 && (
                <div style={styles.metaRow}><span>🪙 Coins</span><strong>{item.coinsRequired} coins required</strong></div>
              )}
              {item.availableTo && (
                <div style={styles.metaRow}><span>📅 Available until</span><strong>{new Date(item.availableTo).toLocaleDateString()}</strong></div>
              )}
            </div>

            {/* Borrow form */}
            {!isOwner && item.isAvailable && (
              <form onSubmit={handleRequest} style={styles.borrowForm}>
                <h3 style={styles.borrowTitle}>Request to Borrow</h3>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Add a message to the owner (optional)..."
                  rows={3} style={{ resize: 'none' }}
                />
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.successMsg}>{success}</div>}
                {!success && (
                  <button type="submit" style={styles.borrowBtn} disabled={requesting}>
                    {requesting ? '⏳ Sending...' : (user ? '📩 Send Borrow Request' : '🔐 Sign in to Request')}
                  </button>
                )}
              </form>
            )}

            {isOwner && (
              <div style={styles.ownerNote}>
                <span>✏️ This is your item.</span>
                <Link to="/profile" style={{ color: '#1a6b3c', fontWeight: 600 }}>Manage in Profile →</Link>
              </div>
            )}

            {!item.isAvailable && !isOwner && (
              <div style={styles.unavailNote}>
                🔴 This item is currently borrowed. Check back later!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  back: { display: 'inline-block', marginBottom: 20, color: '#6b7280', fontSize: 14, fontWeight: 500, textDecoration: 'none' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, '@media(maxWidth:640px)': { gridTemplateColumns: '1fr' } },
  imgWrap: { borderRadius: 16, overflow: 'hidden', background: '#f9fafb', aspectRatio: '1', border: '1px solid #e5e7e0' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: { width: '100%', height: '100%', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' },
  info: { display: 'flex', flexDirection: 'column', gap: 16 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#1c1c1a', lineHeight: 1.2 },
  desc: { color: '#4a4a45', lineHeight: 1.7, fontSize: 15 },
  meta: { background: '#f9fafb', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 },
  metaRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' },
  borrowForm: { background: '#f0fdf4', border: '1px solid #d1fae5', borderRadius: 12, padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 },
  borrowTitle: { fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: '#1a6b3c' },
  borrowBtn: { padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#1a6b3c', color: '#fff', border: 'none', cursor: 'pointer' },
  error: { background: '#fef2f2', borderRadius: 8, padding: '10px 12px', color: '#ef4444', fontSize: 13 },
  successMsg: { background: '#f0fdf4', borderRadius: 8, padding: '10px 12px', color: '#1a6b3c', fontSize: 13, fontWeight: 500 },
  ownerNote: { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 16px', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  unavailNote: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 16px', fontSize: 14, color: '#b91c1c' },
};
