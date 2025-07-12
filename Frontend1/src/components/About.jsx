import React from 'react';

export default function About() {
  return (
    <div className="container-fluid p-5">
      <h1 className="mb-4">Inventory Management System (IMS)</h1>
      <p className="fs-5">
        This <strong>MERN</strong> CRUD application allows shopkeepers to manage their product inventory efficiently.
        It includes functionality for:
      </p>
      <ul className="fs-5">
        <li>Adding new products with name, price, and barcode</li>
        <li>Viewing product inventory</li>
        <li>Updating existing products</li>
        <li>Deleting products</li>
      </ul>
      <p className="fs-5">
        Built with <strong>MongoDB</strong>, <strong>Express.js</strong>, <strong>React</strong>, and <strong>Node.js</strong>,
        the system supports both cloud-connected and offline-first workflows.
      </p>
      <p className="fs-6 text-muted mt-4">
        Developed by Tanish Jindal · 2025
      </p>
    </div>
  );
}
