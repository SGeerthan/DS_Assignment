import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get('http://localhost:8080/api/todos/todos');
    setTodos(res.data);
  };

  const addTodo = async () => {
    await axios.post('http://localhost:8080/api/todos/todos', { text });
    setText("");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>To-Do List New</h2>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((t, i) => (
          <li key={i}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
