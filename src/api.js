import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../data.json');

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api', (req, res) => {
  const todos = readData();
  res.json(todos);
});

app.post('/api/posts', (req, res) => {
  const todos = readData();

  const newTodo = {
    id: todos.length + 1,
    text: req.body.task,
  };

  todos.push(newTodo);
  writeData(todos);

  res.status(201).json(newTodo);
});

app.delete('/api/:id', (req, res) => {
  let todos = readData();
  const id = parseInt(req.params.id);

  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });

  todos.splice(index, 1);

  todos = todos.map((todo, idx) => ({
    id: idx + 1,
    text: todo.text
  }));

  writeData(todos);

  res.status(200).json({ message: 'Todo deleted successfully' });
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
