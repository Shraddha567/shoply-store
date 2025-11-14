import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../services/api";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useCart } from "../context/CartContext";

const INR_FACTOR = 83;

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader label="Fetching product..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const price = Math.round(product.price * INR_FACTOR);

  return (
    <section className="container product-detail">
      <Link to="/" className="back-link detail-back" aria-label="Back to products">
        ← Back
      </Link>
      <div className="detail-grid">
        <figure className="detail-media">
          <img src={product.image} alt={product.title} />
        </figure>
        <div className="detail-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="detail-price">₹{price.toLocaleString("en-IN")}</p>
          <p className="detail-description">{product.description}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => addToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}

