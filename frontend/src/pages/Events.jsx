import React, { useState } from 'react';
import { Calendar, Phone, MapPin, ChefHat, CheckCircle, ArrowRight } from 'lucide-react';
import { eventsApi } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';

const EVENT_ITEMS = [
  { id: 'cake_choco', category: 'Cakes', name: 'Chocolate Cake', price: 950 },
  { id: 'cake_vanilla', category: 'Cakes', name: 'Vanilla Cake', price: 850 },
  { id: 'cake_redvelvet', category: 'Cakes', name: 'Red Velvet Cake', price: 1050 },
  { id: 'cake_blackforest', category: 'Cakes', name: 'Black Forest Cake', price: 1000 },
  { id: 'cake_rainbow', category: 'Cakes', name: 'Rainbow Cake', price: 1100 },
  { id: 'cake_oreo', category: 'Cakes', name: 'Oreo Cake', price: 1050 },
  { id: 'cupcake_choco', category: 'Cupcakes', name: 'Chocolate Cupcakes (dozen)', price: 1440 },
  { id: 'cupcake_vanilla', category: 'Cupcakes', name: 'Vanilla Cupcakes (dozen)', price: 1320 },
  { id: 'cupcake_custom', category: 'Cupcakes', name: 'Customized Cupcakes (dozen)', price: 2160 },
  { id: 'dessert_cheesecake', category: 'Desserts', name: 'Cheesecake', price: 350 },
  { id: 'dessert_brownies', category: 'Desserts', name: 'Brownies Box (12pcs)', price: 720 },
  { id: 'dessert_tiramisu', category: 'Desserts', name: 'Tiramisu', price: 320 },
  { id: 'ice_smores', category: 'Ice Cream', name: "S'Mores Galore (per scoop)", price: 180 },
  { id: 'ice_hazelnut', category: 'Ice Cream', name: 'Hazelnut Gelato (per scoop)', price: 200 },
  { id: 'ice_mango', category: 'Ice Cream', name: 'Mango Sorbet (per scoop)', price: 160 },
];

const CATEGORIES_LIST = [...new Set(EVENT_ITEMS.map(i => i.category))];

