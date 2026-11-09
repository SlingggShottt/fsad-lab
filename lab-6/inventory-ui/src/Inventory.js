import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id: 0, prodname: '', qty: 0, price: 0 });

  useEffect(() => {
    axios.get(API).then(r => setItems(r.data));
  }, []);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    const r = await axios.post(`${API}/add`, form);
    setItems(r.data);
  };

  return (
    <div>
      <h1>Inventory Management</h1>
      <table>
        <thead>
          <tr><th>ID</th><th>Product Name</th><th>Quantity</th><th>Price</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.id}</td><td>{i.prodname}</td><td>{i.qty}</td><td>{i.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add Item</h2>
      {['id', 'prodname', 'qty', 'price'].map(f => (
        <div key={f}>
          {f}: <input name={f} value={form[f]} onChange={change}
                      type={f === 'prodname' ? 'text' : 'number'} />
        </div>
      ))}
      <button onClick={submit}>Submit</button>
    </div>
  );
}