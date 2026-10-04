import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(160deg, #1a0a00 0%, #3b1f0e 60%, #2a1208 100%)', color: 'rgba(253,248,242,0.8)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(196,119,58,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(228,168,75,0.06)', pointerEvents: 'none' }} />

      <div className="container" style={{ padding: '64px 28px 40px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              {/* Logo mark */}
              <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,var(--caramel),var(--gold))', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 16px rgba(196,119,58,0.35)', flexShrink: 0 }}>🥐</div>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--cream)', lineHeight: 1 }}>Pâtisserie Dorée</div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(228,168,75,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Artisan Pastry Studio</div>
              </div>
            </div>
            <p style={{ fontSize: '0.87rem', lineHeight: 1.75, marginBottom: 24, color: 'rgba(253,248,242,0.65)', maxWidth: 240 }}>
              Crafting golden moments one pastry at a time. Every bite tells a story of passion, tradition, and pure indulgence.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { Icon: Instagram, color: '#e1306c' },
                { Icon: Facebook, color: '#1877f2' },
                { Icon: Twitter, color: '#1da1f2' },
                { Icon: Youtube, color: '#ff0000' },
              ].map(({ Icon, color }, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <Icon size={15} color="white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--cream)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', marginBottom: 18, fontWeight: 600 }}>Explore</h4>
            {[['Home', '/'], ['Our Menu', '/menu'], ['Shop Online', '/shop'], ['Events & Catering', '/events'], ['Track Your Order', '/track'], ['Contact Us', '/contact']].map(([label, to]) => (
              <Link key={to} to={to} style={{ display: 'block', padding: '5px 0', fontSize: '0.86rem', color: 'rgba(253,248,242,0.6)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.color = 'var(--gold)'; e.target.style.paddingLeft = '6px'; }}
                onMouseLeave={e => { e.target.style.color = 'rgba(253,248,242,0.6)'; e.target.style.paddingLeft = '0'; }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: 'var(--cream)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', marginBottom: 18, fontWeight: 600 }}>Our Crafts</h4>
            {[['🎂 Cakes', '/shop?category=cakes'], ['🧁 Cupcakes', '/shop?category=cupcakes'], ['🍦 Ice Cream', '/shop?category=icecream'], ['🍮 Desserts', '/shop?category=desserts'], ['🍬 Sweets', '/shop?category=sweets']].map(([label, to]) => (
              <Link key={to} to={to} style={{ display: 'block', padding: '5px 0', fontSize: '0.86rem', color: 'rgba(253,248,242,0.6)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.color = 'var(--gold)'; e.target.style.paddingLeft = '6px'; }}
                onMouseLeave={e => { e.target.style.color = 'rgba(253,248,242,0.6)'; e.target.style.paddingLeft = '0'; }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--cream)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', marginBottom: 18, fontWeight: 600 }}>Visit Us</h4>
            {[
              [MapPin, '57 Raja Street, Salem, Tamil Nadu 636010'],
              [Phone, '+91 8870160044'],
              [Mail, 'hello@patisseriedoree.in'],
              [Clock, 'Mon–Sun: 10 AM – 10 PM'],
            ].map(([Icon, text], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                <Icon size={13} color="var(--gold)" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: '0.83rem', lineHeight: 1.55, color: 'rgba(253,248,242,0.6)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(253,248,242,0.4)' }}>
            © {new Date().getFullYear()} Pâtisserie Dorée. Crafted with 🥐 in Salem, India.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(t => (
              <a key={t} href="#" style={{ fontSize: '0.78rem', color: 'rgba(253,248,242,0.35)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = 'rgba(253,248,242,0.35)'}>{t}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){footer .container>div:first-child{grid-template-columns:1fr 1fr!important;}}`}</style>
    </footer>
  );
}
