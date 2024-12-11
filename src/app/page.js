import '../app/globals.css';
import TodoList from '../components/TodoList';

export default function Home() {
  return (
    <div>
      <h1>Tarefas Diaria</h1>
      <TodoList />
    </div>
  );
}
