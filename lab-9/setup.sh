#!/usr/bin/env bash
# Creates the REST and GraphQL versions of Program 9 in the folder you run it from.
# Usage:  bash setup.sh
set -e

command -v node >/dev/null || { echo "Install Node.js first."; exit 1; }
if [ -e rest-project ] || [ -e graphql-project ]; then
  echo "rest-project or graphql-project already exists here. Use an empty folder."
  exit 1
fi

# ---------- shared pieces ----------
db() { cat <<'EOF'
{
  "employees": [
    { "id": 1, "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com" },
    { "id": 2, "firstName": "Jane", "lastName": "Smith", "email": "jane.smith@example.com" }
  ]
}
EOF
}

# The screen (JSX) is identical in both versions
ui() { cat <<'EOF'
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
EOF
}

ROOT=$(pwd)

# ---------- 1) REST project ----------
mkdir -p rest-project/employee-api
db > rest-project/employee-api/db.json

cd "$ROOT/rest-project"
npx --yes create-react-app employee-client
cd employee-client
npm install axios

cat > src/App.js <<'EOF'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/employees';
const fields = [['firstName', 'First Name'], ['lastName', 'Last Name'], ['email', 'Email']];
const fetchAll = () => axios.get(API).then(r => r.data);

export default function App() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null); // null = show list, object = show form

  useEffect(() => { fetchAll().then(setList); }, []);

  const save = async e => {
    e.preventDefault();
    await (form.id ? axios.put(`${API}/${form.id}`, form) : axios.post(API, form));
    setForm(null);
    setList(await fetchAll());
  };

  const remove = async id => {
    await axios.delete(`${API}/${id}`);
    setList(await fetchAll());
  };

EOF
ui >> src/App.js

# ---------- 2) GraphQL project ----------
mkdir -p "$ROOT/graphql-project/gql-api"
cd "$ROOT/graphql-project/gql-api"
db > db.json
npm init -y > /dev/null
npm install express graphql-yoga graphql

cat > server.js <<'EOF'
const express = require('express');
const { createYoga, createSchema } = require('graphql-yoga');
const employees = require('./db.json').employees;

const schema = createSchema({
  typeDefs: `
    type Employee { id: ID!, firstName: String!, lastName: String!, email: String! }
    input EmployeeInput { firstName: String!, lastName: String!, email: String! }
    type Query { employees: [Employee!]! }
    type Mutation {
      addEmployee(input: EmployeeInput!): Employee!
      updateEmployee(id: ID!, input: EmployeeInput!): Employee!
      deleteEmployee(id: ID!): ID
    }`,
  resolvers: {
    Query: { employees: () => employees },
    Mutation: {
      addEmployee: (_, { input }) => {
        const e = { id: Date.now(), ...input };
        employees.push(e);
        return e;
      },
      updateEmployee: (_, { id, input }) =>
        Object.assign(employees.find(e => e.id == id), input),
      deleteEmployee: (_, { id }) => {
        employees.splice(employees.findIndex(e => e.id == id), 1);
        return id;
      },
    },
  },
});

express().use('/graphql', createYoga({ schema })).listen(5000, () =>
  console.log('GraphQL API live at http://localhost:5000/graphql'));
EOF

cd "$ROOT/graphql-project"
npx --yes create-react-app gql-client
cd gql-client
npm install axios

cat > src/App.js <<'EOF'
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

EOF
ui >> src/App.js

cd "$ROOT"
echo
echo "All done. Run ONE project at a time (both use ports 5000 and 3000):"
echo
echo "REST"
echo "  terminal 1:  cd rest-project/employee-api && npx json-server --watch db.json --port 5000"
echo "  terminal 2:  cd rest-project/employee-client && npm start"
echo
echo "GraphQL"
echo "  terminal 1:  cd graphql-project/gql-api && node server.js"
echo "  terminal 2:  cd graphql-project/gql-client && npm start"
