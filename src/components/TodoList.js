"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import './TodoList.css';

const fixedTodos = [
  { text: "Perguntas Biblicas", completed: false },
  { text: "Imagens do app", completed: false },
  { text: "Instagram", completed: false },
  { text: "Melhorias no app", completed: false },
  { text: "Desenvolver algo novo", completed: false },
  { text: "Ações", completed: false },
  { text: "Estudar(video aula)", completed: false },
];

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select()
      .order('completed', { ascending: true })
      .limit(20);

    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data);
      await addFixedTodosIfNeeded(data);
    }
  };

  const addFixedTodosIfNeeded = async (existingTodos) => {
    const today = new Date().toISOString().split('T')[0];
    const todayTodos = existingTodos.filter(todo => todo.created_at.split('T')[0] === today);

    if (todayTodos.length < fixedTodos.length) {
      const remainingTodos = fixedTodos.slice(todayTodos.length);
      const { data, error } = await supabase
        .from('todos')
        .insert(remainingTodos)
        .select();
        
      if (error) {
        console.error("Error adding fixed todos:", error);
      } else {
        setTodos([...existingTodos, ...data]);
      }
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text: newTodo, completed: false }])
        .select()
        .single();
      if (error) {
        console.error("Error adding todo:", error.message, error.details, error.hint);
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
      .select()
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
    <div className="container">
      <div className="input-group">
        <input 
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          placeholder="Adicionar atividades"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li 
            key={todo.id} 
            onClick={() => toggleTodo(index)} 
            className={todo.completed ? "completed" : ""}
          >
            <span className="task-text">{todo.text}</span>
            <span className="created-at">{new Date(todo.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
