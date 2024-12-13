import TodoList from '../components/TodoList';
import Link from 'next/link';
import '../components/TodoList.css';

export default function Home() {
  return (
    <div>
      <nav style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Link href="/telegram" style={{ padding: '10px 20px', background: '#0070f3', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
          Ir para Atualizações do Telegram
        </Link>
      </nav>
      <h1>Tarefas Diárias</h1>
      <TodoList />
    </div>
  );
}
