// Tipos base (frontend)
export type UserRole = 'client' | 'admin';

export interface UserMinimal {
  id: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string | null;
}

// Estados de tareas alineados con el backend
export type TaskStatus =
  | 'en_revision'
  | 'pendiente'
  | 'aceptada'
  | 'en_curso'
  | 'finalizada'
  | 'rechazada';

export interface Task {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category_id?: string | null;
  price_cents?: number | null;
  due_date?: string | null; // ISO date string
  created_at: string;
  updated_at?: string | null;
}

export interface CreateTaskDTO {
  clientId: string;
  title: string;
  description: string;
  categoryId?: string | null;
}

export interface TasksListResponse {
  data: Task[];
  total?: number;
}

export interface TaskResponse {
  data: Task;
}

// Mensajes/comentarios (placeholder para futura implementación de chat)
export interface Message {
  id: string;
  task_id: string;
  user_id: string;
  text: string;
  created_at: string;
}
