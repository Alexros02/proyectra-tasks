'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Task, TaskResponse } from '@/types/types';
import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || 'http://127.0.0.1:8787';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const rawId = (params as { id?: string | string[] }).id;
  const idParam = Array.isArray(rawId) ? rawId[0] : rawId;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!idParam) throw new Error('Parámetro id inválido');
      const res = await fetch(`${API_BASE}/api/tasks/${idParam}`);
      if (!res.ok) throw new Error('No se encontró la tarea');
      const json = (await res.json()) as TaskResponse;
      setTask(json.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idParam]);

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push('/tasks')}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="Volver atrás"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">Cargando…</p>
      ) : error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : !task ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">No se encontró la tarea.</p>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Creada el {new Date(task.created_at).toLocaleString()}
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
              {task.status.replace('_', ' ')}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                <h2 className="font-semibold text-gray-900 dark:text-white">Descripción</h2>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {task.description}
                </p>
              </section>

              {/* Chat integrado: visible solo desde pendiente en adelante */}
              {['pendiente', 'aceptada', 'en_curso', 'finalizada', 'rechazada'].includes(
                task.status
              ) && (
                <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between">
                      <h2 className="font-semibold text-gray-900 dark:text-white">Chat</h2>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        (se abrirá en la negociación)
                      </span>
                    </summary>
                    <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                      <p>El chat estará disponible en breve (sin realtime en esta fase).</p>
                    </div>
                  </details>
                </section>
              )}
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                <h3 className="font-semibold text-gray-900 dark:text-white">Estado</h3>
                <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>
                    Actual:{' '}
                    <span className="font-medium capitalize">{task.status.replace('_', ' ')}</span>
                  </li>
                  {task.due_date && (
                    <li>Entrega: {new Date(task.due_date).toLocaleDateString()}</li>
                  )}
                </ul>
              </section>

              {/* CTA: pendiente -> aceptar (con confirmación modal); aceptada -> pagar */}
              {task.status === 'pendiente' && (
                <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <button
                    onClick={() => setShowAccept(true)}
                    className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 text-sm font-medium hover:from-emerald-700 hover:to-emerald-800 transition"
                  >
                    Aceptar propuesta
                  </button>
                </section>
              )}
              {task.status === 'aceptada' && (
                <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
                  <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition">
                    Pagar ahora
                  </button>
                </section>
              )}

              {/* Eliminar tarea */}
              <section className="rounded-xl border border-red-300 dark:border-red-800 p-4 bg-red-50 dark:bg-red-900/20 backdrop-blur">
                <h3 className="font-semibold text-red-800 dark:text-red-200">Eliminar</h3>
                <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                  Esta acción no se puede deshacer.
                </p>
                <div className="mt-3">
                  <button
                    disabled={deleting}
                    onClick={() => setShowDelete(true)}
                    className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 text-sm font-medium hover:from-red-700 hover:to-red-800 transition disabled:opacity-60"
                    aria-label="Eliminar tarea"
                  >
                    {deleting ? 'Eliminando…' : 'Eliminar tarea'}
                  </button>
                </div>
              </section>

              {/* Modales reutilizables */}
              <ConfirmModal
                open={showAccept && !!task}
                title="Confirmar aceptación"
                description={
                  task
                    ? `¿Confirmas aceptar la propuesta para "${task.title}"? Podrás proceder al pago a continuación.`
                    : ''
                }
                confirmText={accepting ? 'Aceptando…' : 'Confirmar'}
                cancelText="Cancelar"
                variant="primary"
                busy={accepting}
                onCancel={() => setShowAccept(false)}
                onConfirm={async () => {
                  setAccepting(true);
                  try {
                    const res = await fetch(`${API_BASE}/api/tasks/${idParam}/accept`, {
                      method: 'POST',
                    });
                    if (!res.ok) throw new Error('No se pudo aceptar la propuesta');
                    const json = (await res.json()) as TaskResponse;
                    setTask(json.data);
                    setShowAccept(false);
                  } catch (e) {
                    alert((e as Error).message);
                  } finally {
                    setAccepting(false);
                  }
                }}
              />

              <ConfirmModal
                open={showDelete}
                title="¿Eliminar tarea?"
                description="Esta acción no se puede deshacer. Se eliminará permanentemente."
                confirmText={deleting ? 'Eliminando…' : 'Eliminar'}
                cancelText="Cancelar"
                variant="danger"
                busy={deleting}
                onCancel={() => setShowDelete(false)}
                onConfirm={async () => {
                  setDeleting(true);
                  try {
                    const res = await fetch(`${API_BASE}/api/tasks/${idParam}`, {
                      method: 'DELETE',
                    });
                    if (!res.ok && res.status !== 204)
                      throw new Error('No se pudo eliminar la tarea');
                    setShowDelete(false);
                    router.push('/tasks');
                  } catch (e) {
                    alert((e as Error).message);
                  } finally {
                    setDeleting(false);
                  }
                }}
              />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
