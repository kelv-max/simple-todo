import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const urlAPI = 'http://localhost:4000';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${urlAPI}/api`);
    res.render('home.ejs', { todos: response.data });
  } catch (err) {
    res.status(500).send('Error fetching todos');
  }
});

app.get('/add', (req, res) => {
  res.render('create.ejs');
});

app.post('/add/todos', async (req, res) => {
  try {
    await axios.post(`${urlAPI}/api/posts`, req.body);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error adding todo');
  }
});

app.post('/delete', async (req, res) => {
  try {
    await axios.delete(`${urlAPI}/api/${req.body.id}`);
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
