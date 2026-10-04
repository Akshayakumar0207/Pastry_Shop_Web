import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { productsApi } from '../hooks/useApi';
import ProductCard from '../components/ProductCard';

const CATS = [
  { id:'all', label:'All Items', emoji:'✨' },
  { id:'cakes', label:'Cakes', emoji:'🎂' },
  { id:'cupcakes', label:'Cupcakes', emoji:'🧁' },
  { id:'icecream', label:'Ice Cream', emoji:'🍦' },
  { id:'desserts', label:'Desserts', emoji:'🍮' },
  { id:'sweets', label:'Sweets', emoji:'🍬' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const cat = searchParams.get('category') || 'all';

  useEffect(() => {
    productsApi.getAll().then(r => setProducts(r.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const setCat = (c) => { if (c==='all') { const p = new URLSearchParams(searchParams); p.delete('category'); setSearchParams(p); } else setSearchParams({ category:c }); };

  const filtered = products
    .filter(p => cat==='all' || p.category===cat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description||'').toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sort==='price_asc' ? a.price-b.price : sort==='price_desc' ? b.price-a.price : sort==='name' ? a.name.localeCompare(b.name) : 0);

  return (
    <div style={{ paddingTop:72 }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1a0a00 0%,#3b1f0e 60%,#5c2e14 100%)', padding:'52px 28px 40px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(196,119,58,0.15)', pointerEvents:'none' }}/>
        <div className="eyebrow" style={{ background:'rgba(196,119,58,0.2)', borderColor:'rgba(196,119,58,0.35)', color:'var(--gold)', marginBottom:14 }}>Fresh Daily</div>
        <h1 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2.2rem,5vw,3.2rem)', color:'var(--cream)', marginBottom:10 }}>Our Pastry Shop</h1>
        <p style={{ color:'rgba(253,248,242,0.65)', fontSize:'1rem', maxWidth:400, margin:'0 auto' }}>Every item handcrafted with love, available for delivery across Salem</p>
      </div>

      <div className="container" style={{ padding:'32px 28px' }}>
        {/* Filter row */}
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap', marginBottom:24, padding:'16px 20px', background:'white', borderRadius:16, boxShadow:'0 2px 12px rgba(59,31,14,0.06)', border:'1px solid var(--border)' }}>
          <div style={{ position:'relative', flex:'1 1 200px', maxWidth:340 }}>
            <Search size={15} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pastries..."
              style={{ width:'100%', padding:'10px 14px 10px 38px', border:'1.5px solid var(--border)', borderRadius:999, fontFamily:'Outfit,sans-serif', fontSize:'0.88rem', outline:'none', background:'var(--cream)' }}
              onFocus={e=>{e.target.style.borderColor='var(--caramel)';e.target.style.boxShadow='0 0 0 3px rgba(196,119,58,0.12)';}}
              onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.boxShadow='none';}}
            />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <SlidersHorizontal size={15} color="var(--text-muted)"/>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{ padding:'10px 14px', border:'1.5px solid var(--border)', borderRadius:999, fontFamily:'Outfit,sans-serif', fontSize:'0.85rem', outline:'none', background:'var(--cream)', color:'var(--text-primary)' }}>
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
          <span style={{ marginLeft:'auto', fontSize:'0.83rem', color:'var(--text-muted)', fontWeight:500 }}>{filtered.length} items</span>
        </div>

        {/* Category tabs */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:32 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={()=>setCat(c.id)} style={{
              padding:'9px 18px', borderRadius:999, border:'none', cursor:'pointer',
              fontSize:'0.85rem', fontWeight:500, fontFamily:'Outfit,sans-serif', transition:'all 0.2s',
              background: cat===c.id ? 'linear-gradient(135deg,var(--chocolate),var(--mocha))' : 'white',
              color: cat===c.id ? 'white' : 'var(--text-secondary)',
              boxShadow: cat===c.id ? '0 4px 16px rgba(59,31,14,0.28)' : '0 2px 8px rgba(59,31,14,0.06)',
              border: cat===c.id ? 'none' : '1px solid var(--border)',
            }}>{c.emoji} {c.label}</button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(255px,1fr))', gap:26 }}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ borderRadius:18, overflow:'hidden' }}>
                <div className="skeleton" style={{ height:195 }}/>
                <div style={{ padding:16, background:'white', display:'flex', flexDirection:'column', gap:8 }}>
                  <div className="skeleton" style={{ height:16, width:'70%' }}/>
                  <div className="skeleton" style={{ height:12, width:'90%' }}/>
                  <div className="skeleton" style={{ height:12, width:'60%' }}/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 40px', color:'var(--text-muted)' }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🍪</div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', marginBottom:8, fontSize:'1.6rem' }}>Nothing found</h3>
            <p>Try a different search term or category</p>
          </div>
        ) : (
          <div className="product-grid fade-in-up">{filtered.map(p => <ProductCard key={p.id} product={p}/>)}</div>
        )}
      </div>
    </div>
  );
}
