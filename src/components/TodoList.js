"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import './TodoList.css';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from('todos').select().order('created_at', { ascending: false });
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text: newTodo, completed: false }])
        .single();
      if (error) {
        console.error("Error adding todo:", error);
      } else {
        setTodos([data, ...todos]);
        setNewTodo("");
      }
    }
  };

  const toggleTodo = async (index) => {
    const todo = todos[index];
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id)
      .single();
    if (error) {
      console.error("Error toggling todo:", error);
    } else {
      const newTodos = [...todos];
      newTodos[index] = data;
      setTodos(newTodos);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={newTodo} 
        onChange={(e) => setNewTodo(e.target.value)} 
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li 
            key={todo.id} 
            onClick={() => toggleTodo(index)} 
            className={todo.completed ? "completed" : ""}
          >
            {todo.text} <span className="created-at">{new Date(todo.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
