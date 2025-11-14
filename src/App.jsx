import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/cart";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
      <footer className="app-footer">
        Tip: Click a product to view details • Deploy to Vercel for a live demo
      </footer>
    </div>
  );
}

export default App;

