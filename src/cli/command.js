import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../../data.json');

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

const command = process.argv[2];
const todoId = parseInt(process.argv[3]);
const todos = readData();

switch (command) {
  case 'show': {
    console.log('Todo List: ');
    todos.forEach(element => {
      console.log('- ' + element.text);
    });
    break;
  };
  case 'add': {
    const newTodo = {
      id: todos.length + 1,
      text: process.argv.slice(3).join(' ')
    };

    todos.push(newTodo);
    writeData(todos);

    console.log('Todo added:', newTodo);
    break;
  }; 
  case 'update': {

  };
  case 'delete': {
    const searchId = todos.findIndex((todo) => todo.id === todoId);
    todos.splice(searchId, 1);

    todos.map((todo, idx) => ({
      id: idx + 1,
      text: todo.text
    }))
    writeData(todos);
    console.log(`Todo number ${searchId} deleted.`)
    break;
  };
  default:
    console.log('error');
}

