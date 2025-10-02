'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateTaskDTO, TaskResponse } from '@/types/types';
import { useRouter } from 'next/navigation';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'http://127.0.0.1:8787';

export default function NewTaskPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user?.uid) {
      setError('Debes iniciar sesión');
      return;
    }
    if (title.trim().length < 1 || title.trim().length > 120) {
      setError('El título debe tener entre 1 y 120 caracteres');
      return;
    }
    if (description.trim().length < 20) {
      setError('La descripción debe tener al menos 20 caracteres');
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateTaskDTO = {
        clientId: user.uid,
        title: title.trim(),
        description: description.trim(),
        categoryId,
      };
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('No se pudo crear la tarea');
      }
      const json = (await res.json()) as TaskResponse;
      router.push(`/tasks/${json.data.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crear tarea</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Inicia sesión para crear una tarea.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crear tarea</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="title"
          >
            Título
          </label>
          <input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ej. Sitio web landing para producto"
            aria-label="Título de la tarea"
          />
          <p className="mt-1 text-xs text-gray-500">1 a 120 caracteres</p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="description"
          >
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 min-h-32"
            placeholder="Describe el alcance, requisitos y resultados esperados"
            aria-label="Descripción de la tarea"
          />
          <p className="mt-1 text-xs text-gray-500">Mínimo 20 caracteres</p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="category"
          >
            Categoría
          </label>
          <select
            id="category"
            value={categoryId ?? ''}
            onChange={e => setCategoryId(e.target.value || null)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Categoría de la tarea"
          >
            <option value="">Seleccionar</option>
            <option value="reparaciones">Reparaciones</option>
            <option value="web">Desarrollo web</option>
            <option value="diseno">Diseño</option>
          </select>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-60"
          >
            {submitting ? 'Creando…' : 'Crear tarea'}
          </button>
        </div>
      </form>
    </div>
  );
}

