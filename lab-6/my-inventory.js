const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors(), express.json());

const inventory = [
  { id: 1, product_name: 'prod1', qty: 12, price: 12 },
  { id: 2, product_name: 'prod2', qty: 1, price: 13 },
  { id: 3, product_name: 'prod3', qty: 10, price: 14 },
  { id: 4, product_name: 'prod4', qty: 19, price: 16 },
];

app.get('/', (req, res) => res.json(inventory));

app.post('/add', (req, res) => {
  inventory.push(req.body);
  res.json(inventory);
});

app.listen(8080, () => console.log('express is working at http://localhost:8080'));