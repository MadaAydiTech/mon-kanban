import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Navbar({ session }) {
  const location = useLocation();
  const avatarUrl = session?.user?.user_metadata?.avatar_url;

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function linkStyle(path) {
    const isActive = location.pathname === path;

    return {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: isActive ? 700 : 400,
      background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
      color: 'white',
    };
  }

  return (
    <nav
      style={{
        background: '#1A8C82',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <strong style={{ color: 'white' }}>KanbanRT</strong>

        <Link to="/dashboard" style={linkStyle('/dashboard')}>
          Dashboard
        </Link>

        <Link to="/profile" style={linkStyle('/profile')}>
          Mon profil
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid white',
            }}
          />
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {session?.user?.email?.[0]?.toUpperCase() || '?'}
          </div>
        )}

        <span style={{ color: 'white', fontSize: '0.95rem' }}>
          {session?.user?.email}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: 'white',
            color: '#1A8C82',
            border: 'none',
            borderRadius: '6px',
            padding: '0.45rem 0.9rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}