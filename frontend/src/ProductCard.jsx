// src/ProductCard.jsx
export default function ProductCard({ product }) {
  const { name, price, description, color, type } = product;

  return (
    <div style={styles.card}>
      {/* Color swatch + type badge */}
      <div style={{ ...styles.swatch, backgroundColor: colorToHex(color) }}>
        <span style={styles.typeBadge}>{type}</span>
      </div>

      <div style={styles.body}>
        <div style={styles.header}>
          <h3 style={styles.name}>{name}</h3>
          <span style={styles.price}>${price.toFixed(2)}</span>
        </div>

        <p style={styles.description}>{description}</p>

        <div style={styles.footer}>
          <span style={styles.colorChip}>
            <span style={{ ...styles.colorDot, backgroundColor: colorToHex(color) }} />
            {color}
          </span>
          <button style={styles.addButton}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}

// Maps color names to hex — extend this as you add more colors
function colorToHex(color) {
  const map = {
    white:  "#f5f5f5",
    black:  "#1a1a1a",
    grey:   "#9ca3af",
    gray:   "#9ca3af",
    beige:  "#e8dcc8",
    navy:   "#1e3a5f",
    blue:   "#3b6ea5",
    red:    "#dc2626",
    green:  "#16a34a",
    yellow: "#eab308",
  };
  return map[color.toLowerCase()] ?? "#cccccc";
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 0.2s",
  },
  swatch: {
    height: "120px",
    display: "flex",
    alignItems: "flex-start",
    padding: "10px",
  },
  typeBadge: {
    background: "rgba(255,255,255,0.85)",
    borderRadius: "20px",
    padding: "2px 10px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#333",
    letterSpacing: "0.3px",
  },
  body: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flexGrow: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "8px",
  },
  name: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
    color: "#111",
  },
  price: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111",
    whiteSpace: "nowrap",
  },
  description: {
    margin: 0,
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.4",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "4px",
  },
  colorChip: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "12px",
    color: "#888",
  },
  colorDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
  addButton: {
    padding: "6px 14px",
    backgroundColor: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
  },
};