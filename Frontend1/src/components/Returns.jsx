import React, { useState, useEffect } from 'react';

export default function Returns() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [actualReceived, setActualReceived] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const filtered = data.filter((p) => {
          const exp = new Date(p.ExpiryDate);
          const daysLeft = (exp - now) / (1000 * 60 * 60 * 24);
          return daysLeft <= 30;
        });
        setProducts(filtered);
      });
  }, []);

  const handleReturn = async () => {
    if (!selected) return;

    const discountedPrice = selected.ProductPrice - (selected.Discount || 0);
    const returnValue = discountedPrice * selected.ProductQuantity;
    const actual = parseFloat(actualReceived) || 0;
    const costImpact = returnValue - actual;

    try {
      const res = await fetch(`http://localhost:3001/returnproduct/${selected._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantityReturned: selected.ProductQuantity,
          actualMoneyReceived: actual,
          reason: new Date(selected.ExpiryDate) < new Date() ? 'expired' : 'near-expiry',
        }),
      });

      const result = await res.json();

      if (res.status === 201) {
        setMessage('✅ Return processed and product updated/removed.');
        setProducts(products.filter(p => p._id !== selected._id));
        setSelected(null);
        setActualReceived('');
      } else {
        setMessage('❌ Failed to process return: ' + result);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error while processing return.');
    }
  };

  return (
    <div className="container p-5">
      <h2>Returns Module (Expired / Near Expiry)</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Products Near Expiry</h4>
          <ul className="list-group">
            {products.map((p) => (
              <li
                key={p._id}
                className={`list-group-item ${selected?._id === p._id ? 'active' : ''}`}
                onClick={() => setSelected(p)}
                style={{ cursor: 'pointer' }}
              >
                {p.ProductName} - Expiry: {p.ExpiryDate?.slice(0, 10)}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          {selected && (
            <>
              <h4>Return Details</h4>
              <p><strong>Product:</strong> {selected.ProductName}</p>
              <p><strong>Barcode:</strong> {selected.ProductBarcode}</p>
              <p><strong>Price:</strong> ₹{selected.ProductPrice}</p>
              <p><strong>Discount:</strong> ₹{selected.Discount || 0}</p>
              <p><strong>Quantity:</strong> {selected.ProductQuantity}</p>
              <p><strong>Return Value:</strong> ₹
                {((selected.ProductPrice - (selected.Discount || 0)) * selected.ProductQuantity).toFixed(2)}
              </p>

              <label className="form-label mt-3">Actual Money Received</label>
              <input
                type="number"
                className="form-control"
                value={actualReceived}
                onChange={(e) => setActualReceived(e.target.value)}
                min={0}
                step="0.01"
              />

              <button className="btn btn-danger mt-4" onClick={handleReturn}>
                Process Return & Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
