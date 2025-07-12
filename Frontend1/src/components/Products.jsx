import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function isNearExpiry(expiryDateStr) {
  if (!expiryDateStr) return false;
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diff = (expiry - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 30;
}

function isExpired(expiryDateStr) {
  if (!expiryDateStr) return false;
  return new Date(expiryDateStr) < new Date();
}

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [showExpiryModal, setShowExpiryModal] = useState(true);
  const [expiredProducts, setExpiredProducts] = useState([]);

  const query = useQuery();
  const searchKeyword = query.get('search')?.toLowerCase() || '';

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:3001/products');
      const data = await res.json();

      if (res.status === 201) {
        const now = new Date();
        const expired = data.filter(p => p.ExpiryDate && new Date(p.ExpiryDate) < now);
        const valid = data.filter(p => !p.ExpiryDate || new Date(p.ExpiryDate) >= now);

        if (expired.length > 0 && showExpiryModal) {
          setExpiredProducts(expired);
          return; // ⛔ don't set productData yet, wait for modal confirmation
        }

        // delete expired immediately if no modal shown
        for (const p of expired) {
          await fetch(`http://localhost:3001/deleteproduct/${p._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
        }

        setProductData(valid);
        if (valid.length === 0) setMessage('All products expired or none available.');
      } else {
        setMessage('❌ Failed to fetch products. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`http://localhost:3001/deleteproduct/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      getProducts();
      setMessage('✅ Product deleted.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error deleting product.');
    }
  };

  const confirmDeleteExpired = async () => {
    for (const p of expiredProducts) {
      await fetch(`http://localhost:3001/deleteproduct/${p._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    }
    setExpiredProducts([]);
    setShowExpiryModal(false);
    getProducts();
  };

  const cancelDeleteExpired = () => {
    setShowExpiryModal(false);
    setProductData(productData.filter(p => !expiredProducts.includes(p)));
  };

  const filteredProducts = productData
    .filter(p => p.ProductName?.toLowerCase().includes(searchKeyword))
    .filter(p => {
      if (filter === 'near') return isNearExpiry(p.ExpiryDate);
      return true;
    })
    .sort((a, b) => {
      if (!a.ExpiryDate || !b.ExpiryDate) return 0;
      return new Date(a.ExpiryDate) - new Date(b.ExpiryDate);
    });

  const nearCount = productData.filter(p => isNearExpiry(p.ExpiryDate)).length;

  const totalValue = filteredProducts.reduce((sum, item) => {
    const price = parseFloat(item.ProductPrice) || 0;
    const qty = parseInt(item.ProductQuantity) || 0;
    return sum + price * qty;
  }, 0);

  return (
    <div className="container-fluid p-5">
      <h1>Products Inventory</h1>

      {searchKeyword && (
        <p className="text-muted">
          Searching: <strong>{searchKeyword}</strong>
        </p>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <NavLink to="/insertproduct" className="btn btn-primary fs-5">
          + Add New Product
        </NavLink>

        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Show All</option>
          <option value="near">Near Expiry (≤ 30 days)</option>
        </select>
      </div>

      {message && (
        <div className="alert alert-info col-lg-6" role="alert">
          {message}
        </div>
      )}
      {nearCount > 0 && (
        <div className="alert alert-warning col-lg-8">
          ⚠ {nearCount} product{nearCount > 1 ? 's are' : ' is'} near expiry (within 30 days)!
        </div>
      )}

      {/* Expiry Modal */}
      {showExpiryModal && expiredProducts.length > 0 && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Expired Products Found</h5>
              </div>
              <div className="modal-body">
                <p>{expiredProducts.length} product(s) are expired. Do you want to delete them now?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelDeleteExpired}>
                  No
                </button>
                <button className="btn btn-danger" onClick={confirmDeleteExpired}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-4 fs-4">Loading products...</div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped table-hover fs-5">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Barcode</th>
                <th>Qty</th>
                <th>Expiry</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p, i) => (
                  <tr
                    key={p._id}
                    className={isNearExpiry(p.ExpiryDate) ? 'table-warning' : ''}
                  >
                    <td>{i + 1}</td>
                    <td>{p.ProductName}</td>
                    <td>₹{parseFloat(p.ProductPrice).toFixed(2)}</td>
                    <td>{p.ProductBarcode}</td>
                    <td>{p.ProductQuantity}</td>
                    <td>{p.ExpiryDate ? p.ExpiryDate.slice(0, 10) : '-'}</td>
                    <td>
                      <NavLink
                        to={`/updateproduct/${p._id}`}
                        className="btn btn-sm btn-warning"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </NavLink>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteProduct(p._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No products to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="card mt-4 col-lg-4 ms-auto">
            <div className="card-body text-end">
              <h5 className="card-title">📦 Total Inventory Value</h5>
              <p className="card-text fs-4 fw-bold text-success">
                ₹{totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
