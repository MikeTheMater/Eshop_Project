import { useEffect, useState } from "react";
import api from "./api/api";
import { isLoggedIn, removeToken } from "./api/api";
import LoginPage from "./LoginPage";
import ProductCard from "./ProductCard";

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    api.get("/api/products")
      .then(res => setProducts(res.data.content))
      .catch(err => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <span style={styles.logo}>🛍 Eshop</span>
        <button
          onClick={() => { removeToken(); setLoggedIn(false); }}
          style={styles.logoutBtn}
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <main style={styles.main}>
        <h2 style={styles.heading}>Products</h2>

        {loading && <p style={styles.status}>Loading...</p>}
        {error   && <p style={{ ...styles.status, color: "#dc2626" }}>{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p style={styles.status}>No products found.</p>
        )}

        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    fontFamily: "sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.9rem 2rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111",
  },
  logoutBtn: {
    padding: "0.4rem 1rem",
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.25rem",
  },
  status: {
    textAlign: "center",
    color: "#888",
    marginTop: "3rem",
    fontSize: "15px",
  },
};

export default App;