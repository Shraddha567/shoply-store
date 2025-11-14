import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PAYMENT_OPTIONS = [
  {
    id: "upi",
    label: "UPI",
    description: "PhonePe, Google Pay, Paytm and more",
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when the order arrives",
  },
];

const INR_FACTOR = 83;

function Cart() {
  const { state, removeFromCart, setQuantity, clearCart, addOrder } = useCart();
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_OPTIONS[0].id);
  const [status, setStatus] = useState("idle");

  const totals = useMemo(() => {
    const subtotal = Math.round(state.totalPrice * INR_FACTOR);
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [state.totalPrice]);

  const handlePayment = () => {
    setStatus("processing");
    setTimeout(() => {
      const orderPayload = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        createdAt: new Date().toISOString(),
        items: state.items,
        total: totals.total,
        paymentMethod: selectedMethod,
        status: "Processing",
      };
      addOrder(orderPayload);
      setStatus("success");
      clearCart();
      setTimeout(() => setStatus("idle"), 2500);
    }, 1200);
  };

  if (!state.items?.length) {
    return (
      <section className="container cart-empty empty-cart">
        <h1>Your Cart</h1>
        <p>No items yet. Browse products to add them here.</p>
        <Link to="/" className="btn-primary ghost">
          Back to Products
        </Link>
      </section>
    );
  }

  return (
    <section className="container cart-page">
      <div className="cart-header">
        <div>
          <p className="eyebrow">Cart</p>
          <h1>Your Cart ({state.totalQty} items)</h1>
          <Link to="/" className="back-link" aria-label="Back to products">
            ← Back to products
          </Link>
        </div>
        <div className="cart-actions">
          <Link to="/" className="ghost-btn">
            Continue shopping
          </Link>
          <button type="button" className="ghost-btn" onClick={clearCart}>
            Clear cart
          </button>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {state.items.map((item) => {
            const price = Math.round(item.price * INR_FACTOR);
            const total = price * item.quantity;
            return (
              <article key={item.id} className="cart-item">
                <button
                  type="button"
                  className="close-pill"
                  aria-label="Remove item"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </button>
                <img src={item.image} alt={item.title} />
                <div className="item-content">
                  <div className="item-heading">
                    <h3>{item.title}</h3>
                    <p className="item-meta">{item.category}</p>
                  </div>
                  <p className="item-desc">
                    {item.description?.slice(0, 120)}
                    {item.description && item.description.length > 120
                      ? "..."
                      : ""}
                  </p>
                  <div className="item-footer">
                    <div className="qty-controls">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="item-pricing">
                      <span>₹{price.toLocaleString("en-IN")}</span>
                      <strong>₹{total.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart-payment">
          <h2>Payment</h2>
          <div className="payment-options">
            {PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`payment-option ${
                  selectedMethod === option.id ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.id}
                  checked={selectedMethod === option.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                />
                <div>
                  <strong>{option.label}</strong>
                  <p>{option.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="summary">
            <div>
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{totals.shipping ? `₹${totals.shipping}` : "Free"}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>₹{totals.total.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary pay-btn"
            disabled={status === "processing"}
            onClick={handlePayment}
          >
            {status === "processing"
              ? "Processing..."
              : `Pay ₹${totals.total.toLocaleString("en-IN")} via ${
                  PAYMENT_OPTIONS.find((p) => p.id === selectedMethod)?.label
                }`}
          </button>
          {status === "success" && (
            <p className="success-text">
              Payment successful!{" "}
              <Link to="/orders" className="link">
                View your orders
              </Link>
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

export default Cart;
 