// Import required modules
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';



// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Store items in memory
let items = [];

// Render the main page with items
app.get('/', (req, res) => {
  res.render('index', { items });
});

// Add an item
app.post('/add', (req, res) => {
  const { item } = req.body;
  if (item) {
    items.push(item);
    res.status(200).send('Item added successfully!');
  } else {
    res.status(400).send('Invalid item!');
  }
});

// Edit an item
app.put('/edit/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { item } = req.body;
  if (items[index] && item) {
    items[index] = item;
    res.status(200).send('Item edited successfully!');
  } else {
    res.status(400).send('Invalid item or index!');
  }
});

// Delete an item
app.delete('/delete/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (items[index] !== undefined) {
    items.splice(index, 1);
    res.status(200).send('Item deleted successfully!');
  } else {
    res.status(400).send('Invalid index!');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
