export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
  categoria: string;
  estado: string;
  correo: string;
}

export type DatosLibro = Omit<Libro, "id">;

export const CATEGORIAS = [
  "Novela", "Fantasía", "Historia", "Ciencia", "Tecnología", "Otros"
];

export const ESTADOS = ["Pendiente", "Leyendo", "Leído"];
