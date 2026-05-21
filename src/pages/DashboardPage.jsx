// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import UserTable from '../components/UserTable';

export default function DashboardPage({ session }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🗂 KanbanRT — Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>{session.user.email}</span>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>

      <h2>👥 Utilisateurs inscrits</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
}