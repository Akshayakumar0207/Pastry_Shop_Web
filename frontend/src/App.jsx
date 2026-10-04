import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Events from './pages/Events';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';

function Layout({ children }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar/>
      <main style={{ flex:1 }}>{children}</main>
      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/menu" element={<Menu/>}/>
              <Route path="/shop" element={<Shop/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/events" element={<Events/>}/>
              <Route path="/contact" element={<Contact/>}/>
              <Route path="/track" element={<TrackOrder/>}/>
              <Route path="*" element={
                <div style={{ paddingTop:72, minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, textAlign:'center', padding:'120px 24px' }}>
                  <div style={{ fontSize:72 }}>🥐</div>
                  <h1 style={{ fontFamily:'Cormorant Garamond,serif', color:'var(--chocolate)', fontSize:'2.5rem' }}>Page Not Found</h1>
                  <p style={{ color:'var(--text-muted)', maxWidth:360 }}>Looks like this page wandered off — perhaps in search of a croissant. Let's get you back home.</p>
                  <a href="/" className="btn-primary" style={{ marginTop:8 }}>Back to Pâtisserie Dorée</a>
                </div>
              }/>
            </Routes>
          </Layout>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
