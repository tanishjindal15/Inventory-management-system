import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Invoice() {
  const { state } = useLocation();

  if (!state) {
    return <div className="p-5">❌ No invoice data found.</div>;
  }

  const { customerName, paymentMode, items, total, date } = state;

  return (
    <div className="container p-5 print-section">
      <h2>🧾 Invoice</h2>
      <p><strong>Date:</strong> {new Date(date).toLocaleString()}</p>
      <p><strong>Customer:</strong> {customerName || 'N/A'}</p>
      <p><strong>Payment Mode:</strong> {paymentMode}</p>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>₹{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end mt-3">
        <p><strong>Total Amount:</strong> ₹{total.toFixed(2)}</p>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => window.print()}>
          🖨 Print Invoice
        </button>
      </div>
    </div>
  );
}
