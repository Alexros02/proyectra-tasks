// Tipos para usuarios del sistema
export type UserRole = 'admin' | 'user';

export interface BaseUser {
  nombre: string;
  email: string;
  rol: UserRole;
}

export interface Admin extends BaseUser {
  rol: 'admin';
}

export interface User extends BaseUser {
  rol: 'user';
}

// Tipo unión para manejar ambos tipos de usuario
export type UserType = Admin | User;

// Tipo para crear un nuevo usuario (sin ID)
export interface CreateUser {
  nombre: string;
  email: string;
  rol: UserRole;
}

// Tipo para actualizar un usuario existente (todas las propiedades opcionales)
export interface UpdateUser {
  nombre?: string;
  email?: string;
  rol?: UserRole;
}

// Tipos para tareas del sistema
export type TaskStatus = 'pendiente' |'en_revision'| 'en_progreso' | 'completada' | 'cancelada';

export interface TaskFile {
  id: string;
  nombre: string;
  url: string;
  tipo: string;
  tamaño: number;
}

export interface Task {
  id: string;
  clienteId: string;
  título: string;
  descripción: string;
  estado: TaskStatus;
  precio: number;
  fechaEntrega: Date;
  archivos: TaskFile[];
  fechaCreación: Date;
}

// Tipo para crear una nueva tarea (sin ID ni fechas automáticas)
export interface CreateTask {
  clienteId: string;
  título: string;
  descripción: string;
  estado: TaskStatus;
  precio: number;
  fechaEntrega: Date;
  archivos?: TaskFile[];
}

// Tipo para actualizar una tarea existente (todas las propiedades opcionales)
export interface UpdateTask {
  clienteId?: string;
  título?: string;
  descripción?: string;
  estado?: TaskStatus;
  precio?: number;
  fechaEntrega?: Date;
  archivos?: TaskFile[];
}

// Tipos para comentarios del sistema
export interface Comment {
  id: string;
  tareaId: string;
  usuarioId: string;
  texto: string;
  archivos: TaskFile[];
  fecha: Date;
}

// Tipo para crear un nuevo comentario (sin ID ni fecha automática)
export interface CreateComment {
  tareaId: string;
  usuarioId: string;
  texto: string;
  archivos?: TaskFile[];
}

// Tipo para actualizar un comentario existente (todas las propiedades opcionales)
export interface UpdateComment {
  texto?: string;
  archivos?: TaskFile[];
}