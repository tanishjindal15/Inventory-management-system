import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function InsertProduct() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productBarcode, setProductBarcode] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [discount, setDiscount] = useState('');
  const [mrp, setMRP] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productBarcode || !productQuantity) {
      setError('*Please fill in all the required fields.');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:3001/insertproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ProductName: productName,
          ProductPrice: productPrice,
          ProductBarcode: productBarcode,
          ProductQuantity: productQuantity,
          ProductDetails: productDetails,
          Discount: discount,
          MRP: mrp,
          PurchaseDate: purchaseDate,
          ExpiryDate: expiryDate,
        }),
      });

      await res.json();

      if (res.status === 201) {
        setSuccess('✅ Product inserted successfully!');
        setProductName('');
        setProductPrice('');
        setProductBarcode('');
        setProductQuantity('');
        setProductDetails('');
        setDiscount('');
        setMRP('');
        setPurchaseDate('');
        setExpiryDate('');
        setTimeout(() => navigate('/products'), 1500);
      } else if (res.status === 422) {
        setError('⚠ Product already exists with that barcode.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-5">
      <h1>Enter Product Information</h1>

      <form onSubmit={handleSubmit}>
        <div className="mt-4 col-lg-6 fs-5">
          <label className="form-label fw-bold">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="form-control"
            placeholder="Enter Product Name"
            required
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">Product Price</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="form-control"
            placeholder="Enter Product Price"
            required
            min={0.01}
            step="0.01"
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">Product Quantity</label>
          <input
            type="number"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            className="form-control"
            placeholder="Enter Product Quantity"
            required
            min={0}
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">Product Barcode</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={12}
            pattern="\d{1,12}"
            value={productBarcode}
            onChange={(e) => setProductBarcode(e.target.value.slice(0, 12))}
            className="form-control"
            placeholder="Enter Product Barcode"
            required
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">Product Details</label>
          <input
            type="text"
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            className="form-control"
            placeholder="e.g. Mango Flavor, 500ml"
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">Discount</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="form-control"
            placeholder="Enter discount if any"
            min={0}
            step="0.01"
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">MRP</label>
          <input
            type="number"
            value={mrp}
            onChange={(e) => setMRP(e.target.value)}
            className="form-control"
            placeholder="Enter Maximum Retail Price"
            min={0.01}
            step="0.01"
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">Purchase Date</label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mt-3 col-lg-6 fs-5">
          <label className="form-label fw-bold">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="mt-4 d-flex col-lg-6 gap-3">
          <NavLink to="/products" className="btn btn-secondary fs-5">
            Cancel
          </NavLink>
          <button type="submit" className="btn btn-primary fs-5" disabled={loading}>
            {loading ? 'Inserting...' : 'Insert'}
          </button>
        </div>

        <div className="mt-3 col-lg-6 text-center">
          {error && <div className="text-danger fs-5 fw-bold">{error}</div>}
          {success && <div className="text-success fs-5 fw-bold">{success}</div>}
        </div>
      </form>
    </div>
  );
}
