// src/pages/DashboardPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import UserTable from '../components/UserTable';
import TaskList from '../components/TaskList';

function PomodoroTimer({ session }) {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isRunning, timeLeft]);

  // Session terminée
  useEffect(() => {
    if (timeLeft > 0) return;

    if (mode === 'work') {
      const nextCount = completedWorkSessions + 1;
      setCompletedWorkSessions(nextCount);

      if (nextCount % 4 === 0) {
        setMode('long');
        setTimeLeft(longBreakMinutes * 60);
      } else {
        setMode('short');
        setTimeLeft(shortBreakMinutes * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(workMinutes * 60);
    }
    setIsRunning(false);
  }, [timeLeft]);

  function resetTimer() {
    setIsRunning(false);
    if (mode === 'work') setTimeLeft(workMinutes * 60);
    if (mode === 'short') setTimeLeft(shortBreakMinutes * 60);
    if (mode === 'long') setTimeLeft(longBreakMinutes * 60);
  }

  function switchMode(newMode) {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') setTimeLeft(workMinutes * 60);
    if (newMode === 'short') setTimeLeft(shortBreakMinutes * 60);
    if (newMode === 'long') setTimeLeft(longBreakMinutes * 60);
  }

  const modeLabel = mode === 'work' ? 'Focus' : mode === 'short' ? 'Pause courte' : 'Pause longue';

  const totalSeconds = useMemo(() => {
    if (mode === 'work') return workMinutes * 60;
    if (mode === 'short') return shortBreakMinutes * 60;
    return longBreakMinutes * 60;
  }, [mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  function fmt(s) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  const GREEN = '#1A8C82';
  const LIGHT_GREEN = '#E6F4F3';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem', alignItems: 'start' }}>

      {/* ── Timer ── */}
      <div style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>

        {/* Header */}
        <div>
          <span style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '999px',
            background: LIGHT_GREEN,
            color: GREEN,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            Focus Timer
          </span>
          <h2 style={{ margin: 0, color: '#1E293B', fontSize: '1.4rem', fontWeight: 700 }}>Pomodoro</h2>
          <p style={{ marginTop: '6px', color: '#64748B', fontSize: '0.95rem' }}>
            Alternez périodes de concentration et pauses.
          </p>
        </div>

        {/* Onglets mode */}
        <div style={{
          display: 'inline-flex',
          gap: '6px',
          padding: '5px',
          borderRadius: '999px',
          background: '#F1F5F9',
          border: '1px solid #E2E8F0',
          alignSelf: 'flex-start',
          flexWrap: 'wrap',
        }}>
          {[['work', 'Focus'], ['short', 'Pause courte'], ['long', 'Pause longue']].map(([key, label]) => (
            <button key={key} onClick={() => switchMode(key)} style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: mode === key ? `1px solid ${GREEN}` : '1px solid transparent',
              background: mode === key ? GREEN : 'transparent',
              color: mode === key ? '#fff' : '#64748B',
              fontWeight: mode === key ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Cercle timer */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: `conic-gradient(${GREEN} ${progress}%, #E2E8F0 ${progress}% 100%)`,
            padding: '12px',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#fff',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                {modeLabel}
              </span>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.06em', lineHeight: 1 }}>
                {fmt(timeLeft)}
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.88rem', color: isRunning ? GREEN : '#94A3B8', fontWeight: 600 }}>
                {isRunning ? '⏱ Session en cours' : 'Prêt à démarrer'}
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setIsRunning(true)} style={{
            padding: '10px 22px', borderRadius: '8px', border: 'none',
            background: GREEN, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
          }}>
            ▶ Démarrer
          </button>
          <button onClick={() => setIsRunning(false)} style={{
            padding: '10px 22px', borderRadius: '8px',
            border: '1px solid #E2E8F0', background: '#F8FAFC',
            color: '#1E293B', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
          }}>
            ⏸ Pause
          </button>
          <button onClick={resetTimer} style={{
            padding: '10px 22px', borderRadius: '8px',
            border: '1px solid #E2E8F0', background: 'transparent',
            color: '#94A3B8', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
          }}>
            ↺ Réinitialiser
          </button>
        </div>
      </div>

      {/* ── Panneau droite ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Réglages */}
        <div style={{
          background: '#fff', border: '1px solid #E2E8F0',
          borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <h3 style={{ margin: 0, color: '#1E293B', fontSize: '1.1rem', fontWeight: 700 }}>⚙️ Réglages</h3>

          {[
            ['Focus (min)', workMinutes, (v) => { setWorkMinutes(Number(v)); if (mode === 'work') setTimeLeft(Number(v) * 60); }, 120],
            ['Pause courte (min)', shortBreakMinutes, (v) => { setShortBreakMinutes(Number(v)); if (mode === 'short') setTimeLeft(Number(v) * 60); }, 60],
            ['Pause longue (min)', longBreakMinutes, (v) => { setLongBreakMinutes(Number(v)); if (mode === 'long') setTimeLeft(Number(v) * 60); }, 90],
          ].map(([label, val, onChange, max]) => (
            <label key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#1E293B', fontWeight: 600, fontSize: '0.88rem' }}>
              {label}
              <input type="number" min="1" max={max} value={val}
                onChange={(e) => onChange(e.target.value)}
                style={{
                  padding: '10px 12px', borderRadius: '8px',
                  border: '1px solid #E2E8F0', background: '#F8FAFC',
                  color: '#1E293B', fontSize: '0.95rem', outline: 'none',
                }}
              />
            </label>
          ))}

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
            {[['Mode actuel', modeLabel], ['Sessions focus', completedWorkSessions]].map(([label, val]) => (
              <div key={label} style={{
                padding: '14px', borderRadius: '10px',
                background: LIGHT_GREEN, border: `1px solid ${GREEN}22`,
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}>
                <span style={{ fontSize: '0.72rem', color: GREEN, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                <strong style={{ fontSize: '1.1rem', color: '#1E293B', fontWeight: 700 }}>{val}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

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

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    async function fetchBoard() {
      setBoardError('');
      const { data, error } = await supabase
        .from('boards')
        .select('id, title')
        .order('created_at', { ascending: true })
        .limit(1);
      if (error) { setBoardError(error.message); return; }
      if (data && data.length > 0) setBoardId(data[0].id);
      else setBoardId(null);
    }
    fetchBoard();
  }, []);

  const TABS = [
    ['tasks', '📋 Tâches'],
    ['pomodoro', 'Pomodoro'],
    ['users', '👥 Utilisateurs'],
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar session={session} />

      <main style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {TABS.map(([key, label]) => (
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
          <p style={{ color: '#DC2626', marginBottom: '1rem' }}>Erreur board : {boardError}</p>
        )}

        {tab === 'tasks' && boardId && <TaskList boardId={boardId} session={session} />}
        {tab === 'tasks' && !boardId && !boardError && (
          <p style={{ color: '#94A3B8' }}>Aucun tableau trouvé. Créez-en un via SQL Editor.</p>
        )}

        {tab === 'pomodoro' && <PomodoroTimer session={session} />}

        {tab === 'users' && (
          loading ? <p>Chargement...</p> : <UserTable users={users} onRefresh={fetchUsers} />
        )}
      </main>
    </div>
  );
}