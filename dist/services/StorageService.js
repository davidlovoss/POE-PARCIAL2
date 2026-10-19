export class StorageService {
    constructor() {
        this.clave = "catalogo_libros_parcial2";
    }
    cargar() {
        try {
            const datos = localStorage.getItem(this.clave);
            if (!datos)
                return [];
            const libros = JSON.parse(datos);
            if (!Array.isArray(libros))
                return [];
            // Evita errores si se encuentran datos incompletos guardados.
            return libros.filter((libro) => typeof libro === "object" && libro !== null &&
                typeof libro.id === "number" &&
                typeof libro.titulo === "string" &&
                typeof libro.autor === "string" &&
                typeof libro.anio === "number" &&
                typeof libro.categoria === "string" &&
                typeof libro.estado === "string" &&
                typeof libro.correo === "string");
        }
        catch {
            return [];
        }
    }
    guardar(libros) {
        try {
            localStorage.setItem(this.clave, JSON.stringify(libros));
        }
        catch {
            throw new Error("No fue posible guardar los cambios en el navegador.");
        }
    }
}
