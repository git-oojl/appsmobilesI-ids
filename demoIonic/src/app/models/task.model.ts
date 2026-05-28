export interface Task{
  id: number;
  titulo: string;
  descripcion: string;
  finalizado: boolean;
  prioridad: 'Baja' | 'Media' | 'Alta'
}

