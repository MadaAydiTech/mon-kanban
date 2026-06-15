# KanbanRT 📋

C'est notre projet de fin de semestre pour le module R2.09 en BUT R&T S2.
On a construit une app web de gestion de tâches style Kanban avec React et Supabase.

---

## On est qui ?

- **Adam ABIDERRAHMANE** les composants React, les tâches, le déploiement,orienté TD plutôt,Fonctionnalité Pomodoro
- **Maxence DABOIT** la base de données Supabase, l'auth, la navbar, le projet le plus développé surtout avec la fonctionnalité Pomodoro

---

## C'est quoi l'appli ?

Un tableau Kanban en ligne. Tu te connectes, tu crées des tâches, tu les organises entre 4 colonnes :
**À faire → En cours → Validation → Terminée**

On a aussi ajouté un **timer Pomodoro** intégré directement dans le dashboard pour bosser par sessions de 25 min, avec les pauses courtes et longues. C'est notre fonctionnalité libre.

---

## Lien de l'app déployée

**A METTRE LIEN**

---

## Les technos qu'on a utilisées

| Outil | À quoi ça sert |
|---|---|
| React + Vite | l'interface utilisateur |
| React Router | naviguer entre les pages sans rechargement |
| Supabase | base de données PostgreSQL + auth JWT |
| Vercel | hébergement + déploiement automatique |
| Resend | envoi d'emails transactionnels |
| GitHub | versioning et collaboration |

---

## Lancer le projet en local

```bash
# 1. Cloner le repo
git clone https://github.com/MadaAydiTech/mon-kanban.git
git clone https://github.com/maxdaboit/mon-kanban
cd mon-kanban

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de config (ne jamais le commiter !)
cp .env.example .env.local
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
# (tu les trouves dans ton projet Supabase > Settings > API)

# 4. Lancer l'app
npm run dev
# → http://localhost:5173
```

> ⚠️ Pour tester l'envoi d'email, remplace `npm run dev` par `vercel dev`
> (installe vercel d'abord avec `npm install -g vercel`)

---

## Ce que l'app permet de faire

- Créer un compte et se connecter (Supabase Auth)
- Dashboard protégé — impossible d'y accéder sans être connecté
- Voir ses tâches organisées en 4 colonnes Kanban
- Créer une tâche : titre, description, priorité, catégorie, date limite
- Supprimer une tâche avec confirmation
- Badges de priorité et statut avec couleurs cohérentes
- Modifier son profil et uploader un avatar
- Timer Pomodoro intégré (fonctionnalité libre) — sessions enregistrées en BDD
- Recevoir un email automatique à la création d'une tâche (via Resend)
- Gestion des utilisateurs (onglet admin)
- Se déconnecter — redirige vers /login

---

## Structure des fichiers

```
mon-kanban/
├── api/
│   └── send-email.js         → API Route Vercel pour envoyer les emails
├── src/
│   ├── lib/
│   │   └── supabase.js       → connexion à Supabase (clés via .env.local)
│   ├── pages/
│   │   ├── LoginPage.jsx     → page de connexion et d'inscription
│   │   └── DashboardPage.jsx → le tableau de bord principal
│   ├── components/
│   │   ├── Navbar.jsx        → barre de navigation + déconnexion
│   │   ├── TaskCard.jsx      → une carte de tâche avec ses badges
│   │   ├── TaskForm.jsx      → formulaire pour créer une tâche
│   │   ├── TaskList.jsx      → les colonnes + chargement depuis Supabase
│   │   └── UserTable.jsx     → tableau des utilisateurs
│   ├── App.jsx               → routeur React Router + protection des routes
│   └── main.jsx
├── .env.local                → ⚠️ jamais commiter — clés Supabase
├── .gitignore
├── package.json
└── README.md
```

---

## Schéma BDD (résumé)

6 tables sur Supabase (PostgreSQL) :

- `auth.users` géré automatiquement par Supabase Auth
- `profiles` infos de l'utilisateur (nom, avatar, rôle)
- `boards` les tableaux Kanban
- `categories` les catégories de tâches
- `tasks` les tâches avec statut, priorité, deadline, FK vers board et category
- `pomodoro_sessions` sessions de travail enregistrées (fonctionnalité libre)

Row Level Security (RLS) activé sur toutes les tables.

---

## Sécurité

- Les clés Supabase sont dans `.env.local` — jamais dans le code source
- Seule la clé `anon` est utilisée côté client (jamais la `service_role`)
- RLS activé sur Supabase pour que chaque utilisateur ne voit que ses données
- `.env.local` est dans `.gitignore` — vérifier avec `git status` avant chaque push

---

## Difficultés rencontrées

**RLS bloquait les tâches** après avoir créé des tâches via SQL Editor, TaskList affichait "Aucune tâche". C'était le Row Level Security sans politique SELECT définie. Solution : ajouter la bonne politique RLS.

**Variables d'env absentes sur Vercel** page blanche en prod avec `supabaseUrl is required`. Il faut ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` manuellement dans Vercel > Settings > Environment Variables.

**API Route email en 404 en local** Vite ne gère pas les fonctions serverless du dossier `/api`. Solution : utiliser `vercel dev` à la place de `npm run dev`.

---

*Projet réaliser au sein de l'IUT de Roanne par Adam et Maxence*