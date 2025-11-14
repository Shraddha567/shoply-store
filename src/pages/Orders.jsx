import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Orders() {
  const { state, cancelOrder } = useCart();
  const orders = state?.orders || [];

  if (!orders.length) {
    return (
      <section className="container cart-empty empty-cart">
        <h1>Your Orders</h1>
        <p>You have not placed any orders yet.</p>
        <Link to="/" className="btn-primary ghost">
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="container orders-page">
      <div className="orders-header">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Order History</h1>
          <p className="muted">Need help? Cancel or review recent orders.</p>
        </div>
        <Link to="/cart" className="ghost-btn">
          Go to cart
        </Link>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <div className="order-top">
              <div>
                <p className="order-id">Order #{order.id.slice(-6)}</p>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`status-pill status-${order.status?.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item-row">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <p className="item-title">{item.title}</p>
                    <p className="item-meta">
                      Qty {item.quantity} • ₹{Math.round(item.price * 83)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div>
                <p>Paid via {order.paymentMethod?.toUpperCase()}</p>
                <strong>Total ₹{order.total.toLocaleString("en-IN")}</strong>
              </div>
              <div className="order-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => cancelOrder(order.id)}
                  disabled={order.status === "Cancelled"}
                >
                  {order.status === "Cancelled" ? "Order Cancelled" : "Cancel Order"}
                </button>
                <Link to="/login" className="ghost-btn">
                  Need help?
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

