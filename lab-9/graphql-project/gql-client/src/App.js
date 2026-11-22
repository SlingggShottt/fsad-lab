import { useState, useEffect } from 'react';
import axios from 'axios';

const gql = (query, variables) =>
  axios.post('http://localhost:5000/graphql', { query, variables }).then(r => r.data.data);
const fetchAll = () =>
  gql('{ employees { id firstName lastName email } }').then(d => d.employees);
const empty = { firstName: '', lastName: '', email: '' };

export default function App() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);

  useEffect(() => { fetchAll().then(setList); }, []);

  const save = async e => {
    e.preventDefault();
    const { id, ...input } = form;
    await gql(
      id
        ? 'mutation($id: ID!, $input: EmployeeInput!) { updateEmployee(id: $id, input: $input) { id } }'
        : 'mutation($input: EmployeeInput!) { addEmployee(input: $input) { id } }',
      { id, input }
    );
    setForm(empty);
    setList(await fetchAll());
  };

  const remove = async id => {
    await gql('mutation($id: ID!) { deleteEmployee(id: $id) }', { id });
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
