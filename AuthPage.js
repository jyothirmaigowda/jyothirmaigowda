:root {
  --brand: #1a6b3c;
  --brand-light: #22c55e;
  --brand-pale: #f0fdf4;
  --bg: #fafaf9;
  --surface: #ffffff;
  --border: #e5e7e0;
  --text: #1c1c1a;
  --text-2: #4a4a45;
  --text-3: #9a9a90;
  --amber: #f59e0b;
  --amber-pale: #fffbeb;
  --red: #ef4444;
  --red-pale: #fef2f2;
  --blue: #3b82f6;
  --blue-pale: #eff6ff;
  --radius: 14px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
  --font-display: 'Syne', sans-serif;
  --font-body: 'Instrument Sans', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 700; line-height: 1.2; }

a { color: inherit; text-decoration: none; }

img { max-width: 100%; display: block; }

button { font-family: var(--font-body); cursor: pointer; border: none; outline: none; }

input, textarea, select {
  font-family: var(--font-body);
  font-size: 15px;
  outline: none;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  background: var(--surface);
  color: var(--text);
  width: 100%;
  transition: border-color 0.2s;
}
input:focus, textarea:focus, select:focus { border-color: var(--brand); }
input::placeholder, textarea::placeholder { color: var(--text-3); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin { to { transform: rotate(360deg); } }

.fade-up { animation: fadeUp 0.4s ease forwards; }

/* Utility */
.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* Badge */
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 99px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.02em;
}
.badge-green { background: var(--brand-pale); color: var(--brand); }
.badge-amber { background: var(--amber-pale); color: #b45309; }
.badge-red { background: var(--red-pale); color: var(--red); }
.badge-blue { background: var(--blue-pale); color: var(--blue); }
.badge-gray { background: #f3f4f6; color: #6b7280; }

/* Spinner */
.spinner {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2.5px solid var(--border);
  border-top-color: var(--brand);
  animation: spin 0.7s linear infinite;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 640px) {
  .container { padding: 0 14px; }
}
