import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { state } = useCart();
  const cartCount = state?.totalQty ?? 0;
  const wishlistCount = state?.wishlist?.length ?? 0;

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span role="img" aria-hidden="true">
            🛍️
          </span>
          Shoply Store
        </Link>
        <nav className="header-actions">
          <Link to="/cart" className="cart-link">
            <span aria-hidden="true">🛒</span> Cart ({cartCount})
          </Link>
          <div className="profile-menu">
            <button className="profile-trigger" aria-haspopup="true">
              <span aria-hidden="true">👤</span>
            </button>
            <div className="profile-dropdown">
              <div className="profile-summary">
                <p>Welcome, Shopper!</p>
                <small>{wishlistCount} items in wishlist</small>
              </div>
              <Link to="/login">Login / Logout</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/cart">Help & Support</Link>
              <button
                type="button"
                onClick={() =>
                  alert("Open the Orders page to cancel any pending order.")
                }
              >
                Cancel Order
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
