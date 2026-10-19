import type { Libro } from "../models/Libro.js";

export class StorageService {
  private clave = "catalogo_libros_parcial2";

  cargar(): Libro[] {
    try {
      const datos = localStorage.getItem(this.clave);
      if (!datos) return [];

      const libros: unknown = JSON.parse(datos);
      if (!Array.isArray(libros)) return [];

      // Evita errores si se encuentran datos incompletos guardados.
      return libros.filter((libro): libro is Libro =>
        typeof libro === "object" && libro !== null &&
        typeof libro.id === "number" &&
        typeof libro.titulo === "string" &&
        typeof libro.autor === "string" &&
        typeof libro.anio === "number" &&
        typeof libro.categoria === "string" &&
        typeof libro.estado === "string" &&
        typeof libro.correo === "string"
      );
    } catch {
      return [];
    }
  }

  guardar(libros: Libro[]): void {
    try {
      localStorage.setItem(this.clave, JSON.stringify(libros));
    } catch {
      throw new Error("No fue posible guardar los cambios en el navegador.");
    }
  }
}
