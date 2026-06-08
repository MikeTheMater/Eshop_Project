// src/App.jsx
import { useEffect, useState } from "react";
import api from "./api/api";
import { isLoggedIn, removeToken } from "./api/api";
import LoginPage from "./LoginPage";
import ProductCard from "./ProductCard";
import CartDrawer from "./CartDrawer";
import OrderHistory from "./OrderHistory";
import { CartProvider, useCart } from "./CartContext";

function Shop({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    setLoading(true);
    api.get("/api/products")
      .then(res => setProducts(res.data.content))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.logo}>🛍 Eshop</span>
        <div style={styles.navRight}>
          <button onClick={() => setOrdersOpen(true)} style={styles.navBtn}>My Orders</button>
          <button onClick={() => setCartOpen(true)} style={styles.cartBtn}>
            Cart
            {totalItems > 0 && <span style={styles.cartBadge}>{totalItems}</span>}
          </button>
          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>
        {loading && <p style={styles.status}>Loading...</p>}
        {error && <p style={{ ...styles.status, color: "#dc2626" }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={styles.status}>No products found.</p>
        )}
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {ordersOpen && <OrderHistory onClose={() => setOrdersOpen(false)} />}
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <CartProvider>
      <Shop onLogout={() => { removeToken(); setLoggedIn(false); }} />
    </CartProvider>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "sans-serif" },
  navbar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0.9rem 2rem", backgroundColor: "#fff",
    borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 10,
  },
  logo: { fontSize: "18px", fontWeight: "700", color: "#111" },
  navRight: { display: "flex", alignItems: "center", gap: "12px" },
  navBtn: {
    padding: "0.4rem 1rem", backgroundColor: "transparent",
    border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontSize: "14px", color: "#555",
  },
  cartBtn: {
    position: "relative", padding: "0.4rem 1rem",
    backgroundColor: "#111", color: "#fff",
    border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px",
  },
  cartBadge: {
    position: "absolute", top: "-6px", right: "-6px",
    backgroundColor: "#e94560", color: "#fff", borderRadius: "50%",
    width: "18px", height: "18px", fontSize: "11px", fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoutBtn: {
    padding: "0.4rem 1rem", backgroundColor: "transparent",
    border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontSize: "14px", color: "#555",
  },
  main: { maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" },
  heading: { fontSize: "24px", fontWeight: "600", color: "#111", marginBottom: "1.5rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" },
  status: { textAlign: "center", color: "#888", marginTop: "3rem", fontSize: "15px" },
};