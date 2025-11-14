import React from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products = [] }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <p>No products match that search. Try a different term.</p>
      </div>
    );
  }

  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
