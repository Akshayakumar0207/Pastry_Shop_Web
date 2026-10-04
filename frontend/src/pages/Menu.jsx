import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { productsApi } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CATS = [
  { id:'cakes',    label:'Cakes',     emoji:'🎂', img:'cake.jpg',     desc:'Celebration & everyday cakes for all occasions', color:'#fff0e6' },
  { id:'cupcakes', label:'Cupcakes',  emoji:'🧁', img:'cupcake.jpg',  desc:'Mini indulgences perfect for any gathering',    color:'#fff0f5' },
  { id:'icecream', label:'Ice Cream', emoji:'🍦', img:'icecream.jpg', desc:'Cool handmade scoops in unique artisan flavours', color:'#edf5ff' },
  { id:'desserts', label:'Desserts',  emoji:'🍮', img:'desserts.jpeg',desc:'Classic & artisan desserts crafted daily',       color:'#f5f0ff' },
  { id:'sweets',   label:'Sweets',    emoji:'🍬', img:'sweets.jpg',   desc:'Traditional handcrafted confections',           color:'#fffff0' },
];

export default function Menu() {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('cakes');
  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    productsApi.getAll().then(res => {
      const g = {};
      (res.data||[]).forEach(p => { if(!g[p.category]) g[p.category]=[]; g[p.category].push(p); });
      setProducts(g);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const catData = CATS.find(c => c.id===active);
  const items = products[active] || [];

  return (
    <div style={{ paddingTop:72 }}>
      {/* Hero */}
      <div style={{
        background:'linear-gradient(to right, rgba(26,10,0,0.9), rgba(59,31,14,0.6)), url("/images/background1.jpg") center/cover',
        color:'white', padding:'60px 28px 48px', textAlign:'center',
      }}>
        <div className="eyebrow" style={{ background:'rgba(196,119,58,0.25)', borderColor:'rgba(196,119,58,0.4)', color:'var(--gold)', marginBottom:16 }}>Handcrafted Daily</div>
        <h1 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2.2rem,5vw,3.5rem)', marginBottom:12 }}>Our Full Menu</h1>
        <p style={{ color:'rgba(255,255,255,0.7)', maxWidth:480, margin:'0 auto', fontSize:'1.02rem' }}>A curated selection of artisan pastries, all made from scratch every single morning</p>
      </div>

      {/* Category tab bar */}
      <div style={{ background:'var(--chocolate)', position:'sticky', top:72, zIndex:100 }}>
        <div className="container" style={{ display:'flex', gap:0, overflowX:'auto', scrollbarWidth:'none' }}>
          {CATS.map(c => (
            <button key={c.id} onClick={()=>setActive(c.id)} style={{
              padding:'16px 22px', background:'none', border:'none', cursor:'pointer',
              fontFamily:'Outfit,sans-serif', fontSize:'0.87rem', fontWeight: active===c.id ? 600 : 400,
              color: active===c.id ? 'var(--gold)' : 'rgba(253,248,242,0.55)',
              borderBottom: active===c.id ? '2.5px solid var(--gold)' : '2.5px solid transparent',
              whiteSpace:'nowrap', transition:'all 0.2s', flexShrink:0,
            }}>{c.emoji} {c.label}</button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding:'40px 28px 60px' }}>
        {/* Category banner */}
        {catData && (
          <div style={{ display:'flex', alignItems:'center', gap:22, marginBottom:36, padding:'22px 24px', background:'white', borderRadius:18, boxShadow:'0 4px 16px rgba(59,31,14,0.07)', border:'1px solid var(--border)' }}>
            <div style={{ width:88, height:88, borderRadius:16, overflow:'hidden', flexShrink:0, background:catData.color }}>
              <img src={`/images/${catData.img}`} alt={catData.label} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
            </div>
            <div>
              <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.7rem', color:'var(--chocolate)', marginBottom:5 }}>{catData.emoji} {catData.label}</h2>
              <p style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>{catData.desc}</p>
            </div>
            <div style={{ marginLeft:'auto', background:'var(--biscuit)', padding:'10px 18px', borderRadius:999, fontSize:'0.82rem', fontWeight:600, color:'var(--mocha)', flexShrink:0 }}>
              {items.length} items
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        ) : items.length===0 ? (
          <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>No items yet in this category.</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
            {items.map(p => (
              <div key={p.id} style={{ background:'white', borderRadius:18, overflow:'hidden', boxShadow:'0 4px 16px rgba(59,31,14,0.07)', border:'1px solid rgba(59,31,14,0.06)', transition:'all 0.3s', display:'flex', flexDirection:'column' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(59,31,14,0.14)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 16px rgba(59,31,14,0.07)';}}>
                <div style={{ height:210, background:catData?.color||'var(--biscuit)', overflow:'hidden', position:'relative' }}>
                  <img src={`/images/${p.image_url}`} alt={p.name}
                    style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                    onMouseEnter={e=>e.target.style.transform='scale(1.07)'}
                    onMouseLeave={e=>e.target.style.transform='scale(1)'}
                    onError={e=>e.target.style.display='none'}/>
                </div>
                <div style={{ padding:'18px 20px 20px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                  <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.15rem', color:'var(--chocolate)', lineHeight:1.25 }}>{p.name}</h3>
                  <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', flex:1, lineHeight:1.6 }}>{p.description}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:8 }}>
                    <div>
                      <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.3rem', fontWeight:700, color:'var(--chocolate)' }}>₹{parseFloat(p.price).toFixed(0)}</span>
                      <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginLeft:3 }}>/{p.weight}</span>
                    </div>
                    <button className="btn-gold" style={{ padding:'9px 18px', fontSize:'0.82rem', gap:5, borderRadius:10 }}
                      onClick={()=>{ addItem({ id:p.id, name:p.name, price:parseFloat(p.price), image_url:p.image_url, category:p.category, weight:p.weight }); addToast(`${p.name} added! 🍰`,'success'); }}>
                      <ShoppingCart size={13}/> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:44 }}>
          <Link to="/shop" className="btn-primary" style={{ fontSize:'1rem' }}>Order Now <ArrowRight size={16}/></Link>
        </div>
      </div>
    </div>
  );
}
