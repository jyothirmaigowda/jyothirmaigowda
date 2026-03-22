import React, { useState, useEffect } from 'react';
import { requestsAPI } from '../utils/api';

const STATUS_STYLES = {
  pending:  { badge: 'badge-amber', label: '⏳ Pending' },
  approved: { badge: 'badge-green', label: '✅ Approved' },
  rejected: { badge: 'badge-red',   label: '❌ Rejected' },
  returned: { badge: 'badge-blue',  label: '🔁 Returned' },
};

function RequestCard({ req, onAction, isOwner }) {
  const [loading, setLoading] = useState(false);
  const s = STATUS_STYLES[req.status] || STATUS_STYLES.pending;

  const handleAction = async (status) => {
    setLoading(true);
    await onAction(req._id, status);
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={styles.itemInfo}>
          <span style={{ fontSize: 28 }}>
            {{ Books:'📚', Electronics:'💻', Sports:'⚽', Stationery:'✏️', Clothing:'👕', Tools:'🔧', Kitchen:'🍳', Other:'📦' }[req.item?.category] || '📦'}
          </span>
          <div>
            <div style={styles.itemTitle}>{req.item?.title || 'Item'}</div>
            <div style={styles.personRow}>
              {isOwner ? `👤 ${req.borrower?.name}` : `📦 from ${req.owner?.name}`}
            </div>
          </div>
        </div>
        <span className={`badge ${s.badge}`}>{s.label}</span>
      </div>

      {req.message && (
        <div style={styles.message}>💬 "{req.message}"</div>
      )}

      <div style={styles.dateRow}>
        📅 {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>

      {isOwner && req.status === 'pending' && (
        <div style={styles.actions}>
          <button
            style={styles.approveBtn}
            onClick={() => handleAction('approved')}
            disabled={loading}
          >
            ✅ Approve
          </button>
          <button
            style={styles.rejectBtn}
            onClick={() => handleAction('rejected')}
            disabled={loading}
          >
            ❌ Reject
          </button>
        </div>
      )}

      {isOwner && req.status === 'approved' && (
        <div style={styles.actions}>
          <button
            style={styles.returnBtn}
            onClick={() => handleAction('returned')}
            disabled={loading}
          >
            🔁 Mark as Returned (+10 🪙)
          </button>
        </div>
      )}
    </div>
  );
}

export default function Requests() {
  const [tab, setTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([requestsAPI.getReceived(), requestsAPI.getSent()]);
      setReceived(r.data);
      setSent(s.data);
    } catch {
      setError('Could not load requests. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAction = async (id, status) => {
    try {
      await requestsAPI.updateStatus(id, status);
      await fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const list = tab === 'received' ? received : sent;

  return (
    <div style={{ padding: '36px 0 60px' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={styles.title} className="fade-up">Borrow Requests</h1>
        <p style={styles.sub}>Manage incoming and outgoing requests</p>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'received' ? styles.tabActive : {}) }}
            onClick={() => setTab('received')}
          >
            📥 Received {received.length > 0 && <span style={styles.count}>{received.filter(r => r.status === 'pending').length}</span>}
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'sent' ? styles.tabActive : {}) }}
            onClick={() => setTab('sent')}
          >
            📤 Sent
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : list.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📭</div>
            <h3>No {tab} requests yet</h3>
            <p>{tab === 'received' ? 'When others request your items, they\'ll appear here.' : 'Browse items and send a borrow request!'}</p>
          </div>
        ) : (
          <div style={styles.list} className="fade-up">
            {list.map(req => (
              <RequestCard
                key={req._id}
                req={req}
                isOwner={tab === 'received'}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  title: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 4 },
  sub: { color: '#6b7280', marginBottom: 24 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: {
    padding: '9px 20px', borderRadius: 99, fontSize: 14, fontWeight: 500,
    border: '1.5px solid #e5e7e0', background: '#fff', color: '#6b7280',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
  },
  tabActive: { background: '#1a6b3c', color: '#fff', borderColor: '#1a6b3c', fontWeight: 700 },
  count: {
    background: '#ef4444', color: '#fff', borderRadius: 99,
    padding: '1px 7px', fontSize: 11, fontWeight: 700,
  },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', color: '#ef4444', fontSize: 13, marginBottom: 16 },
  empty: { textAlign: 'center', padding: '60px 0', color: '#9a9a90' },
  list: { display: 'flex', flexDirection: 'column', gap: 14 },
  card: {
    background: '#fff', border: '1px solid #e5e7e0', borderRadius: 14,
    padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemInfo: { display: 'flex', gap: 12, alignItems: 'center' },
  itemTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#1c1c1a' },
  personRow: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  message: { background: '#f9fafb', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#4a4a45', fontStyle: 'italic' },
  dateRow: { fontSize: 12, color: '#9a9a90' },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  approveBtn: { padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#1a6b3c', color: '#fff', border: 'none', cursor: 'pointer', flex: 1 },
  rejectBtn: { padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer', flex: 1 },
  returnBtn: { padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', cursor: 'pointer', flex: 1 },
};
