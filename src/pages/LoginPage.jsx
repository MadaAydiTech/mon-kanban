// src/pages/LoginPage.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isRegister) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) setError(result.error.message);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem' }}>
      <h2>{isRegister ? '📝 Créer un compte' : '🔐 Connexion'}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type='password'
          placeholder='Mot de passe'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type='submit' style={btnStyle}>
          {loading ? 'En cours...' : isRegister ? 'Créer le compte' : 'Se connecter'}
        </button>
      </form>

      <button
        onClick={() => setIsRegister(!isRegister)}
        style={{ marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#1A8C82' }}
      >
        {isRegister ? 'Déjà un compte ? Connexion' : "Pas de compte ? S'inscrire"}
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  border: '1px solid #CBD5E1',
  borderRadius: '8px',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const btnStyle = {
  width: '100%',
  padding: '0.75rem',
  background: '#1A8C82',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
};