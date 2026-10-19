import { CATEGORIAS, ESTADOS } from "./Libro.js";
import type { DatosLibro, Libro } from "./Libro.js";
import { StorageService } from "../services/StorageService.js";

export class LibroModel {
  private libros: Libro[];

  constructor(private storage: StorageService) {
    this.libros = storage.cargar();
  }

  listar(): Libro[] {
    return [...this.libros];
  }

  buscarPorId(id: number): Libro | undefined {
    return this.libros.find(libro => libro.id === id);
  }

  agregar(datos: DatosLibro): void {
    const libro = this.validar(datos);
    this.validarDuplicado(libro);

    const nuevoId = Math.max(0, ...this.libros.map(item => item.id)) + 1;
    this.guardarCambios([...this.libros, { id: nuevoId, ...libro }]);
  }

  actualizar(id: number, datos: DatosLibro): void {
    if (!this.buscarPorId(id)) throw new Error("No se encontró el libro a editar.");

    const libro = this.validar(datos);
    this.validarDuplicado(libro, id);
    this.guardarCambios(this.libros.map(item =>
      item.id === id ? { id, ...libro } : item
    ));
  }

  eliminar(id: number): void {
    if (!this.buscarPorId(id)) throw new Error("El libro ya no existe.");
    this.guardarCambios(this.libros.filter(libro => libro.id !== id));
  }

  filtrar(texto: string, categoria: string, estado: string): Libro[] {
    const busqueda = texto.trim().toLowerCase();

    return this.libros.filter(libro => {
      const coincideTexto = libro.titulo.toLowerCase().includes(busqueda) ||
        libro.autor.toLowerCase().includes(busqueda);
      const coincideCategoria = !categoria || libro.categoria === categoria;
      const coincideEstado = !estado || libro.estado === estado;
      return coincideTexto && coincideCategoria && coincideEstado;
    });
  }

  private validar(datos: DatosLibro): DatosLibro {
    const titulo = datos.titulo.trim().replace(/\s+/g, " ");
    const autor = datos.autor.trim().replace(/\s+/g, " ");
    const correo = datos.correo.trim().toLowerCase();
    const anio = Number(datos.anio);

    if (titulo.length < 2 || titulo.length > 100) {
      throw new Error("El título debe tener entre 2 y 100 caracteres.");
    }
    if (autor.length < 3 || autor.length > 80) {
      throw new Error("El autor debe tener entre 3 y 80 caracteres.");
    }
    if (!Number.isInteger(anio) || anio < 1 || anio > new Date().getFullYear()) {
      throw new Error("El año debe ser un número entre 1 y el año actual.");
    }
    if (!CATEGORIAS.includes(datos.categoria)) {
      throw new Error("Selecciona una categoría válida.");
    }
    if (!ESTADOS.includes(datos.estado)) {
      throw new Error("Selecciona un estado válido.");
    }
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!expresionCorreo.test(correo)) {
      throw new Error("Escribe un correo de contacto válido.");
    }

    return { titulo, autor, anio, categoria: datos.categoria, estado: datos.estado, correo };
  }

  private validarDuplicado(datos: DatosLibro, idActual?: number): void {
    const existe = this.libros.some(libro =>
      libro.id !== idActual &&
      libro.titulo.toLowerCase() === datos.titulo.toLowerCase() &&
      libro.autor.toLowerCase() === datos.autor.toLowerCase()
    );
    if (existe) throw new Error("Ya existe un libro con ese título y autor.");
  }

  private guardarCambios(libros: Libro[]): void {
    this.storage.guardar(libros);
    this.libros = libros;
  }
}
