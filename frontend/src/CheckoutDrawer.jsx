// src/CheckoutDrawer.jsx
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import api from "./api/api";

export default function CheckoutDrawer({ open, onClose }) {
  const { items, totalPrice, clearCart } = useCart();

  const [step, setStep] = useState("address");
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", street: "", city: "", zipCode: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep("address");
    setSelectedId(null);
    setError("");
    api.get("/api/addresses")
      .then(res => {
        setAddresses(res.data);
        if (res.data.length === 0) {
          setShowForm(true);
        } else {
          setSelectedId(res.data[0].id); // auto-select first address
        }
      })
      .catch(err => {
        const status = err.response?.status;
        setError(`Could not load addresses (${status})`);
      });
  }, [open]);

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSaveAddress(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/addresses", form);
      setAddresses(prev => [...prev, res.data]);
      setSelectedId(res.data.id);
      setShowForm(false);
      setForm({ fullName: "", phone: "", street: "", city: "", zipCode: "", country: "" });
    } catch (err) {
      setError(err.response?.data?.error || `Could not save address (${err.response?.status})`);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    console.log("selectedId:", selectedId);
    console.log("items:", items);
    setError("");
    setLoading(true);
    try {
      const payload = {
        addressId: selectedId,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      };
      await api.post("/api/orders", payload);
      clearCart();
      setStep("success");
    } catch (err) {
      setError(err.response?.data?.error || `Failed to place order (${err.response?.status})`);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setStep("address");
    setShowForm(false);
    setError("");
    onClose();
  }

  const selectedAddress = addresses.find(a => a.id === selectedId);

  return (
    <>
      {open && <div onClick={handleClose} style={styles.backdrop} />}

      <div style={{ ...styles.drawer, transform: open ? "translateX(0)" : "translateX(100%)" }}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {step === "address" && "Checkout"}
            {step === "confirm" && "Confirm order"}
            {step === "success" && "Order placed!"}
          </h2>
          <button onClick={handleClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* ── STEP: address ── */}
        {step === "address" && (
          <div style={styles.body}>
            <p style={styles.sectionLabel}>Delivery address</p>

            {addresses.map(addr => (
              <div
                key={addr.id}
                onClick={() => setSelectedId(addr.id)}
                style={{
                  ...styles.addressCard,
                  borderColor: selectedId === addr.id ? "#111" : "#e5e7eb",
                  backgroundColor: selectedId === addr.id ? "#f9f9f9" : "#fff",
                }}
              >
                <div style={styles.radioRow}>
                  <div style={{ ...styles.radio, borderColor: selectedId === addr.id ? "#111" : "#ccc" }}>
                    {selectedId === addr.id && <div style={styles.radioDot} />}
                  </div>
                  <div>
                    <p style={styles.addrName}>{addr.fullName} · {addr.phone}</p>
                    <p style={styles.addrLine}>{addr.street}, {addr.city} {addr.zipCode}</p>
                    <p style={styles.addrLine}>{addr.country}</p>
                  </div>
                </div>
              </div>
            ))}

            {!showForm && (
              <button onClick={() => setShowForm(true)} style={styles.addAddrBtn}>
                + Add new address
              </button>
            )}

            {showForm && (
              <form onSubmit={handleSaveAddress} style={styles.form}>
                <p style={styles.sectionLabel}>New address</p>
                {[
                  ["fullName", "Full name"],
                  ["phone",    "Phone"],
                  ["street",   "Street"],
                  ["city",     "City"],
                  ["zipCode",  "ZIP / Postal code"],
                  ["country",  "Country"],
                ].map(([field, label]) => (
                  <label key={field} style={styles.label}>
                    {label}
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleFormChange}
                      required
                      style={styles.input}
                    />
                  </label>
                ))}
                <div style={styles.btnRow}>
                  <button type="submit" disabled={loading} style={styles.primaryBtn}>
                    {loading ? "Saving…" : "Save address"}
                  </button>
                  {addresses.length > 0 && (
                    <button type="button" onClick={() => setShowForm(false)} style={styles.ghostBtn}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {error && <p style={styles.error}>{error}</p>}

            {selectedId && !showForm && (
              <div style={styles.stickyFooter}>
                <button onClick={() => setStep("confirm")} style={styles.primaryBtn}>
                  Continue to confirm
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP: confirm ── */}
        {step === "confirm" && (
          <div style={styles.body}>
            <p style={styles.sectionLabel}>Delivering to</p>
            {selectedAddress && (
              <div style={styles.confirmAddr}>
                <p style={{ fontWeight: 600, margin: 0 }}>{selectedAddress.fullName}</p>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>{selectedAddress.phone}</p>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  {selectedAddress.street}, {selectedAddress.city} {selectedAddress.zipCode}, {selectedAddress.country}
                </p>
              </div>
            )}

            <p style={{ ...styles.sectionLabel, marginTop: "1.25rem" }}>Order summary</p>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={styles.summaryRow}>
                <span style={styles.summaryName}>
                  {product.name} <span style={{ color: "#888" }}>× {quantity}</span>
                </span>
                <span style={styles.summaryPrice}>${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ ...styles.summaryRow, borderTop: "1px solid #eee", paddingTop: "12px", marginTop: "4px" }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: "17px" }}>${totalPrice.toFixed(2)}</span>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            {/* Fixed button row — back is small, place order takes remaining space */}
            <div style={styles.stickyFooter}>
              <button onClick={() => setStep("address")} style={styles.ghostBtn}>
                Back
              </button>
              <button onClick={handlePlaceOrder} disabled={loading} style={styles.primaryBtn}>
                {loading ? "Placing…" : "Place order"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: success ── */}
        {step === "success" && (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <p style={styles.successText}>Order placed successfully!</p>
            <button onClick={handleClose} style={{ ...styles.primaryBtn, flexGrow:0, width: "auto", padding: "0.6rem 2rem" }}>
              Continue shopping
            </button>
          </div>
        )}
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
    transition: "transform 0.3s ease",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1.25rem 1.5rem", borderBottom: "1px solid #eee",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: "600", color: "#111" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#888" },
  body: {
    flexGrow: 1, overflowY: "auto", padding: "1.25rem 1.5rem",
    display: "flex", flexDirection: "column", gap: "12px",
  },
  sectionLabel: {
    margin: 0, fontSize: "12px", fontWeight: "600",
    color: "#888", textTransform: "uppercase", letterSpacing: "0.5px",
  },
  addressCard: {
    border: "2px solid", borderRadius: "8px", padding: "12px",
    cursor: "pointer", transition: "border-color 0.15s",
  },
  radioRow: { display: "flex", gap: "12px", alignItems: "flex-start" },
  radio: {
    width: "18px", height: "18px", borderRadius: "50%", border: "2px solid",
    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px",
  },
  radioDot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#111" },
  addrName: { margin: 0, fontSize: "14px", fontWeight: "500", color: "#111" },
  addrLine: { margin: 0, fontSize: "13px", color: "#666" },
  addAddrBtn: {
    background: "none", border: "1px dashed #ccc", borderRadius: "8px",
    padding: "10px", fontSize: "14px", color: "#555", cursor: "pointer", textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "#444", fontWeight: "500" },
  input: { padding: "8px 10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" },
  confirmAddr: {
    background: "#f9f9f9", borderRadius: "8px", padding: "12px",
    display: "flex", flexDirection: "column", gap: "4px",
  },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" },
  summaryName: { fontSize: "14px", color: "#111" },
  summaryPrice: { fontSize: "14px", fontWeight: "500", color: "#111" },
  stickyFooter: {
    display: "flex", gap: "8px",
    marginTop: "auto", paddingTop: "1rem",
  },
  btnRow: { display: "flex", gap: "8px" },
  // Primary button — grows to fill available space in a flex row
  primaryBtn: {
    flexGrow: 1,
    padding: "0.75rem 1rem",
    backgroundColor: "#111", color: "#fff",
    border: "none", borderRadius: "8px",
    fontSize: "15px", fontWeight: "500", cursor: "pointer",
  },
  // Ghost button — fixed width, doesn't grow
  ghostBtn: {
    flexGrow: 0,
    flexShrink: 0,
    padding: "0.75rem 1.25rem",
    backgroundColor: "transparent", color: "#111",
    border: "1px solid #ddd", borderRadius: "8px",
    fontSize: "15px", cursor: "pointer",
    whiteSpace: "nowrap",
  },
  error: {
    color: "#dc2626", fontSize: "13px",
    background: "#fef2f2", padding: "8px 12px", borderRadius: "6px", margin: 0,
  },
  successBox: {
    flexGrow: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "16px", padding: "2rem",
  },
  successIcon: {
    width: "56px", height: "56px", borderRadius: "50%",
    backgroundColor: "#dcfce7", color: "#16a34a",
    fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center",
  },
  successText: { fontSize: "16px", color: "#111", fontWeight: "500", margin: 0 },
};