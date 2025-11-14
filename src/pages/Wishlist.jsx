import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const INR_FACTOR = 83;

export default function Wishlist() {
  const { state, toggleWishlist, addToCart } = useCart();
  const wishlist = state?.wishlist || [];

  if (!wishlist.length) {
    return (
      <section className="container cart-empty empty-cart">
        <h1>Your Wishlist</h1>
        <p>Tap the heart icon on products to save them here.</p>
        <Link to="/" className="btn-primary ghost">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="container wishlist-page">
      <div className="wishlist-header">
        <div>
          <p className="eyebrow">Wishlist</p>
          <h1>Saved items ({wishlist.length})</h1>
        </div>
        <Link to="/cart" className="ghost-btn">
          Go to cart
        </Link>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((item) => {
          const price = Math.round(item.price * INR_FACTOR).toLocaleString("en-IN");
          return (
            <article key={item.id} className="wishlist-card">
              <button
                type="button"
                className="close-pill"
                onClick={() => toggleWishlist(item)}
                aria-label="Remove from wishlist"
              >
                ×
              </button>
              <img src={item.image} alt={item.title} />
              <div className="wishlist-body">
                <h3>{item.title}</h3>
                <p className="item-meta">{item.category}</p>
                <p className="product-price">₹{price}</p>
                <div className="wishlist-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => addToCart(item)}
                  >
                    Add to cart
                  </button>
                  <Link to={`/product/${item.id}`} className="ghost-btn">
                    View details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