export default function Events() {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    event_date: '', event_description: '', delivery_address: '',
  });

  const handleFormChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const toggleItem = (id) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { ...EVENT_ITEMS.find(i => i.id === id), quantity: 1 };
      return next;
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setSelectedItems(prev => ({ ...prev, [id]: { ...prev[id], quantity: qty } }));
  };

  const total = Object.values(selectedItems).reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async () => {
    if (!form.customer_name || !form.customer_phone || !form.delivery_address) {
      addToast('Please fill all required fields', 'error'); return;
    }
    if (Object.keys(selectedItems).length === 0) {
      addToast('Please select at least one item', 'error'); return;
    }
    setLoading(true);
    try {
      const res = await eventsApi.book({
        ...form,
        selected_items: Object.values(selectedItems),
        total_amount: total,
      });
      setBookingNumber(res.data.booking_number);
      setSubmitted(true);
      addToast('Event booking submitted! 🎉', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ paddingTop: 68, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
          <div style={{ width: 72, height: 72, background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={36} color="#059669" />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', fontSize: '2rem', marginBottom: 12 }}>
            Event Booked! 🎊
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>
            We've received your event booking. Our team will contact you shortly to confirm details.
          </p>
          <div style={{ background: 'var(--biscuit)', borderRadius: 12, padding: 18, marginBottom: 28 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 4 }}>Booking Reference</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--chocolate)', fontWeight: 700 }}>{bookingNumber}</div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ customer_name:'',customer_email:'',customer_phone:'',event_date:'',event_description:'',delivery_address:'' }); setSelectedItems({}); }}>
              Book Another Event
            </button>
            <a href="/" className="btn-secondary">Back to Home</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: 'var(--chocolate)', color: 'white', padding: '56px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,131,74,0.25)', borderRadius: 50, padding: '6px 16px', marginBottom: 16, color: 'var(--blush)', fontSize: '0.85rem' }}>
          <ChefHat size={14} /> Event Catering
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 12 }}>
          Book Pastries for Your Event
        </h1>
        <p style={{ color: 'rgba(255,253,249,0.75)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}>
          Weddings, birthdays, corporate events — we bring the sweetness.
        </p>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          {/* LEFT: Form + Items */}
          <div>
            {/* Contact Details */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 20 }}>Your Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { name: 'customer_name', label: 'Full Name *', type: 'text', placeholder: 'Your name', full: false },
                  { name: 'customer_phone', label: 'Phone Number *', type: 'tel', placeholder: '+91 98765 43210', full: false },
                  { name: 'customer_email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', full: false },
                  { name: 'event_date', label: 'Event Date', type: 'date', placeholder: '', full: false },
                ].map(f => (
                  <div key={f.name} className="input-group">
                    <label>{f.label}</label>
                    <input name={f.name} type={f.type} value={form[f.name]} onChange={handleFormChange} placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
              <div className="input-group" style={{ marginTop: 16 }}>
                <label>Delivery Address *</label>
                <textarea name="delivery_address" value={form.delivery_address} onChange={handleFormChange} rows={2} placeholder="Full event/delivery address..." style={{ resize: 'vertical' }} />
              </div>
              <div className="input-group" style={{ marginTop: 16 }}>
                <label>Event Description</label>
                <textarea name="event_description" value={form.event_description} onChange={handleFormChange} rows={2} placeholder="Tell us about your event (wedding, birthday, corporate...)" style={{ resize: 'vertical' }} />
              </div>
            </div>

            {/* Item Selection */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 20 }}>Select Items</h3>
              {CATEGORIES_LIST.map(cat => (
                <div key={cat} style={{ marginBottom: 24 }}>
                  <h4 style={{ color: 'var(--caramel-dark)', fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', marginBottom: 12, padding: '6px 12px', background: 'var(--biscuit)', borderRadius: 8, display: 'inline-block' }}>
                    {cat}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {EVENT_ITEMS.filter(i => i.category === cat).map(item => {
                      const selected = !!selectedItems[item.id];
                      return (
                        <div key={item.id} style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                          border: `1.5px solid ${selected ? 'var(--caramel)' : 'var(--border)'}`,
                          borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                          background: selected ? 'rgba(200,131,74,0.06)' : 'white',
                        }} onClick={() => toggleItem(item.id)}>
                          <div style={{
                            width: 20, height: 20, borderRadius: 4, border: `2px solid ${selected ? 'var(--caramel)' : 'var(--border)'}`,
                            background: selected ? 'var(--caramel)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            {selected && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
                          </div>
                          <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{item.name}</span>
                          <span style={{ fontWeight: 600, color: 'var(--chocolate)', fontSize: '0.9rem' }}>₹{item.price}</span>
                          {selected && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => updateQty(item.id, selectedItems[item.id].quantity - 1)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                              <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center', fontSize: '0.9rem' }}>{selectedItems[item.id].quantity}</span>
                              <button onClick={() => updateQty(item.id, selectedItems[item.id].quantity + 1)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 20 }}>Order Summary</h3>
              {Object.keys(selectedItems).length === 0 ? (
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No items selected yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {Object.values(selectedItems).map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--text-mid)' }}>{item.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 600, color: 'var(--chocolate)' }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--chocolate)', marginBottom: 20 }}>
                <span>Estimated Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: 20, lineHeight: 1.5 }}>
                * Final pricing confirmed after team review. Delivery charges extra.
              </p>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : <>Submit Booking <ArrowRight size={16} /></>}
              </button>
            </div>

            {/* Info cards */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                [Phone, '+91 8870160044', 'Call us to discuss your event'],
                [Calendar, 'Book 3 days ahead', 'For large orders, book in advance'],
                [MapPin, 'Salem, India', 'Delivery within Salem city'],
              ].map(([Icon, title, sub]) => (
                <div key={title} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                  <Icon size={18} color="var(--caramel)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive fix */}
      <style>{`@media(max-width:900px){.event-grid{grid-template-columns:1fr!important;}.sticky-summary{position:relative!important;top:0!important;}}`}</style>
    </div>
  );
}
