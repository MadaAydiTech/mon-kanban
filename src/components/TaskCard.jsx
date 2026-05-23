// src/components/TaskCard.jsx
import React from 'react';

// Couleurs selon la priorité
const PRIORITY_COLORS = {
  high: { bg: '#FEF2F2', border: '#DC2626', label: '🔴 Haute' },
  medium: { bg: '#FFFBEB', border: '#F59E0B', label: '🟡 Moyenne' },
  low: { bg: '#F0FDF4', border: '#16A34A', label: '🟢 Basse' },
};

// Libellés selon le statut
const STATUS_LABELS = {
  todo: { label: '📋 À faire', color: '#64748B' },
  in_progress: { label: '⚙ En cours', color: '#3B82F6' },
  review: { label: '👀 Validation', color: '#F59E0B' },
  done: { label: '✅ Terminée', color: '#16A34A' },
};

export default function TaskCard({ task, onDelete }) {
  const priority = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low;
  const status = STATUS_LABELS[task.status] || STATUS_LABELS.todo;

  // Formater la date d'échéance
  const dueLabel = task.due_date
    ? new Date(task.due_date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    : null;

  // Vérifier si la tâche est en retard
  const isOverdue = task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== 'done';

  return (
    <div style={{ border: `1px solid ${priority.border}`, backgroundColor: priority.bg, padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
      
      {/* En-tête : titre + bouton supprimer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>{task.title}</h4>
        <button 
          onClick={() => onDelete(task.id)}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94A3B8', fontSize: '1.1rem', padding: '0' 
          }}
        >
          ✕
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p>{task.description}</p>
      )}

      {/* Badges */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        
        {/* Statut */}
        <span style={{ color: status.color }}>
          {status.label}
        </span>

        {/* Priorité */}
        <span>
          {priority.label}
        </span>

        {/* Catégorie */}
        {task.categories && (
          <span>
            🏷️ {task.categories.name}
          </span>
        )}

        {/* Date d'échéance */}
        {dueLabel && (
          <span>
            📅 {isOverdue ? '⚠️ ' : ''}{dueLabel}
          </span>
        )}
        
      </div>

    </div>
  );
}