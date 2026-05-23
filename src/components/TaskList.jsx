// src/components/TaskList.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

export default function TaskList({ boardId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories(*)') // jointure automatique !
      .eq('board_id', boardId)
      .order('created_at', { ascending: false });
    if (!error) setTasks(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchTasks(); }, [boardId]);

  async function handleDelete(taskId) {
    if (!confirm('Supprimer cette tâche ?')) return;
    await supabase.from('tasks').delete().eq('id', taskId);
    fetchTasks();
  }

  if (loading) return <div>Chargement des tâches...</div>;

  return (
    <div>
      <TaskForm boardId={boardId} onCreated={fetchTasks} />
      
      <div>
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>

      {tasks.length === 0 && (
        <div>
          Aucune tâche — créez-en une ci-dessus ! 🚀
        </div>
      )}
    </div>
  );
}