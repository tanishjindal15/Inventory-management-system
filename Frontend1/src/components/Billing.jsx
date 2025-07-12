import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) return;

    setCart([...cart, { ...product, quantity: 1, price: product.ProductPrice }]);
  };

  const updateCart = (index, field, value) => {
    const newCart = [...cart];
    newCart[index][field] = value;
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleSubmit = async () => {
  const payload = {
    customerName,
    paymentMode,
    totalAmount: total,
    items: cart.map(item => ({
      productId: item._id,
      name: item.ProductName,
      price: item.price,
      quantity: item.quantity
    }))
  };

  try {
    const res = await fetch('http://localhost:3001/createbill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 201) {
      setMessage('✅ Bill generated successfully.');
      navigate('/invoice', {
        state: {
          customerName,
          paymentMode,
          items: cart,
          total,
          date: new Date()
        }
      });
      setCart([]);
      setCustomerName('');
      setPaymentMode('Cash');
    } else {
      const data = await res.json();
      setMessage(`❌ ${data}`);
    }
  } catch (err) {
    console.error(err);
    setMessage('❌ Billing failed.');
  }
};


  return (
    <div className="container p-5">
      <h2>🧾 Billing Module</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        <div className="col-md-5">
          <h4>📦 Products</h4>
          <ul className="list-group">
            {products.map(p => (
              <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
                {p.ProductName} (Stock: {p.ProductQuantity})
                <button className="btn btn-sm btn-primary" onClick={() => addToCart(p)}>Add</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-7">
          <h4>🛒 Cart</h4>
          {cart.length === 0 ? (
            <p>No items added yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item._id}>
                    <td>{item.ProductName}</td>
                    <td><input type="number" min={1} value={item.quantity} onChange={(e) => updateCart(index, 'quantity', parseInt(e.target.value))} /></td>
                    <td><input type="number" step="0.01" value={item.price} onChange={(e) => updateCart(index, 'price', parseFloat(e.target.value))} /></td>
                    <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                    <td><button onClick={() => removeFromCart(index)} className="btn btn-sm btn-danger">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h5>Total: ₹{total.toFixed(2)}</h5>

          <div className="mt-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Customer Name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <select className="form-select mb-3" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>

            <button className="btn btn-success" onClick={handleSubmit}>
              Finalize Bill & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
