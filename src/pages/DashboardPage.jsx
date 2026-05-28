// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import UserTable from '../components/UserTable';
import TaskList from '../components/TaskList';

export default function DashboardPage({ session }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');
  const [boardId, setBoardId] = useState(null);
  const [boardError, setBoardError] = useState('');

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchBoard() {
      setBoardError('');

      const { data, error } = await supabase
        .from('boards')
        .select('id, title')
        .order('created_at', { ascending: true })
        .limit(1);

      if (error) {
        setBoardError(error.message);
        return;
      }

      if (data && data.length > 0) {
        setBoardId(data[0].id);
      } else {
        setBoardId(null);
      }
    }

    fetchBoard();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar session={session} />

      <main style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[['tasks', '📋 Tâches'], ['users', '👥 Utilisateurs']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: tab === key ? '#1A8C82' : '#E2E8F0',
                color: tab === key ? 'white' : '#1E293B',
                fontWeight: tab === key ? 700 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {boardError && (
          <p style={{ color: '#DC2626', marginBottom: '1rem' }}>
            Erreur board : {boardError}
          </p>
        )}

        {tab === 'tasks' && boardId && <TaskList boardId={boardId} session={session} />}

        {tab === 'tasks' && !boardId && !boardError && (
          <p style={{ color: '#94A3B8' }}>
            Aucun tableau trouvé. Créez-en un via SQL Editor.
          </p>
        )}

        {tab === 'users' &&
          (loading ? (
            <p>Chargement...</p>
          ) : (
            <UserTable users={users} onRefresh={fetchUsers} />
          ))}
      </main>
    </div>
  );
}