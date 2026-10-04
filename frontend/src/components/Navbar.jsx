import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setOpen(false), [loc]);

  const links = [
    { to:'/', label:'Home' },
    { to:'/menu', label:'Menu' },
    { to:'/shop', label:'Shop' },
    { to:'/events', label:'Events' },
    { to:'/contact', label:'Contact' },
    { to:'/track', label:'Track Order' },
  ];
  const active = (to) => loc.pathname === to;

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? 'rgba(253,248,242,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(18px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(59,31,14,0.1)' : 'none',
      transition:'all 0.35s ease',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px', display:'flex', alignItems:'center', height:72, gap:8 }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:11, marginRight:'auto', textDecoration:'none' }}>
          <img src="/logo.svg" alt="Pâtisserie Dorée logo" style={{ width:40, height:40 }} />
          <div>
            <div style={{
              fontFamily:'Cormorant Garamond, serif', fontSize:'1.22rem', fontWeight:700, lineHeight:1,
              color: scrolled ? 'var(--chocolate)' : 'white',
              textShadow: scrolled ? 'none' : '0 1px 5px rgba(0,0,0,0.5)',
              transition:'color 0.35s',
            }}>Pâtisserie Dorée</div>
            <div style={{ fontSize:'0.58rem', color: scrolled ? 'var(--caramel)' : 'rgba(255,255,255,0.65)', letterSpacing:'0.14em', textTransform:'uppercase', transition:'color 0.35s' }}>Artisan Pastry Studio</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display:'flex', alignItems:'center', gap:2 }} className="desk-nav">
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding:'7px 13px', borderRadius:9, fontSize:'0.87rem', fontWeight: active(l.to) ? 600 : 400,
              color: scrolled ? (active(l.to) ? 'var(--caramel)' : 'var(--text-secondary)') : (active(l.to) ? 'var(--gold)' : 'rgba(255,255,255,0.85)'),
              background: active(l.to) && scrolled ? 'rgba(196,119,58,0.1)' : 'transparent',
              transition:'all 0.2s', textDecoration:'none',
              textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
            }}
              onMouseEnter={e => { if (!active(l.to)) { e.currentTarget.style.color = scrolled ? 'var(--caramel)' : 'white'; e.currentTarget.style.background = scrolled ? 'rgba(196,119,58,0.07)' : 'rgba(255,255,255,0.1)'; }}}
              onMouseLeave={e => { if (!active(l.to)) { e.currentTarget.style.color = scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'transparent'; }}}
            >{l.label}</Link>
          ))}

          {/* Cart button */}
          <Link to="/cart" style={{ position:'relative', marginLeft:8 }}>
            <div style={{
              width:42, height:42, borderRadius:12,
              background: scrolled ? 'linear-gradient(135deg,#3b1f0e,#6b3a22)' : 'rgba(255,255,255,0.15)',
              border: scrolled ? 'none' : '1.5px solid rgba(255,255,255,0.28)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: scrolled ? '0 4px 14px rgba(59,31,14,0.28)' : 'none',
              transition:'all 0.25s',
            }}>
              <ShoppingCart size={17} color="white"/>
            </div>
            {count > 0 && (
              <span style={{
                position:'absolute', top:-5, right:-5,
                background:'linear-gradient(135deg,var(--caramel),var(--gold))',
                color:'white', width:20, height:20, borderRadius:'50%',
                fontSize:'0.68rem', fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'2px solid white', boxShadow:'0 2px 8px rgba(196,119,58,0.45)',
              }}>{count > 9 ? '9+' : count}</span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="mob-btn" style={{ display:'none', background:'none', border:'none', color: scrolled ? 'var(--chocolate)' : 'white', padding:8, marginLeft:8 }}>
          {open ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:'white', borderTop:'1px solid var(--border)', padding:'12px 20px 20px', display:'flex', flexDirection:'column', gap:2, boxShadow:'0 8px 24px rgba(59,31,14,0.12)' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              padding:'11px 14px', borderRadius:10, textDecoration:'none',
              color: active(l.to) ? 'var(--caramel)' : 'var(--text-primary)',
              background: active(l.to) ? 'rgba(196,119,58,0.09)' : 'transparent',
              fontWeight: active(l.to) ? 600 : 400, fontSize:'0.95rem',
            }}>{l.label}</Link>
          ))}
          <Link to="/cart" style={{ padding:'11px 14px', borderRadius:10, display:'flex', alignItems:'center', gap:10, color:'var(--text-primary)', fontWeight:500, textDecoration:'none' }}>
            <ShoppingCart size={18}/> Cart
            {count > 0 && <span style={{ background:'linear-gradient(135deg,var(--caramel),var(--gold))', color:'white', borderRadius:'50%', width:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700 }}>{count}</span>}
          </Link>
        </div>
      )}

      <style>{`@media(max-width:820px){.desk-nav{display:none!important;}.mob-btn{display:flex!important;}}`}</style>
    </nav>
  );
}
