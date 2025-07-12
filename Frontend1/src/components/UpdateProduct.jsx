import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

export default function UpdateProduct() {
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
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/products/${id}`);
        const data = await res.json();

        if (res.status === 201) {
          setProductName(data.ProductName || '');
          setProductPrice(data.ProductPrice?.toString() || '');
          setProductBarcode(data.ProductBarcode?.toString() || '');
          setProductQuantity(data.ProductQuantity?.toString() || '');
          setProductDetails(data.ProductDetails || '');
          setDiscount(data.Discount?.toString() || '');
          setMRP(data.MRP?.toString() || '');
          setPurchaseDate(data.PurchaseDate ? data.PurchaseDate.slice(0, 10) : '');
          setExpiryDate(data.ExpiryDate ? data.ExpiryDate.slice(0, 10) : '');
        } else {
          setError('Failed to retrieve product data.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching product data.');
      }
    };

    getProduct();
  }, [id]);

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!productName.trim() || !productPrice || !productBarcode || !productQuantity) {
      setError('*Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:3001/updateproduct/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ProductName: productName,
          ProductPrice: parseFloat(productPrice),
          ProductBarcode: productBarcode,
          ProductQuantity: parseInt(productQuantity),
          ProductDetails: productDetails,
          Discount: parseFloat(discount) || 0,
          MRP: parseFloat(mrp) || 0,
          PurchaseDate: purchaseDate,
          ExpiryDate: expiryDate
        }),
      });

      await response.json();

      if (response.status === 201) {
        setSuccess('✅ Product updated successfully!');
        setTimeout(() => navigate('/products'), 1500);
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
      <h1>Update Product Information</h1>
      <form onSubmit={updateProduct}>
        {/* Name */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Product Name</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="form-control fs-5" required />
        </div>

        {/* Price */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Product Price</label>
          <input type="number" step="0.01" min={0.01} value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="form-control fs-5" required />
        </div>

        {/* Quantity */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Product Quantity</label>
          <input type="number" min={0} value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="form-control fs-5" required />
        </div>

        {/* Barcode */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Product Barcode</label>
          <input type="text" maxLength={12} value={productBarcode} onChange={(e) => setProductBarcode(e.target.value.slice(0, 12))} className="form-control fs-5" required />
        </div>

        {/* Details */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Product Details</label>
          <input type="text" value={productDetails} onChange={(e) => setProductDetails(e.target.value)} className="form-control fs-5" />
        </div>

        {/* Discount */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Discount</label>
          <input type="number" step="0.01" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} className="form-control fs-5" />
        </div>

        {/* MRP */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">MRP</label>
          <input type="number" step="0.01" min={0.01} value={mrp} onChange={(e) => setMRP(e.target.value)} className="form-control fs-5" />
        </div>

        {/* Purchase Date */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Purchase Date</label>
          <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="form-control fs-5" />
        </div>

        {/* Expiry Date */}
        <div className="mt-3 col-lg-6">
          <label className="form-label fs-5 fw-bold">Expiry Date</label>
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="form-control fs-5" />
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-center col-lg-6 mt-4">
          <NavLink to="/products" className="btn btn-secondary me-3 fs-5">Cancel</NavLink>
          <button type="submit" className="btn btn-primary fs-5" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>

        {/* Status */}
        <div className="col text-center col-lg-6 mt-4">
          {error && <div className="text-danger fs-5 fw-bold">{error}</div>}
          {success && <div className="text-success fs-5 fw-bold">{success}</div>}
        </div>
      </form>
    </div>
  );
}
