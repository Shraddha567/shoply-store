import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, state, toggleWishlist } = useCart();
  const wishlist = state?.wishlist || [];
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const priceInINR = Math.round(product.price * 83);
  const formattedPrice = priceInINR.toLocaleString("en-IN");

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    addToCart(product);
  };

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >
      <figure className="product-media" aria-hidden="true">
        {product.image ? (
          <img src={product.image} alt={product.title} loading="lazy" />
        ) : (
          <div className="placeholder" />
        )}
        <button
          type="button"
          className={`media-badge heart ${isWishlisted ? "selected" : ""}`}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          onClick={(event) => {
            event.stopPropagation();
            toggleWishlist(product);
            if (!isWishlisted) {
              window.alert("Item added to wishlist!");
              navigate("/wishlist");
            }
          }}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
      </figure>
      <div className="product-body">
        <div>
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">₹{formattedPrice}</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
