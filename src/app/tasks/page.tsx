'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { Task, TaskStatus, TasksListResponse } from '@/types/types';
import TaskCard from '@/components/TaskCard';

const TABS: { key: TaskStatus | 'todas'; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'en_revision', label: 'En revisión' },
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'aceptada', label: 'Aceptada' },
  { key: 'en_curso', label: 'En curso' },
  { key: 'finalizada', label: 'Finalizada' },
  { key: 'rechazada', label: 'Rechazada' },
];

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'http://127.0.0.1:8787';

export default function TasksPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TASK_TAB>('todas');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  type TASK_TAB = (typeof TABS)[number]['key'];

  const fetchTasks = async (tab: TASK_TAB) => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ clientId: user.uid });
      if (tab !== 'todas') params.set('status', tab);
      const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`);
      const json = (await res.json()) as TasksListResponse;
      setTasks(json.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTasks(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, activeTab]);

  const emptyText = useMemo(() => {
    switch (activeTab) {
      case 'todas':
        return 'No hay tareas aún. Crea tu primera tarea.';
      case 'en_revision':
        return 'No hay tareas en revisión.';
      case 'pendiente':
        return 'No tienes propuestas pendientes.';
      case 'aceptada':
        return 'No hay tareas aceptadas.';
      case 'en_curso':
        return 'No hay tareas en curso.';
      case 'finalizada':
        return 'No hay tareas finalizadas.';
      case 'rechazada':
        return 'No hay tareas rechazadas.';
      default:
        return 'No hay resultados.';
    }
  }, [activeTab]);

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tus tareas</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Inicia sesión para ver tus tareas.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tus tareas</h1>
        <Link
          href="/tasks/new"
          className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition"
          aria-label="Crear nueva tarea"
          tabIndex={0}
        >
          Nueva tarea
        </Link>
      </div>

      <div className="mt-6 border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex flex-wrap gap-2" aria-label="Tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={
                `px-3 py-2 text-sm font-medium rounded-t-md border-b-2 ` +
                (activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:border-blue-600')
              }
              aria-label={`Filtrar ${tab.label}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">Cargando…</p>
        ) : tasks.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">{emptyText}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
