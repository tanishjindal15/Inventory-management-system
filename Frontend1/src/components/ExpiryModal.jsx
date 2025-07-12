import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ExpiryModal({ show, onClose, expired = [], nearExpiry = [] }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Product Expiry Alert</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {expired.length === 0 && nearExpiry.length === 0 ? (
          <p>🎉 All products are in good condition.</p>
        ) : (
          <>
            {expired.length > 0 && (
              <>
                <h5 className="text-danger">❌ Expired Products</h5>
                <ul>
                  {expired.map((p) => (
                    <li key={p._id}>{p.ProductName} (expired on {p.ExpiryDate?.slice(0, 10)})</li>
                  ))}
                </ul>
              </>
            )}
            {nearExpiry.length > 0 && (
              <>
                <h5 className="text-warning">⚠️ Near Expiry (≤ 30 days)</h5>
                <ul>
                  {nearExpiry.map((p) => (
                    <li key={p._id}>
                      {p.ProductName} (expires on {p.ExpiryDate?.slice(0, 10)})
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
