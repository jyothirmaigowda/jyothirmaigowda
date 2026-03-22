import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  Books: '📚', Electronics: '💻', Sports: '⚽', Stationery: '✏️',
  Clothing: '👕', Tools: '🔧', Kitchen: '🍳', Other: '📦',
};

export default function ItemCard({ item }) {
  const icon = CATEGORY_ICONS[item.category] || '📦';
  const imgSrc = item.image
    ? (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`)
    : null;

  return (
    <Link to={`/items/${item._id}`} style={{ textDecoration: 'none' }}>
      <div style={styles.card}>
        <div style={styles.imgWrap}>
          {imgSrc ? (
            <img src={imgSrc} alt={item.title} style={styles.img} />
          ) : (
            <div style={styles.placeholder}>
              <span style={{ fontSize: 40 }}>{icon}</span>
            </div>
          )}
          <div style={styles.categoryBadge}>{icon} {item.category}</div>
          {!item.isAvailable && <div style={styles.unavailableBadge}>Borrowed</div>}
        </div>
        <div style={styles.body}>
          <h3 style={styles.title}>{item.title}</h3>
          <p style={styles.desc}>{item.description}</p>
          <div style={styles.footer}>
            <span style={styles.owner}>
              👤 {item.owner?.name || 'Unknown'}
            </span>
            {item.coinsRequired > 0 && (
              <span style={styles.coins}>🪙 {item.coinsRequired}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e5e7e0',
    borderRadius: 14,
    overflow: 'hidden',
    transition: 'transform 0.18s, box-shadow 0.18s',
    cursor: 'pointer',
    ':hover': { transform: 'translateY(-2px)' },
  },
  imgWrap: { position: 'relative', height: 180, overflow: 'hidden', background: '#f9fafb' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
  },
  categoryBadge: {
    position: 'absolute', top: 10, left: 10,
    background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
    borderRadius: 99, padding: '3px 10px', fontSize: 12, fontWeight: 600,
    color: '#1a6b3c', border: '1px solid #d1fae5',
  },
  unavailableBadge: {
    position: 'absolute', top: 10, right: 10,
    background: '#fef2f2', color: '#ef4444',
    borderRadius: 99, padding: '3px 10px', fontSize: 12, fontWeight: 600,
    border: '1px solid #fecaca',
  },
  body: { padding: '14px 16px 16px' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, color: '#1c1c1a', marginBottom: 4 },
  desc: { fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginBottom: 12,
    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  owner: { fontSize: 12, color: '#9a9a90', fontWeight: 500 },
  coins: { fontSize: 12, fontWeight: 600, color: '#b45309', background: '#fffbeb', padding: '2px 8px', borderRadius: 99 },
};
