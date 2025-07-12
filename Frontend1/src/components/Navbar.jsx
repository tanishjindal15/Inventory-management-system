import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ title = 'Inventory System' }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container-fluid">
        <NavLink className="navbar-brand fs-3" to="/">
          {title}
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link fs-5 text-white ${isActive ? 'fw-bold active' : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav-link fs-5 text-white ${isActive ? 'fw-bold active' : ''}`
                }
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/returns"
                className={({ isActive }) =>
                  `nav-link fs-5 text-white ${isActive ? 'fw-bold active' : ''}`
                }
              >
                Returns
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/billing"
                className={({ isActive }) =>
                  `nav-link fs-5 text-white ${isActive ? 'fw-bold active' : ''}`
                }
              >
                Billing
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link fs-5 text-white ${isActive ? 'fw-bold active' : ''}`
                }
              >
                About
              </NavLink>
            </li>
          </ul>

          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
            <button className="btn btn-light fs-5" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
