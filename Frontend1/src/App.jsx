import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Products from './components/Products';
import InsertProduct from './components/InsertProduct';
import UpdateProduct from './components/UpdateProduct';
import About from './components/About';
import Returns from './components/Returns'; // ✅ Returns Module
import Billing from './components/Billing'; // ✅ Billing Module
import ScrollToTop from './components/ScrollToTop';
import ExpiryModal from './components/ExpiryModal'; // ✅ Expiry Alert
import Invoice from './components/Invoice'; // ✅ NEW

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [expired, setExpired] = useState([]);
  const [nearExpiry, setNearExpiry] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const expiredItems = data.filter((p) => new Date(p.ExpiryDate) < now);
        const near = data.filter((p) => {
          const d = new Date(p.ExpiryDate);
          const diff = (d - now) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 30;
        });

        if (expiredItems.length > 0 || near.length > 0) {
          setExpired(expiredItems);
          setNearExpiry(near);
          setShowModal(true);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Navbar title="IMS" />
        <ExpiryModal
          show={showModal}
          onClose={() => setShowModal(false)}
          expired={expired}
          nearExpiry={nearExpiry}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/insertproduct" element={<InsertProduct />} />
          <Route path="/updateproduct/:id" element={<UpdateProduct />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/billing" element={<Billing />} /> {/* ✅ Billing Route */}
          <Route path="/invoice" element={<Invoice />} /> {/* ✅ Invoice route */}
          <Route path="/about" element={<About />} />
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Not Found</h2>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
