import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, CheckCircle, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ordersApi, paymentsApi } from '../hooks/useApi';

const STEPS = ['Cart', 'Details', 'Payment', 'Confirmation'];

export default function Cart() {
  const { cart, updateQty, removeItem, clearCart, total, count } = useCart();
  const { addToast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '', delivery_address: '', notes: ''
  });

  const deliveryFee = 50;
  const grandTotal = total + deliveryFee;

  const handleFormChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.create({
        ...form,
        items: cart.items.map(i => ({
          product_id: i.id,
          product_name: i.name,
          product_category: i.category,
          quantity: i.quantity,
          unit_price: i.price,
        })),
      });
      setOrderData(res.data);
      setStep(2);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (method) => {
    setLoading(true);
    try {
      const init = await paymentsApi.initiate({ order_id: orderData.order_id, amount: grandTotal });
      const confirm = await paymentsApi.confirm({ transaction_id: init.data.transaction_id, payment_method: method });
      setPaymentData({ ...confirm.data, order_number: orderData.order_number });
      if (confirm.data.status === 'success') {
        clearCart();
        setStep(3);
        addToast('Payment successful! Order confirmed 🎉', 'success');
      } else {
        addToast('Payment failed. Please try again.', 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(paymentData?.order_number || orderData?.order_number);
    addToast('Order number copied!', 'success');
  };

  if (count === 0 && step === 0) {
    return (
      <div style={{ paddingTop: 68, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: 28 }}>Add some delicious pastries to get started!</p>
          <Link to="/shop" className="btn-primary">Browse Shop <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: 'var(--chocolate)', color: 'white', padding: '40px 24px 28px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', marginBottom: 20 }}>Checkout</h1>
        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i <= step ? 'var(--caramel)' : 'rgba(255,255,255,0.2)',
                  border: i === step ? '2px solid white' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 600, color: 'white',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '0.75rem', color: i <= step ? 'white' : 'rgba(255,255,255,0.5)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 60, height: 2, background: i < step ? 'var(--caramel)' : 'rgba(255,255,255,0.2)', margin: '0 4px', marginBottom: 20 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px', maxWidth: 900 }}>

        {/* STEP 0: Cart */}
        {step === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 20 }}>
                Your Items ({count})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cart.items.map(item => (
                  <div key={item.id} style={{ background: 'white', borderRadius: 12, padding: 16, display: 'flex', gap: 16, alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ width: 70, height: 70, borderRadius: 10, overflow: 'hidden', background: 'var(--biscuit)', flexShrink: 0 }}>
                      <img src={`/images/${item.image_url}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--chocolate)', marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>{item.category} · {item.weight}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--chocolate)', minWidth: 70, textAlign: 'right' }}>
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ color: '#e05252', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-sm)', minWidth: 260 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 20 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                  <span>Subtotal</span><span>₹{total.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                  <span>Delivery</span><span>₹{deliveryFee}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--chocolate)' }}>
                  <span>Total</span><span>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep(1)}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Customer Details */}
        {step === 1 && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 24 }}>Delivery Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'customer_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your full name' },
                { name: 'customer_email', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com' },
                { name: 'customer_phone', label: 'Phone Number', type: 'tel', required: false, placeholder: '+91 98765 43210' },
              ].map(f => (
                <div key={f.name} className="input-group">
                  <label>{f.label}{f.required && ' *'}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={handleFormChange} placeholder={f.placeholder} required={f.required} />
                </div>
              ))}
              <div className="input-group">
                <label>Delivery Address *</label>
                <textarea name="delivery_address" value={form.delivery_address} onChange={handleFormChange} placeholder="Full delivery address including street, area, city..." rows={3} required style={{ resize: 'vertical' }} />
              </div>
              <div className="input-group">
                <label>Special Instructions (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleFormChange} placeholder="Allergies, delivery preferences, etc." rows={2} style={{ resize: 'vertical' }} />
              </div>

              {/* Summary box */}
              <div style={{ background: 'var(--biscuit)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{count} items · Delivery ₹{deliveryFee}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--chocolate)' }}>Total: ₹{grandTotal.toFixed(0)}</div>
                </div>
                <ShoppingBag size={28} color="var(--caramel)" />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={!form.customer_name || !form.customer_email || !form.delivery_address || loading}
                  onClick={placeOrder}
                >
                  {loading ? 'Processing...' : 'Continue to Payment'} {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Mock Payment */}
        {step === 2 && orderData && (
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', marginBottom: 8 }}>Payment</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Order #{orderData.order_number} · Amount: ₹{grandTotal.toFixed(0)}</p>

            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 16px', background: '#fff8e1', borderRadius: 10, border: '1px solid #f9d850' }}>
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#7a6000' }}>Demo Mode — Mock Payment</div>
                  <div style={{ fontSize: '0.8rem', color: '#9a8000' }}>No real money is charged. This simulates a payment.</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { method: 'mock_card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                  { method: 'mock_upi', label: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                  { method: 'mock_netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
                  { method: 'mock_cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                ].map(opt => (
                  <button
                    key={opt.method}
                    onClick={() => processPayment(opt.method)}
                    disabled={loading}
                    style={{
                      width: '100%', padding: '14px 18px',
                      background: loading ? 'var(--biscuit)' : 'white',
                      border: '1.5px solid var(--border)', borderRadius: 10, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14,
                      transition: 'all 0.2s', textAlign: 'left',
                    }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--caramel)'; e.currentTarget.style.background = 'var(--biscuit)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = loading ? 'var(--biscuit)' : 'white'; }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{opt.desc}</div>
                    </div>
                    {loading && <div className="spinner" style={{ width: 20, height: 20, marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-secondary" onClick={() => setStep(1)} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>← Back</button>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {step === 3 && paymentData && (
          <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: '#d4edda', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={36} color="#256032" />
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--chocolate)', fontSize: '2rem', marginBottom: 8 }}>
              Order Placed! 🎉
            </h2>
            <p style={{ color: 'var(--text-light)', marginBottom: 28 }}>
              Thank you! Your pastries are being prepared with love.
            </p>
            <div style={{ background: 'var(--biscuit)', borderRadius: 16, padding: 24, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--chocolate)', fontWeight: 600 }}>
                  Order # {paymentData.order_number}
                </span>
                <button onClick={copyOrderNumber} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--caramel)' }}>
                  <Copy size={16} />
                </button>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)' }}>
                Save this number to track your order status.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to="/track" className="btn-primary">Track My Order</Link>
              <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
