import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEMO_CREDENTIALS = {
  phone: "9876543210",
  password: "Pass@123",
};

const initialForm = { ...DEMO_CREDENTIALS };

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState("");

  const errors = useMemo(() => {
    const list = {};
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      list.phone = "Enter a valid 10-digit mobile number";
    }
    if (form.password.trim().length < 6) {
      list.password = "Password must be at least 6 characters";
    }
    return list;
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ phone: true, password: true });
    if (Object.keys(errors).length) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setToast("Welcome back! You are now signed in.");
      setTimeout(() => setToast(""), 2000);
      setForm(initialForm);
      setTimeout(() => {
        setStatus("idle");
        navigate("/");
      }, 1200);
    }, 800);
  };

  return (
    <section className="container auth-page">
      <div className="auth-card">
        <div className="auth-head">
          <p className="eyebrow">Welcome back</p>
          <h1>Login to Shoply Store</h1>
          <p className="muted">
            Track orders, manage your cart, and check out faster.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-control">
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter 10-digit number"
              value={form.phone}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            />
            {touched.phone && errors.phone && (
              <p className="helper error">{errors.phone}</p>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            />
            {touched.password && errors.password && (
              <p className="helper error">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary wide"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing in..." : "Login"}
          </button>
          {status === "success" && (
            <p className="helper success">
              Logged in successfully. Redirecting…
            </p>
          )}
        </form>

        <div className="auth-footer">
          <p className="muted">
            Don't have an account?{" "}
            <Link to="/" className="link">
              Continue as guest
            </Link>
          </p>
        </div>
      </div>

      {toast && <div className="login-toast">{toast}</div>}
    </section>
  );
}

