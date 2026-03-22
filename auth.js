import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../utils/api';

const CATEGORIES = ['Books', 'Electronics', 'Sports', 'Stationery', 'Clothing', 'Tools', 'Kitchen', 'Other'];

export default function AddItem() {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Books',
    availableFrom: '', availableTo: '', coinsRequired: 0,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await itemsAPI.create(fd);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '36px 0 60px' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="fade-up">
          <h1 style={styles.pageTitle}>Share an Item</h1>
          <p style={styles.pageSub}>List something you'd like to lend to fellow students</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} className="fade-up">
          {/* Image upload */}
          <div style={styles.imageUpload} onClick={() => document.getElementById('imgInput').click()}>
            {preview ? (
              <img src={preview} alt="preview" style={styles.previewImg} />
            ) : (
              <div style={styles.uploadPlaceholder}>
                <span style={{ fontSize: 32 }}>📷</span>
                <span style={{ fontSize: 13, color: '#9a9a90', marginTop: 6 }}>Click to add a photo (optional)</span>
              </div>
            )}
            <input id="imgInput" type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Item Name *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Calculus Textbook" required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the item, its condition, any notes..." required
              style={styles.textarea} rows={3} />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} style={styles.select}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Coins Required 🪙</label>
              <input name="coinsRequired" type="number" min={0} max={100}
                value={form.coinsRequired} onChange={handleChange} placeholder="0" />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Available From</label>
              <input name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Available Until</label>
              <input name="availableTo" type="date" value={form.availableTo} onChange={handleChange} />
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.btns}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? '⏳ Sharing...' : '🌿 Share Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageTitle: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 4 },
  pageSub: { color: '#6b7280', marginBottom: 28 },
  form: { background: '#fff', border: '1px solid #e5e7e0', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 20 },
  imageUpload: {
    border: '2px dashed #d1fae5', borderRadius: 12, height: 160,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', overflow: 'hidden', background: '#f0fdf4',
    transition: 'border-color 0.2s',
  },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  field: { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  textarea: { resize: 'vertical', minHeight: 80 },
  select: { appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%236b7280\' d=\'M7 10l5 5 5-5z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' },
  row: { display: 'flex', gap: 16 },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13 },
  btns: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  cancelBtn: { padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer' },
  submitBtn: { padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: '#1a6b3c', color: '#fff', border: 'none', cursor: 'pointer' },
};
