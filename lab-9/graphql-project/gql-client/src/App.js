import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const gql = (query, variables) =>
  axios.post('http://localhost:5000/graphql', { query, variables }).then(r => r.data.data);
const fields = [['firstName', 'First Name'], ['lastName', 'Last Name'], ['email', 'Email']];
const fetchAll = () =>
  gql('{ employees { id firstName lastName email } }').then(d => d.employees);

export default function App() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null); // null = show list, object = show form

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
    setForm(null);
    setList(await fetchAll());
  };

  const remove = async id => {
    await gql('mutation($id: ID!) { deleteEmployee(id: $id) }', { id });
    setList(await fetchAll());
  };

  if (form) return (
    <form onSubmit={save}>
      <h2>{form.id ? 'Edit Employee' : 'Add Employee'}</h2>
      {fields.map(([k, label]) => (
        <input key={k} name={k} placeholder={label} required value={form[k]}
          onChange={e => setForm({ ...form, [k]: e.target.value })} />
      ))}
      <button type="submit">Save</button>
      <button type="button" onClick={() => setForm(null)}>Cancel</button>
    </form>
  );

  return (
    <div className="container">
      <h2>Employees List</h2>
      <button onClick={() => setForm({ firstName: '', lastName: '', email: '' })}>Add Employee</button>
      <table>
        <thead>
          <tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {list.map(e => (
            <tr key={e.id}>
              <td>{e.firstName}</td><td>{e.lastName}</td><td>{e.email}</td>
              <td>
                <button onClick={() => setForm(e)}>Edit</button>
                <button onClick={() => remove(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
