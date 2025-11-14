import axios from "axios";

// Base API URL
const BASE = "https://fakestoreapi.com";

// Fetch all products
export const fetchProducts = () => axios.get(`${BASE}/products`);

// Fetch a single product by ID (for details page)
export const fetchProductById = (id) => axios.get(`${BASE}/products/${id}`);
