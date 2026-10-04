import React, { useState } from 'react';
import { ShoppingCart, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CAT_ACCENT = {
  cakes:    { bg: '#fff0e6', badge: '#f5c4a0', text: '#8b3a1a', emoji: '🎂' },
  cupcakes: { bg: '#fff0f5', badge: '#f5b8cc', text: '#8b1a3a', emoji: '🧁' },
  icecream: { bg: '#edf5ff', badge: '#b8d4f5', text: '#1a3a8b', emoji: '🍦' },
  desserts: { bg: '#f5f0ff', badge: '#d4b8f5', text: '#3a1a8b', emoji: '🍮' },
  sweets:   { bg: '#fffff0', badge: '#f5ebb8', text: '#8b6a1a', emoji: '🍬' },
};

export default function ProductCard({ product }) {
  const { addItem, cart } = useCart();
  const { addToast } = useToast();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const accent = CAT_ACCENT[product.category] || CAT_ACCENT.cakes;
  const inCart = cart.items.find(i => i.id === product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: parseFloat(product.price), image_url: product.image_url, category: product.category, weight: product.weight });
    addToast(`${product.name} added to cart! ${accent.emoji}`, 'success');
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div style={{
      background: 'white', borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(59,31,14,0.07)',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      border: '1px solid rgba(59,31,14,0.06)',
      display: 'flex', flexDirection: 'column',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(59,31,14,0.16)'; e.currentTarget.style.borderColor = 'rgba(196,119,58,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,31,14,0.07)'; e.currentTarget.style.borderColor = 'rgba(59,31,14,0.06)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 195, background: accent.bg, overflow: 'hidden' }}>
        {!imgError ? (
          <img src={`/images/${product.image_url}`} alt={product.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
            {accent.emoji}
          </div>
        )}
        {/* Gradient overlay bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(255,255,255,0.7), transparent)' }} />

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '3px 10px',
          fontSize: '0.7rem', fontWeight: 700, color: accent.text,
          textTransform: 'capitalize', letterSpacing: '0.04em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {accent.emoji} {product.category}
        </div>

        {/* Cart count badge if in cart */}
        {inCart && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'linear-gradient(135deg,var(--caramel),var(--gold))',
            color: 'white', borderRadius: 20, padding: '3px 9px',
            fontSize: '0.7rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(196,119,58,0.4)',
          }}>
            ×{inCart.quantity} in cart
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--chocolate)', lineHeight: 1.3, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.08rem' }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <Star size={11} fill="#e4a84b" color="#e4a84b" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>4.9</span>
          </div>
        </div>

        {product.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div>
            <span style={{ fontSize: '1.22rem', fontWeight: 700, color: 'var(--chocolate)', fontFamily: 'Cormorant Garamond, serif' }}>
              ₹{parseFloat(product.price).toFixed(0)}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: 3 }}>/{product.weight}</span>
          </div>

          <button onClick={handleAdd} style={{
            width: 38, height: 38, borderRadius: 12, border: 'none',
            background: added
              ? 'linear-gradient(135deg,#4ade80,#22c55e)'
              : 'linear-gradient(135deg,var(--chocolate),var(--mocha))',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s', transform: added ? 'scale(1.15)' : 'scale(1)',
            boxShadow: added ? '0 4px 14px rgba(74,222,128,0.4)' : '0 4px 12px rgba(59,31,14,0.3)',
          }}>
            {added ? <Check size={16} strokeWidth={3} /> : <ShoppingCart size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
