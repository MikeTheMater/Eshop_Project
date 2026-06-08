// src/OrderHistory.jsx
import { useState, useEffect } from "react";
import api from "./api/api";

export default function OrderHistory({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/api/orders/my")
      .then(res => setOrders(res.data))
      .catch(err => {
        const status = err.response?.status;
        const msg = err.response?.data?.error || err.message;
        setError(`Failed to load orders (${status}): ${msg}`);
      })
      .finally(() => setLoading(false));
  }, []);

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  return (
    <>
      <div onClick={onClose} style={styles.backdrop} />
      <div style={styles.drawer}>
        <div style={styles.header}>
          <h2 style={styles.title}>My Orders</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>
          {loading && <p style={styles.status}>Loading…</p>}

          {/* Show exact error so we can debug */}
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <p style={styles.status}>You haven't placed any orders yet.</p>
          )}

          {orders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div
                style={styles.orderHeader}
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div>
                  <p style={styles.orderId}>Order #{order.id}</p>
                  <p style={styles.orderDate}>{formatDate(order.createdAt)}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={styles.orderTotal}>${order.total.toFixed(2)}</p>
                  <p style={styles.expandHint}>{expanded === order.id ? "Hide ▲" : "Details ▼"}</p>
                </div>
              </div>

              {expanded === order.id && (
                <div style={styles.details}>
                  <p style={styles.detailLabel}>Delivered to</p>
                  <div style={styles.addrBox}>
                    <p style={{ margin: 0, fontWeight: 500 }}>{order.address.fullName}</p>
                    <p style={styles.addrLine}>{order.address.phone}</p>
                    <p style={styles.addrLine}>
                      {order.address.street}, {order.address.city} {order.address.zipCode}, {order.address.country}
                    </p>
                  </div>

                  <p style={{ ...styles.detailLabel, marginTop: "12px" }}>Items</p>
                  {order.items.map(item => (
                    <div key={item.productId} style={styles.itemRow}>
                      <span>{item.productName} <span style={{ color: "#888" }}>× {item.quantity}</span></span>
                      <span style={{ fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 100 },
  drawer: {
    position: "fixed", top: 0, right: 0, bottom: 0,
    width: "420px", maxWidth: "100vw", backgroundColor: "#fff",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", zIndex: 101,
    display: "flex", flexDirection: "column",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1.25rem 1.5rem", borderBottom: "1px solid #eee",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: "600", color: "#111" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#888" },
  body: { flexGrow: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "12px" },
  status: { textAlign: "center", color: "#aaa", marginTop: "3rem", fontSize: "15px" },
  errorBox: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px" },
  errorText: { margin: 0, color: "#dc2626", fontSize: "13px" },
  orderCard: { border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" },
  orderHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px", cursor: "pointer", backgroundColor: "#fafafa",
  },
  orderId: { margin: 0, fontWeight: "600", fontSize: "14px", color: "#111" },
  orderDate: { margin: 0, fontSize: "12px", color: "#888", marginTop: "2px" },
  orderTotal: { margin: 0, fontWeight: "700", fontSize: "15px", color: "#111" },
  expandHint: { margin: 0, fontSize: "11px", color: "#aaa", marginTop: "2px" },
  details: { padding: "14px 16px", borderTop: "1px solid #eee", display: "flex", flexDirection: "column", gap: "6px" },
  detailLabel: { margin: 0, fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" },
  addrBox: { background: "#f9f9f9", borderRadius: "6px", padding: "10px", display: "flex", flexDirection: "column", gap: "2px" },
  addrLine: { margin: 0, fontSize: "13px", color: "#666" },
  itemRow: { display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "14px" },
};