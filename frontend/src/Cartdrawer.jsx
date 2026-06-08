// src/CartDrawer.jsx
import { useState } from "react";
import { useCart } from "./CartContext";
import CheckoutDrawer from "./CheckoutDrawer";

export default function CartDrawer({ open, onClose }) {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function colorToHex(color) {
    const map = {
      white: "#f5f5f5", black: "#1a1a1a", grey: "#9ca3af", gray: "#9ca3af",
      beige: "#e8dcc8", navy: "#1e3a5f", blue: "#3b6ea5", red: "#dc2626",
      green: "#16a34a", yellow: "#eab308",
    };
    return map[color?.toLowerCase()] ?? "#cccccc";
  }

  return (
    <>
      {open && <div onClick={onClose} style={styles.backdrop} />}

      <div style={{ ...styles.drawer, transform: open ? "translateX(0)" : "translateX(100%)" }}>
        <div style={styles.header}>
          <h2 style={styles.title}>Your Cart</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {items.length === 0 && (
          <p style={styles.empty}>Your cart is empty.</p>
        )}

        <div style={styles.itemList}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} style={styles.item}>
              <div style={{ ...styles.itemSwatch, backgroundColor: colorToHex(product.color) }} />
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{product.name}</span>
                <span style={styles.itemColor}>{product.color}</span>
              </div>
              <div style={styles.itemRight}>
                <div style={styles.qtyControls}>
                  <button style={styles.qtyBtn} onClick={() => updateQuantity(product.id, quantity - 1)}>−</button>
                  <span style={styles.qtyNum}>{quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
                </div>
                <span style={styles.itemPrice}>${(product.price * quantity).toFixed(2)}</span>
                <button style={styles.removeBtn} onClick={() => removeFromCart(product.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { onClose(); setCheckoutOpen(true); }}
              style={styles.checkoutBtn}
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout opens as a separate drawer after cart closes */}
      <CheckoutDrawer
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}

const styles = {
  backdrop: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 100 },
  drawer: {
    position: "fixed", top: 0, right: 0, bottom: 0,
    width: "380px", maxWidth: "100vw", backgroundColor: "#fff",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", zIndex: 101,
    display: "flex", flexDirection: "column", transition: "transform 0.3s ease",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1.25rem 1.5rem", borderBottom: "1px solid #eee",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: "600", color: "#111" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#888" },
  empty: { textAlign: "center", color: "#aaa", marginTop: "3rem", fontSize: "15px" },
  itemList: { flexGrow: 1, overflowY: "auto", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" },
  item: { display: "flex", alignItems: "center", gap: "12px" },
  itemSwatch: { width: "40px", height: "40px", borderRadius: "8px", flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)" },
  itemInfo: { flexGrow: 1, display: "flex", flexDirection: "column", gap: "2px" },
  itemName: { fontSize: "14px", fontWeight: "500", color: "#111" },
  itemColor: { fontSize: "12px", color: "#888" },
  itemRight: { display: "flex", alignItems: "center", gap: "10px" },
  qtyControls: { display: "flex", alignItems: "center", gap: "6px" },
  qtyBtn: {
    width: "24px", height: "24px", border: "1px solid #ddd", borderRadius: "4px",
    background: "#fff", cursor: "pointer", fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  qtyNum: { fontSize: "14px", fontWeight: "500", minWidth: "16px", textAlign: "center" },
  itemPrice: { fontSize: "14px", fontWeight: "600", color: "#111", minWidth: "52px", textAlign: "right" },
  removeBtn: { background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "13px" },
  footer: { padding: "1.25rem 1.5rem", borderTop: "1px solid #eee", display: "flex", flexDirection: "column", gap: "12px" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: "15px", color: "#555" },
  totalPrice: { fontSize: "18px", fontWeight: "700", color: "#111" },
  checkoutBtn: {
    padding: "0.8rem", backgroundColor: "#111", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "500", cursor: "pointer",
  },
};