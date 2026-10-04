import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, ChefHat, Truck, CheckCircle, XCircle, Clock, RefreshCw, MapPin } from 'lucide-react';
import { ordersApi } from '../hooks/useApi';

const STATUS_STEPS = ['pending','confirmed','preparing','out_for_delivery','delivered'];
const STATUS_CFG = {
  pending:          { icon:Clock,        color:'#f59e0b', bg:'#fef3c7', label:'Order Placed',     desc:'Awaiting confirmation from our team', emoji:'📋' },
  confirmed:        { icon:CheckCircle,  color:'#10b981', bg:'#d1fae5', label:'Confirmed',         desc:'Your order is confirmed! Our bakers are getting ready', emoji:'✅' },
  preparing:        { icon:ChefHat,      color:'#8b5cf6', bg:'#ede9fe', label:'Preparing',         desc:'Our chef is lovingly crafting your pastries 🍰', emoji:'👨‍🍳' },
  out_for_delivery: { icon:Truck,        color:'#3b82f6', bg:'#dbeafe', label:'Out for Delivery',  desc:'Your order is on its way to you!', emoji:'🚚' },
  delivered:        { icon:CheckCircle,  color:'#059669', bg:'#a7f3d0', label:'Delivered',         desc:'Enjoy your Pâtisserie Dorée treats! 🎉', emoji:'🎉' },
  cancelled:        { icon:XCircle,      color:'#ef4444', bg:'#fee2e2', label:'Cancelled',         desc:'This order has been cancelled.', emoji:'❌' },
};

