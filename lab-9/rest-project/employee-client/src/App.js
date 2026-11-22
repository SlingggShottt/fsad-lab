import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/employees';
const empty = { firstName: '', lastName: '', email: '' };
const fetchAll = () => axios.get(API).then(r => r.data);

export default function App() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);

  useEffect(() => { fetchAll().then(setList); }, []);

  const save = async e => {
    e.preventDefault();
    await (form.id ? axios.put(`${API}/${form.id}`, form) : axios.post(API, form));
    setForm(empty);
    setList(await fetchAll());
  };

  const remove = async id => {
    await axios.delete(`${API}/${id}`);
    setList(await fetchAll());
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <form onSubmit={save}>
        {Object.keys(empty).map(k => (
          <input key={k} placeholder={k} required value={form[k]}
            onChange={e => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <button>{form.id ? 'Update' : 'Add'}</button>
      </form>
      <ul>
        {list.map(e => (
          <li key={e.id}>
            {e.firstName} {e.lastName} ({e.email})
            <button onClick={() => setForm(e)}>Edit</button>
            <button onClick={() => remove(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
