export type CuadernoEstado = 'publicado' | 'borrador';

export interface Cuaderno {
  id:string;
  titulo: string;
  descripcion: string;
  estado: CuadernoEstado;
  numEntradas: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  coverColor: string;
}