export default function TrackOrder() {
  const [input,setInput]=useState('');
  const [orderNum,setOrderNum]=useState('');
  const [order,setOrder]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [lastUpdated,setLastUpdated]=useState(null);
  const intervalRef=useRef(null);

  const fetchOrder = async (num, silent=false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await ordersApi.track(num);
      setOrder(res.data);
      setLastUpdated(new Date());
    } catch {
      if (!silent) setError('Order not found. Please check your order number and try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSearch = () => {
    const n = input.trim().toUpperCase();
    if (!n) return;
    setOrderNum(n); fetchOrder(n);
  };

  useEffect(() => {
    if (!orderNum||!order) return;
    if (['delivered','cancelled'].includes(order?.status)) return;
    intervalRef.current = setInterval(()=>fetchOrder(orderNum,true), 8000);
    return () => clearInterval(intervalRef.current);
  }, [orderNum,order?.status]);

  const fmt = ts => ts ? new Date(ts).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
  const stepIdx = STATUS_STEPS.indexOf(order?.status);

  return (
    <div style={{ paddingTop:72 }}>
      <div style={{ background:'linear-gradient(135deg,#1a0a00,#3b1f0e)', padding:'52px 28px 40px', textAlign:'center' }}>
        <div className="eyebrow" style={{ background:'rgba(196,119,58,0.2)', borderColor:'rgba(196,119,58,0.35)', color:'var(--gold)', marginBottom:16 }}>Real-Time Updates</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2rem,5vw,3rem)', color:'var(--cream)', marginBottom:10 }}>Track Your Order</h1>
        <p style={{ color:'rgba(253,248,242,0.65)' }}>Live status updates every 8 seconds — know exactly where your pastries are</p>
      </div>

      <div className="container" style={{ padding:'40px 28px', maxWidth:700 }}>
        {/* Search box */}
        <div style={{ background:'white', borderRadius:20, padding:28, boxShadow:'0 8px 32px rgba(59,31,14,0.1)', marginBottom:32, border:'1px solid var(--border)' }}>
          <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', marginBottom:16, fontSize:'1.2rem' }}>Enter Your Order Number</h3>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ position:'relative', flex:1 }}>
              <Package size={17} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}/>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()}
                placeholder="e.g. FF-123456-7890"
                style={{ width:'100%', padding:'13px 14px 13px 44px', border:'1.5px solid var(--border)', borderRadius:12, fontFamily:'Outfit,sans-serif', fontSize:'0.95rem', outline:'none', background:'var(--cream)' }}
                onFocus={e=>{e.target.style.borderColor='var(--caramel)';e.target.style.boxShadow='0 0 0 3px rgba(196,119,58,0.12)';}}
                onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.boxShadow='none';}}
              />
            </div>
            <button className="btn-primary" onClick={handleSearch} disabled={loading} style={{ whiteSpace:'nowrap', borderRadius:12 }}>
              {loading ? <div className="spinner" style={{ width:20,height:20 }}/> : <><Search size={15}/> Track</>}
            </button>
          </div>
          {error && <div style={{ marginTop:12, padding:'12px 16px', background:'#fee2e2', borderRadius:10, color:'#9b1c1c', fontSize:'0.87rem', border:'1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
        </div>

        {/* Order display */}
        {order && (
          <div style={{ animation:'fadeInUp 0.4s ease' }}>
            {/* Status banner */}
            {(() => {
              const cfg = STATUS_CFG[order.status]||STATUS_CFG.pending;
              const Icon = cfg.icon;
              return (
                <div style={{ background:cfg.bg, border:`1.5px solid ${cfg.color}30`, borderRadius:18, padding:'22px 26px', marginBottom:24, display:'flex', alignItems:'center', gap:18 }}>
                  <div style={{ fontSize:'2.2rem', flexShrink:0 }}>{cfg.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:cfg.color, fontSize:'1.1rem', marginBottom:3 }}>{cfg.label}</div>
                    <div style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>{cfg.desc}</div>
                  </div>
                  {lastUpdated && (
                    <div style={{ fontSize:'0.73rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:4, flexShrink:0, background:'rgba(0,0,0,0.05)', padding:'5px 10px', borderRadius:999 }}>
                      <RefreshCw size={11}/> {lastUpdated.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Order info grid */}
            <div style={{ background:'white', borderRadius:18, padding:24, boxShadow:'0 4px 16px rgba(59,31,14,0.07)', marginBottom:20, border:'1px solid var(--border)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                {[
                  ['Order Number', order.order_number],
                  ['Total Amount', `₹${parseFloat(order.total).toFixed(0)}`],
                  ['Placed On', fmt(order.created_at)],
                  ['Payment', order.payment_status==='paid'?'✅ Paid':'⏳ Pending'],
                  ['Customer', order.customer_name],
                  ['Phone', order.customer_phone||'—'],
                ].map(([l,v])=>(
                  <div key={l}>
                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{l}</div>
                    <div style={{ fontWeight:600, color:'var(--text-primary)', fontSize:'0.92rem' }}>{v}</div>
                  </div>
                ))}
                <div style={{ gridColumn:'1/-1' }}>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>Delivery Address</div>
                  <div style={{ fontWeight:500, color:'var(--text-primary)', fontSize:'0.88rem', display:'flex', alignItems:'flex-start', gap:6 }}>
                    <MapPin size={14} color="var(--caramel)" style={{ marginTop:2, flexShrink:0 }}/> {order.delivery_address}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress stepper */}
            {order.status!=='cancelled' && (
              <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 4px 16px rgba(59,31,14,0.07)', marginBottom:20, border:'1px solid var(--border)' }}>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', marginBottom:28, fontSize:'1.15rem' }}>Order Progress</h3>
                {STATUS_STEPS.map((s,i) => {
                  const cfg=STATUS_CFG[s]; const Icon=cfg.icon;
                  const done=i<stepIdx; const isActive=i===stepIdx;
                  return (
                    <div key={s} style={{ display:'flex', gap:18 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                        <div style={{
                          width:44, height:44, borderRadius:'50%', flexShrink:0,
                          background: isActive ? cfg.color : done ? '#d1fae5' : 'var(--biscuit)',
                          border: isActive ? `3px solid ${cfg.color}` : done ? '3px solid #10b981' : '2px solid var(--border)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          boxShadow: isActive ? `0 0 0 5px ${cfg.color}25` : 'none',
                          transition:'all 0.4s',
                        }}>
                          <Icon size={19} color={isActive?'white':done?'#10b981':'var(--text-muted)'}/>
                        </div>
                        {i<STATUS_STEPS.length-1 && (
                          <div style={{ width:2, flex:1, minHeight:24, background: done ? 'linear-gradient(to bottom,#10b981,#10b981)' : 'var(--biscuit)', margin:'4px 0', transition:'all 0.4s' }}/>
                        )}
                      </div>
                      <div style={{ paddingTop:10, paddingBottom: i<STATUS_STEPS.length-1 ? 22 : 0 }}>
                        <div style={{ fontWeight: isActive?700:500, color: isActive?cfg.color : done?'var(--text-primary)':'var(--text-muted)', fontSize:'0.95rem', marginBottom: isActive?4:0 }}>{cfg.label}</div>
                        {isActive && <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>{cfg.desc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Timeline */}
            {order.tracking?.length > 0 && (
              <div style={{ background:'white', borderRadius:18, padding:28, boxShadow:'0 4px 16px rgba(59,31,14,0.07)', marginBottom:20, border:'1px solid var(--border)' }}>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', marginBottom:22, fontSize:'1.15rem' }}>Activity Timeline</h3>
                {[...order.tracking].reverse().map((t,i,arr)=>(
                  <div key={t.id} style={{ display:'flex', gap:14, marginBottom: i<arr.length-1?20:0, paddingBottom: i<arr.length-1?20:0, borderBottom: i<arr.length-1?'1px solid var(--border)':'none' }}>
                    <div style={{ width:9, height:9, borderRadius:'50%', background: i===0?'var(--caramel)':'var(--latte)', marginTop:5, flexShrink:0, boxShadow: i===0?'0 0 0 3px rgba(196,119,58,0.2)':'none' }}/>
                    <div>
                      <div style={{ fontWeight:600, color:'var(--text-primary)', fontSize:'0.9rem', marginBottom:2 }}>{t.message}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{fmt(t.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Items */}
            {order.items && (
              <div style={{ background:'white', borderRadius:18, padding:24, boxShadow:'0 4px 16px rgba(59,31,14,0.07)', border:'1px solid var(--border)' }}>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', marginBottom:18, fontSize:'1.15rem' }}>Items Ordered</h3>
                {(typeof order.items==='string'?JSON.parse(order.items):order.items).filter(Boolean).map((item,i,arr)=>(
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i<arr.length-1?'1px solid var(--border)':'none' }}>
                    <div>
                      <span style={{ fontWeight:500, color:'var(--text-primary)', fontSize:'0.9rem' }}>{item.product_name}</span>
                      <span style={{ color:'var(--text-muted)', fontSize:'0.82rem', marginLeft:8 }}>× {item.quantity}</span>
                    </div>
                    <span style={{ fontWeight:700, color:'var(--chocolate)', fontFamily:'Cormorant Garamond,serif', fontSize:'1rem' }}>₹{parseFloat(item.total_price).toFixed(0)}</span>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:14, borderTop:'2px solid var(--border)', marginTop:4 }}>
                  <span style={{ fontWeight:700, color:'var(--chocolate)' }}>Total</span>
                  <span style={{ fontWeight:700, color:'var(--chocolate)', fontFamily:'Cormorant Garamond,serif', fontSize:'1.1rem' }}>₹{parseFloat(order.total).toFixed(0)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {!order&&!loading&&!error && (
          <div style={{ textAlign:'center', padding:'48px 24px', color:'var(--text-muted)' }}>
            <div style={{ fontSize:60, marginBottom:18 }}>📦</div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', marginBottom:8, fontSize:'1.5rem' }}>Track your sweet delivery</h3>
            <p>Enter the order number from your confirmation to see live updates</p>
          </div>
        )}
      </div>
    </div>
  );
}
