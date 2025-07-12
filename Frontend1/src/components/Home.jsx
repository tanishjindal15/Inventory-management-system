import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container-fluid p-5 text-center">
      <h1 className="mb-4">Welcome to the Inventory Management System</h1>
      <p className="fs-5">
        Manage your products with ease — add, update, and delete inventory all in one place.
      </p>
      <NavLink to="/products" className="btn btn-primary fs-4 mt-4">
        Go to Products
      </NavLink>
    </div>
  );
}
