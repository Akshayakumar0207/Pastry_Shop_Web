import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { eventsApi } from '../hooks/useApi';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { addToast } = useToast();
  const [loading,setLoading]=useState(false);
  const [sent,setSent]=useState(false);
  const [form,setForm]=useState({ name:'',email:'',phone:'',message:'' });
  const ch = e => setForm(p=>({...p,[e.target.name]:e.target.value}));

  const submit = async () => {
    if (!form.name||!form.email||!form.message) { addToast('Please fill all required fields','error'); return; }
    setLoading(true);
    try {
      await eventsApi.sendContact(form);
      setSent(true); addToast("Message sent! We'll reply within 24 hours 💌",'success');
    } catch(err) { addToast(err.message,'error'); } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingTop:72 }}>
      <div style={{ background:'linear-gradient(135deg,#1a0a00,#3b1f0e)', padding:'56px 28px 44px', textAlign:'center' }}>
        <div className="eyebrow" style={{ background:'rgba(196,119,58,0.2)', borderColor:'rgba(196,119,58,0.35)', color:'var(--gold)', marginBottom:16 }}>Get in Touch</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(2.2rem,5vw,3.2rem)', color:'var(--cream)', marginBottom:10 }}>We'd Love to Hear From You</h1>
        <p style={{ color:'rgba(253,248,242,0.65)', maxWidth:420, margin:'0 auto' }}>For orders, custom cakes, events, or just to say hello — our door (and inbox) is always open.</p>
      </div>

      <div className="container" style={{ padding:'52px 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:48, alignItems:'start' }}>
          {/* Info side */}
          <div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', fontSize:'1.7rem', marginBottom:28 }}>Pâtisserie Dorée</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:22, marginBottom:36 }}>
              {[
                { Icon:MapPin, title:'Find Us', lines:['57 Raja Street','Salem, Tamil Nadu 636010'] },
                { Icon:Phone, title:'Call Us', lines:['+91 8870160044'] },
                { Icon:Mail, title:'Email Us', lines:['hello@patisseriedoree.in'] },
                { Icon:Clock, title:'Open Hours', lines:['Monday – Sunday','10:00 AM – 10:00 PM'] },
              ].map(({Icon,title,lines})=>(
                <div key={title} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                  <div style={{ width:46, height:46, background:'linear-gradient(135deg,rgba(196,119,58,0.12),rgba(228,168,75,0.12))', borderRadius:14, border:'1px solid rgba(196,119,58,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={19} color="var(--caramel)"/>
                  </div>
                  <div>
                    <div style={{ fontWeight:600, color:'var(--chocolate)', marginBottom:2, fontSize:'0.92rem' }}>{title}</div>
                    {lines.map(l=><div key={l} style={{ fontSize:'0.87rem', color:'var(--text-muted)' }}>{l}</div>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <h4 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', marginBottom:14, fontSize:'1.05rem' }}>Follow Our Journey</h4>
            <div style={{ display:'flex', gap:10, marginBottom:32 }}>
              {[
                {Icon:Instagram,color:'#e1306c',label:'Instagram'},
                {Icon:Facebook,color:'#1877f2',label:'Facebook'},
                {Icon:Twitter,color:'#1da1f2',label:'Twitter'},
                {Icon:Youtube,color:'#ff0000',label:'YouTube'},
              ].map(({Icon,color,label})=>(
                <a key={label} href="#" title={label} style={{ width:44, height:44, borderRadius:12, background:'var(--biscuit)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background=color;e.currentTarget.style.borderColor=color;e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.querySelector('svg').style.color='white';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='var(--biscuit)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.querySelector('svg').style.color=color;}}>
                  <Icon size={17} color={color}/>
                </a>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{ borderRadius:18, overflow:'hidden', height:200, background:'linear-gradient(135deg,var(--biscuit),var(--latte))', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, border:'1px solid var(--border)' }}>
              <MapPin size={28} color="var(--caramel)"/>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontWeight:600, color:'var(--chocolate)', fontSize:'0.9rem' }}>57 Raja Street, Salem</div>
                <a href="https://maps.google.com/?q=Salem,Tamil+Nadu" target="_blank" rel="noreferrer" style={{ fontSize:'0.8rem', color:'var(--caramel)', textDecoration:'underline', marginTop:4, display:'block' }}>Open in Google Maps →</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background:'white', borderRadius:22, padding:36, boxShadow:'0 12px 48px rgba(59,31,14,0.1)', border:'1px solid var(--border)' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'32px 0' }}>
                <div style={{ width:70, height:70, background:'linear-gradient(135deg,#d1fae5,#a7f3d0)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 22px' }}>
                  <CheckCircle size={32} color="#059669"/>
                </div>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', fontSize:'1.8rem', marginBottom:10 }}>Message Received!</h3>
                <p style={{ color:'var(--text-muted)', marginBottom:28, lineHeight:1.65 }}>Our team will get back to you within 24 hours. Meanwhile, explore our menu!</p>
                <button className="btn-primary" onClick={()=>{setSent(false);setForm({name:'',email:'',phone:'',message:''});}}>Send Another Message</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', fontSize:'1.6rem', marginBottom:6 }}>Send Us a Message</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.87rem', marginBottom:26 }}>We reply to every message personally, usually within a few hours.</p>
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <div className="input-group">
                      <label>Your Name *</label>
                      <input name="name" value={form.name} onChange={ch} placeholder="Full name"/>
                    </div>
                    <div className="input-group">
                      <label>Phone</label>
                      <input name="phone" value={form.phone} onChange={ch} placeholder="+91 ..."/>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={ch} placeholder="your@email.com"/>
                  </div>
                  <div className="input-group">
                    <label>Message *</label>
                    <textarea name="message" value={form.message} onChange={ch} rows={5} placeholder="Tell us about your order, custom cake request, event, or anything else..." style={{ resize:'vertical' }}/>
                  </div>
                  <button className="btn-gold" style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:'1rem' }} onClick={submit} disabled={loading}>
                    {loading ? 'Sending...' : <><Send size={16}/> Send Message</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:820px){.contact-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
