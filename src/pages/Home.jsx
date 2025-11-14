import React, { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../services/api";
import ProductList from "../components/ProductList";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        setProducts(data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      `${product.title} ${product.category}`.toLowerCase().includes(term)
    );
  }, [products, search]);

  if (loading) return <Loader label="Loading products..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="home container">
      <div className="home-heading">
        <div>
          <p className="eyebrow">Products</p>
          <h1>Products</h1>
        </div>
        <div className="search-wrapper">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <input
            id="product-search"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="results-meta">
        Showing {filteredProducts.length} of {products.length} products
      </div>
      <ProductList products={filteredProducts} />
    </section>
  );
}
