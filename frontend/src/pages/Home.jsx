import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Award, Clock, ChefHat, Heart, Sparkles } from 'lucide-react';
import { productsApi } from '../hooks/useApi';
import ProductCard from '../components/ProductCard';

const CATS = [
  { id:'cakes',    label:'Cakes',     emoji:'🎂', img:'cake.jpg',     count:'11 varieties', color:'#fff0e6' },
  { id:'cupcakes', label:'Cupcakes',  emoji:'🧁', img:'cupcake.jpg',  count:'9 varieties',  color:'#fff0f5' },
  { id:'icecream', label:'Ice Cream', emoji:'🍦', img:'icecream.jpg', count:'8 flavours',   color:'#edf5ff' },
  { id:'desserts', label:'Desserts',  emoji:'🍮', img:'desserts.jpeg',count:'14 varieties', color:'#f5f0ff' },
  { id:'sweets',   label:'Sweets',    emoji:'🍬', img:'sweets.jpg',   count:'Assorted',     color:'#fffff0' },
];

const TESTIMONIALS = [
  { name:'Priya Rajan', loc:'Salem', text:'The black forest cake was absolutely divine — layers of perfection. My family couldn\'t stop talking about it!', stars:5 },
  { name:'Arjun Mehta', loc:'Erode', text:'Ordered cupcakes for my daughter\'s birthday. The customized design was stunning and they tasted heavenly.', stars:5 },
  { name:'Sita Krishnan', loc:'Salem', text:'Pâtisserie Dorée catered our wedding dessert table. Every single item was a work of art. Highly recommended!', stars:5 },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getAll().then(res => {
      const all = res.data || [];
      const picked = [];
      const map = {};
      all.forEach(p => { if (!map[p.category]) map[p.category]=[]; map[p.category].push(p); });
      Object.values(map).forEach(arr => picked.push(...arr.slice(0,2)));
      setFeatured(picked.slice(0,8));
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight:'100vh', position:'relative', overflow:'hidden',
        display:'flex', alignItems:'center',
        background:'linear-gradient(160deg,#1a0a00 0%,#3b1f0e 50%,#5c2e14 100%)',
      }}>
        {/* Background image overlay */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:"url('/images/background1.jpg')",
          backgroundSize:'cover', backgroundPosition:'center',
          opacity:0.18,
        }}/>
        {/* Radial glow */}
        <div style={{ position:'absolute', top:'20%', right:'10%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(196,119,58,0.25) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'10%', left:'5%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(228,168,75,0.15) 0%,transparent 70%)', pointerEvents:'none' }}/>

        <div className="container" style={{ position:'relative', zIndex:2, paddingTop:100, paddingBottom:80 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            {/* Left text */}
            <div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(196,119,58,0.2)', backdropFilter:'blur(10px)',
                border:'1px solid rgba(196,119,58,0.35)', borderRadius:999,
                padding:'7px 18px', color:'var(--gold)', fontSize:'0.8rem',
                fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase',
                marginBottom:28, animation:'fadeInUp 0.5s ease both',
              }}>
                ✦ Salem's Finest Pastry Studio ✦
              </div>

              <h1 style={{
                fontFamily:'Cormorant Garamond, serif',
                fontSize:'clamp(3rem,5.5vw,5rem)', color:'var(--cream)',
                lineHeight:1.05, marginBottom:24, fontWeight:700,
                animation:'fadeInUp 0.5s 0.1s ease both',
              }}>
                Where Every<br />
                Pastry is a<br />
                <span style={{ background:'linear-gradient(135deg,var(--caramel),var(--gold))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Golden Dream
                </span>
              </h1>

              <p style={{
                color:'rgba(253,248,242,0.72)', fontSize:'1.05rem', lineHeight:1.75,
                maxWidth:440, marginBottom:40, fontWeight:300,
                animation:'fadeInUp 0.5s 0.2s ease both',
              }}>
                Handcrafted pastries, cakes & desserts — made from scratch every morning with the finest ingredients. Delivered fresh to your door in Salem.
              </p>

              <div style={{ display:'flex', gap:14, flexWrap:'wrap', animation:'fadeInUp 0.5s 0.3s ease both' }}>
                <Link to="/shop" className="btn-gold" style={{ fontSize:'1rem', padding:'15px 36px' }}>
                  Order Now <ArrowRight size={18} />
                </Link>
                <Link to="/menu" className="btn-ghost" style={{ fontSize:'1rem', padding:'14px 36px' }}>
                  View Menu
                </Link>
              </div>

              {/* Trust indicators */}
              <div style={{ display:'flex', gap:24, marginTop:44, flexWrap:'wrap', animation:'fadeInUp 0.5s 0.4s ease both' }}>
                {[['500+','Happy Customers'],['50+','Menu Items'],['10+','Years Baking']].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1.8rem', fontWeight:700, color:'var(--gold)', lineHeight:1 }}>{n}</div>
                    <div style={{ fontSize:'0.78rem', color:'rgba(253,248,242,0.5)', marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right floating cards */}
            <div style={{ position:'relative', height:460, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {/* Main cake image */}
              <div style={{
                width:280, height:320, borderRadius:24, overflow:'hidden',
                boxShadow:'0 30px 80px rgba(0,0,0,0.5)',
                border:'2px solid rgba(196,119,58,0.3)',
                animation:'float 4s ease-in-out infinite',
              }}>
                <img src="/images/chocolate.jpg" alt="Chocolate Cake" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e => { e.target.style.display='none'; e.target.parentElement.style.background='#3b1f0e'; e.target.parentElement.innerHTML='<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:80px">🎂</div>'; }}/>
              </div>

              {/* Floating mini card — top right */}
              <div className="glass-card" style={{
                position:'absolute', top:30, right:0,
                padding:'12px 16px', minWidth:160,
                animation:'float 4s 1.5s ease-in-out infinite',
              }}>
                <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.6)', marginBottom:4 }}>Today's Special</div>
                <div style={{ fontFamily:'Cormorant Garamond, serif', color:'white', fontWeight:600, fontSize:'0.95rem' }}>Red Velvet Cake</div>
                <div style={{ color:'var(--gold)', fontSize:'0.85rem', fontWeight:600, marginTop:2 }}>₹1,050 / kg</div>
              </div>

              {/* Floating mini card — bottom left */}
              <div className="glass-card" style={{
                position:'absolute', bottom:40, left:0,
                padding:'12px 16px', minWidth:150,
                animation:'float 4s 0.8s ease-in-out infinite',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="var(--gold)" color="var(--gold)"/>)}
                </div>
                <div style={{ color:'white', fontSize:'0.8rem' }}>4.9 / 5 rating</div>
                <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.5)', marginTop:1 }}>from 500+ reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, color:'rgba(255,255,255,0.4)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
          Scroll to explore
          <div style={{ width:1, height:40, background:'linear-gradient(to bottom,rgba(196,119,58,0.6),transparent)', animation:'pulse 2s ease infinite' }}/>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ background:'linear-gradient(90deg,var(--caramel),var(--gold),var(--caramel))', padding:'14px 0', overflow:'hidden', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-block', animation:'marquee 20s linear infinite' }}>
          {['🎂 Fresh Cakes', '🧁 Artisan Cupcakes', '🍦 Handmade Ice Cream', '🍮 Classic Desserts', '🍬 Traditional Sweets', '🚚 Same-Day Delivery', '⭐ 4.9 Star Rated', '🥐 Baked Fresh Daily'].concat(['🎂 Fresh Cakes', '🧁 Artisan Cupcakes', '🍦 Handmade Ice Cream', '🍮 Classic Desserts', '🍬 Traditional Sweets', '🚚 Same-Day Delivery', '⭐ 4.9 Star Rated', '🥐 Baked Fresh Daily']).map((t,i) => (
            <span key={i} style={{ margin:'0 32px', fontSize:'0.82rem', fontWeight:600, color:'white', letterSpacing:'0.06em', textTransform:'uppercase' }}>{t}</span>
          ))}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── CATEGORIES ── */}
      <section style={{ padding:'90px 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Our Specialties</div>
            <h2>Five Worlds of Sweetness</h2>
            <div className="divider"/>
            <p>Every category crafted with a different kind of love, a different kind of magic</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:18 }}>
            {CATS.map(cat => (
              <Link to={`/shop?category=${cat.id}`} key={cat.id} style={{
                textDecoration:'none', borderRadius:20, overflow:'hidden',
                boxShadow:'0 4px 16px rgba(59,31,14,0.08)',
                border:'1px solid rgba(59,31,14,0.07)',
                transition:'all 0.3s', background:'white', display:'block',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 20px 48px rgba(59,31,14,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(59,31,14,0.08)'; }}>
                <div style={{ height:140, background:cat.color, position:'relative', overflow:'hidden' }}>
                  <img src={`/images/${cat.img}`} alt={cat.label} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.55),transparent)' }}/>
                  <div style={{ position:'absolute', bottom:10, left:12, color:'white' }}>
                    <div style={{ fontSize:'1.4rem' }}>{cat.emoji}</div>
                  </div>
                </div>
                <div style={{ padding:'13px 14px 16px' }}>
                  <div style={{ fontFamily:'Cormorant Garamond, serif', fontWeight:600, fontSize:'1.05rem', color:'var(--chocolate)', marginBottom:3 }}>{cat.label}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{cat.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.cats-grid{grid-template-columns:repeat(3,1fr)!important;}}`}</style>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding:'0 0 90px', background:'linear-gradient(180deg,var(--cream) 0%,var(--biscuit) 100%)' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">Chef's Selection</div>
            <h2>Featured Treats</h2>
            <div className="divider"/>
            <p>Our most beloved creations — hand-picked by our pastry chefs</p>
          </div>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
          ) : (
            <>
              <div className="product-grid">{featured.map(p => <ProductCard key={p.id} product={p}/>)}</div>
              <div style={{ textAlign:'center', marginTop:48 }}>
                <Link to="/shop" className="btn-primary" style={{ fontSize:'1rem', padding:'14px 36px' }}>
                  Browse All Products <ArrowRight size={18}/>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ padding:'90px 0', background:'white' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow">The Dorée Difference</div>
            <h2>Why We're Salem's Favourite</h2>
            <div className="divider"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:32 }}>
            {[
              { Icon:Award, title:'Premium Ingredients', desc:'Imported Belgian chocolate, fresh cream sourced daily, and hand-picked seasonal fruits for every creation.', color:'#fff0e6', iconColor:'#c4773a' },
              { Icon:ChefHat, title:'Master Bakers', desc:'Our pastry chefs trained in classical techniques bring decades of expertise to every single batch.', color:'#fff0f5', iconColor:'#c43a6b' },
              { Icon:Clock, title:'Baked Every Morning', desc:'No frozen shortcuts. Every item is freshly baked each morning and available until sold out.', color:'#edf5ff', iconColor:'#3a6bc4' },
              { Icon:Truck, title:'Swift Delivery', desc:'Same-day delivery within Salem. Real-time order tracking so you know exactly when it arrives.', color:'#f0fff4', iconColor:'#3ac46b' },
            ].map(({ Icon, title, desc, color, iconColor }) => (
              <div key={title} style={{ textAlign:'center', padding:'36px 24px', borderRadius:20, background:color, border:'1px solid rgba(0,0,0,0.04)', transition:'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(59,31,14,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ width:60, height:60, background:'white', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 4px 16px rgba(0,0,0,0.08)' }}>
                  <Icon size={26} color={iconColor}/>
                </div>
                <h3 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'1.2rem', marginBottom:10, color:'var(--chocolate)' }}>{title}</h3>
                <p style={{ fontSize:'0.87rem', color:'var(--text-muted)', lineHeight:1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'90px 0', background:'linear-gradient(160deg,#1a0a00,#3b1f0e)' }}>
        <div className="container">
          <div className="section-header">
            <div className="eyebrow" style={{ background:'rgba(196,119,58,0.2)', borderColor:'rgba(196,119,58,0.35)', color:'var(--gold)' }}>Customer Love</div>
            <h2 style={{ color:'var(--cream)' }}>What Our Guests Say</h2>
            <div className="divider"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} className="glass-card" style={{ padding:'28px' }}>
                <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                  {[...Array(t.stars)].map((_,s) => <Star key={s} size={14} fill="var(--gold)" color="var(--gold)"/>)}
                </div>
                <p style={{ color:'rgba(253,248,242,0.8)', fontSize:'0.92rem', lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,var(--caramel),var(--gold))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ color:'var(--cream)', fontWeight:600, fontSize:'0.9rem' }}>{t.name}</div>
                    <div style={{ color:'rgba(253,248,242,0.45)', fontSize:'0.75rem' }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding:'80px 24px', background:'linear-gradient(135deg,var(--caramel),var(--gold))', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.1)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(2rem,4.5vw,3.2rem)', color:'white', marginBottom:14 }}>
            Planning a Special Celebration?
          </h2>
          <p style={{ color:'rgba(255,255,255,0.85)', maxWidth:500, margin:'0 auto 32px', fontSize:'1.05rem' }}>
            Let Pâtisserie Dorée make your event unforgettable with bespoke pastry catering.
          </p>
          <Link to="/events" className="btn-primary" style={{ background:'white', color:'var(--caramel)', fontSize:'1rem', padding:'15px 38px', boxShadow:'0 8px 28px rgba(0,0,0,0.2)' }}>
            Book Event Catering <ArrowRight size={18}/>
          </Link>
        </div>
      </section>
    </div>
  );
}
