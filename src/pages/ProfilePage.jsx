// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function ProfilePage({ session }) {
  const user = session.user;

  // États pour les infos générales
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '');
  const [infoMsg, setInfoMsg] = useState('');
  const [infoErr, setInfoErr] = useState('');

  // États pour le mot de passe
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passErr, setPassErr] = useState('');

  // États pour l'avatar
  const [avatarUrl, setAvatarUrl] = useState(user.user_metadata?.avatar_url || '');
  const [uploading, setUploading] = useState(false);

  // Sauvegarder le nom
  async function handleSaveInfo(e) {
    e.preventDefault();
    setInfoErr('');
    setInfoMsg('');
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    if (error) setInfoErr(error.message);
    else setInfoMsg('✅ Profil mis à jour !');
  }

  // Changer le mot de passe
  async function handleChangePassword(e) {
    e.preventDefault();
    setPassErr('');
    setPassMsg('');
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) setPassErr(error.message);
    else {
      setPassMsg('✅ Mot de passe mis à jour !');
      setNewPass('');
    }
  }

  // Uploader un avatar
  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert('Erreur : ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  }

  // Envoyer un e-mail de test
  async function sendEmail() {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [user.email],
        subject: '📋 Nouvelle tâche KanbanRT',
        html: `
          <h1>Nouvelle tâche assignée !</h1>
          <p>La tâche <strong>Configurer Supabase</strong> vous a été assignée.</p>
          <p>Statut : <em>À faire</em> · Priorité : <em>Haute</em></p>
          <a href='https://mon-kanban.vercel.app/dashboard'>Voir le tableau →</a>
        `,
      }),
    });

    const result = await response.json();
    if (result.success) {
      console.log('E-mail envoyé ! ID :', result.id);
    } else {
      console.error('Erreur :', result.error);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar session={session} />

      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>

        {/* Section 1 : Infos générales */}
        <h3>Informations générales</h3>
        <p>Email : {user.email}</p>
        <input
          type="text"
          placeholder="Nom complet"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <button onClick={handleSaveInfo}>Sauvegarder</button>
        {infoMsg && <p style={{ color: 'green' }}>{infoMsg}</p>}
        {infoErr && <p style={{ color: 'red' }}>{infoErr}</p>}

        {/* Section 2 : Mot de passe */}
        <h3>Changer le mot de passe</h3>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
        />
        <button onClick={handleChangePassword}>Mettre à jour</button>
        {passMsg && <p style={{ color: 'green' }}>{passMsg}</p>}
        {passErr && <p style={{ color: 'red' }}>{passErr}</p>}

        {/* Section 3 : Avatar */}
        <h3>Avatar (photo de profil)</h3>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{ width: '80px', height: '80px', borderRadius: '50%' }}
          />
        )}
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={uploading}
        />
        {uploading && <p>Upload en cours...</p>}

        {/* Section 4 : Envoi d'e-mail */}
        <h3>Tester l'envoi d'e-mail</h3>
        <button onClick={sendEmail}>Envoyer un e-mail test</button>

      </main>
    </div>
  );
}