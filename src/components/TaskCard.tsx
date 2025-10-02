'use client';

import Link from 'next/link';
import type { Task } from '@/types/types';
import { useRouter } from 'next/navigation';
import { FileClock, Clock, CheckCircle2, Hammer, BadgeCheck, XCircle } from 'lucide-react';
type Props = { task: Task };

const statusBadge = (status: Task['status']) => {
  const common = 'text-xs px-2 py-1 rounded-full capitalize';
  switch (status) {
    case 'en_revision':
      return `${common} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200`;
    case 'pendiente':
      return `${common} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200`;
    case 'aceptada':
      return `${common} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200`;
    case 'en_curso':
      return `${common} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200`;
    case 'finalizada':
      return `${common} bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
    case 'rechazada':
      return `${common} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200`;
    default:
      return `${common} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200`;
  }
};

export default function TaskCard({ task }: Props) {
  const router = useRouter();
  return (
    <li className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/60 dark:bg-white/5 backdrop-blur">
      <div
        className="cursor-pointer flex items-start justify-between gap-3"
        onClick={() => router.push(`/tasks/${task.id}`)}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-gray-500 dark:text-gray-400">
              {task.status === 'en_revision' && <FileClock className="h-5 w-5" />}
              {task.status === 'pendiente' && <Clock className="h-5 w-5" />}
              {task.status === 'aceptada' && <BadgeCheck className="h-5 w-5 text-emerald-600" />}
              {task.status === 'en_curso' && <Hammer className="h-5 w-5 text-blue-600" />}
              {task.status === 'finalizada' && (
                <CheckCircle2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
              {task.status === 'rechazada' && <XCircle className="h-5 w-5 text-red-600" />}
            </span>
            <p className="text-sm text-gray-500">
              {new Date(task.created_at).toLocaleDateString()}
            </p>
            <span className={statusBadge(task.status)}>{task.status.replace('_', ' ')}</span>
          </div>
          <h3 className="mt-1 font-semibold text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {task.description}
          </p>
        </div>
      </div>
    </li>
  );
}
