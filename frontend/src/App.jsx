import { useEffect, useState } from "react";
import api from "./api/api";

function App() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    api.get("/products")
    .then(res => {
      setProducts(res.data.content);
    })
    .catch(err => {
      console.error(err);
    });

  }, []);

  return (
    <div>
      <h1>Products</h1>

      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App;