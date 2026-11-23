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
  console.log('GraphQL API live at http://localhost:5000/graphql'));s