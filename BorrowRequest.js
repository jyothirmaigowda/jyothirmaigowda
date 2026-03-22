import React, { useState, useEffect, useCallback } from 'react';
import ItemCard from '../components/ItemCard';
import { itemsAPI } from '../utils/api';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Sports', 'Stationery', 'Clothing', 'Tools', 'Kitchen', 'Other'];

// Mock data for when backend is unavailable
const MOCK_ITEMS = [
  { _id: '1', title: 'Calculus Textbook', description: 'Thomas Calculus 14th edition, barely used', category: 'Books', isAvailable: true, coinsRequired: 0, image: '', owner: { name: 'Priya S.' }, createdAt: new Date() },
  { _id: '2', title: 'Scientific Calculator', description: 'Casio FX-991EX, great for engineering', category: 'Electronics', isAvailable: true, coinsRequired: 5, image: '', owner: { name: 'Rahul K.' }, createdAt: new Date() },
  { _id: '3', title: 'Badminton Racket Set', description: 'Two rackets + shuttles, perfect for evening games', category: 'Sports', isAvailable: true, coinsRequired: 0, image: '', owner: { name: 'Ananya M.' }, createdAt: new Date() },
  { _id: '4', title: 'Drawing Kit', description: 'Full set of drawing pencils, charcoal, eraser', category: 'Stationery', isAvailable: false, coinsRequired: 0, image: '', owner: { name: 'Dev T.' }, createdAt: new Date() },
  { _id: '5', title: 'Formal Blazer (M)', description: 'Navy blue blazer, size medium, perfect for presentations', category: 'Clothing', isAvailable: true, coinsRequired: 10, image: '', owner: { name: 'Sneha R.' }, createdAt: new Date() },
  { _id: '6', title: 'Screwdriver Set', description: '12-piece precision screwdriver set', category: 'Tools', isAvailable: true, coinsRequired: 0, image: '', owner: { name: 'Arjun V.' }, createdAt: new Date() },
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [useMock, setUseMock] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await itemsAPI.getAll({ search, category });
      setItems(res.data);
      setUseMock(false);
    } catch {
      // Backend not available – use mock data
      setUseMock(true);
      let filtered = MOCK_ITEMS;
      if (category !== 'All') filtered = filtered.filter(i => i.category === category);
      if (search) filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase())
      );
      setItems(filtered);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="container">
        {/* Hero */}
        <div style={styles.hero} className="fade-up">
          <div style={styles.heroTag}>🌿 Campus Resource Sharing</div>
          <h1 style={styles.heroTitle}>Borrow what you need,<br />Share what you have</h1>
          <p style={styles.heroSub}>Connect with fellow students to share resources and earn coins.</p>
        </div>

        {useMock && (
          <div style={styles.mockBanner}>
            ⚡ Running with demo data — start the backend to see live items
          </div>
        )}

        {/* Search & Filter */}
        <div style={styles.searchRow}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div style={styles.catRow}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              style={{ ...styles.catBtn, ...(category === cat ? styles.catBtnActive : {}) }}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📭</div>
            <h3>No items found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            <p style={styles.resultCount}>{items.length} item{items.length !== 1 ? 's' : ''} found</p>
            <div style={styles.grid}>
              {items.map(item => <ItemCard key={item._id} item={item} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  hero: { textAlign: 'center', padding: '20px 0 40px' },
  heroTag: {
    display: 'inline-block', padding: '5px 14px', borderRadius: 99,
    background: '#f0fdf4', color: '#1a6b3c', fontSize: 13, fontWeight: 600,
    marginBottom: 16, border: '1px solid #d1fae5',
  },
  heroTitle: { fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#1c1c1a', marginBottom: 12, lineHeight: 1.15 },
  heroSub: { fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto' },
  mockBanner: {
    background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10,
    padding: '10px 16px', marginBottom: 24, fontSize: 13, color: '#92400e', textAlign: 'center',
  },
  searchRow: { marginBottom: 16 },
  searchWrap: { position: 'relative', maxWidth: 480, margin: '0 auto' },
  searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' },
  searchInput: {
    width: '100%', paddingLeft: 42, paddingRight: 16, height: 46,
    borderRadius: 12, border: '1.5px solid #e5e7e0', fontSize: 15,
    background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  catRow: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 },
  catBtn: {
    padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500,
    border: '1.5px solid #e5e7e0', background: '#fff', color: '#6b7280', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  catBtnActive: { background: '#1a6b3c', color: '#fff', borderColor: '#1a6b3c', fontWeight: 600 },
  resultCount: { fontSize: 13, color: '#9a9a90', marginBottom: 16 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
  },
  empty: { textAlign: 'center', padding: '60px 0', color: '#9a9a90' },
};
