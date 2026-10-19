import { CATEGORIAS } from "../models/Libro.js";
import type { DatosLibro, Libro } from "../models/Libro.js";

export class LibroView {
  formulario = document.querySelector<HTMLFormElement>("#form-libro")!;
  tabla = document.querySelector<HTMLTableSectionElement>("#tabla-libros")!;
  busqueda = document.querySelector<HTMLInputElement>("#busqueda")!;
  filtroCategoria = document.querySelector<HTMLSelectElement>("#filtro-categoria")!;
  filtroEstado = document.querySelector<HTMLSelectElement>("#filtro-estado")!;
  cancelar = document.querySelector<HTMLButtonElement>("#cancelar")!;
  pestanas = document.querySelectorAll<HTMLButtonElement>("[data-pestana]");

  private mensaje = document.querySelector<HTMLDivElement>("#mensaje")!;
  private contador = document.querySelector<HTMLElement>("#contador")!;
  private avisoVacio = document.querySelector<HTMLElement>("#sin-resultados")!;
  private tiempoMensaje?: number;

  obtenerDatos(): DatosLibro {
    const campo = (nombre: string) =>
      (this.formulario.elements.namedItem(nombre) as HTMLInputElement | HTMLSelectElement).value;

    return {
      titulo: campo("titulo"),
      autor: campo("autor"),
      anio: Number(campo("anio")),
      categoria: campo("categoria"),
      estado: campo("estado"),
      correo: campo("correo")
    };
  }

  obtenerIdEdicion(): number | null {
    const valor = (this.formulario.elements.namedItem("id") as HTMLInputElement).value;
    return valor ? Number(valor) : null;
  }

  cargarFormulario(libro: Libro): void {
    const poner = (nombre: string, valor: string) => {
      (this.formulario.elements.namedItem(nombre) as HTMLInputElement).value = valor;
    };
    poner("id", String(libro.id));
    poner("titulo", libro.titulo);
    poner("autor", libro.autor);
    poner("anio", String(libro.anio));
    poner("categoria", libro.categoria);
    poner("estado", libro.estado);
    poner("correo", libro.correo);

    document.querySelector<HTMLElement>("#titulo-form")!.textContent = "Editar libro";
    document.querySelector<HTMLButtonElement>("#guardar")!.textContent = "Actualizar";
    this.cancelar.hidden = false;
    this.formulario.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  limpiarFormulario(): void {
    this.formulario.reset();
    (this.formulario.elements.namedItem("id") as HTMLInputElement).value = "";
    document.querySelector<HTMLElement>("#titulo-form")!.textContent = "Registrar libro";
    document.querySelector<HTMLButtonElement>("#guardar")!.textContent = "Guardar libro";
    this.cancelar.hidden = true;
  }

  mostrarLibros(libros: Libro[]): void {
    this.tabla.replaceChildren();
    this.contador.textContent = `${libros.length} resultado(s)`;
    this.avisoVacio.hidden = libros.length > 0;

    libros.forEach(libro => {
      const fila = document.createElement("tr");
      [libro.titulo, libro.autor, String(libro.anio), libro.categoria, libro.estado, libro.correo]
        .forEach(valor => {
          const celda = document.createElement("td");
          celda.textContent = valor;
          fila.appendChild(celda);
        });

      const acciones = document.createElement("td");
      acciones.className = "acciones";
      acciones.appendChild(this.crearBoton("Editar", "editar", libro.id));
      acciones.appendChild(this.crearBoton("Eliminar", "eliminar", libro.id));
      fila.appendChild(acciones);
      this.tabla.appendChild(fila);
    });
  }

  mostrarResumen(libros: Libro[]): void {
    document.querySelector<HTMLElement>("#total-libros")!.textContent = String(libros.length);
    document.querySelector<HTMLElement>("#total-pendientes")!.textContent =
      String(libros.filter(libro => libro.estado === "Pendiente").length);
    document.querySelector<HTMLElement>("#total-leyendo")!.textContent =
      String(libros.filter(libro => libro.estado === "Leyendo").length);
    document.querySelector<HTMLElement>("#total-leidos")!.textContent =
      String(libros.filter(libro => libro.estado === "Leído").length);

    const lista = document.querySelector<HTMLUListElement>("#resumen-categorias")!;
    lista.replaceChildren();
    CATEGORIAS.forEach(categoria => {
      const cantidad = libros.filter(libro => libro.categoria === categoria).length;
      if (cantidad === 0) return;
      const elemento = document.createElement("li");
      elemento.textContent = `${categoria}: ${cantidad}`;
      lista.appendChild(elemento);
    });
    if (!lista.children.length) {
      const elemento = document.createElement("li");
      elemento.textContent = "Todavía no hay libros registrados.";
      lista.appendChild(elemento);
    }
  }

  mostrarPestana(nombre: string): void {
    document.querySelectorAll<HTMLElement>("[data-vista]").forEach(vista => {
      vista.hidden = vista.dataset.vista !== nombre;
    });
    this.pestanas.forEach(boton => {
      const activa = boton.dataset.pestana === nombre;
      boton.classList.toggle("activa", activa);
      boton.setAttribute("aria-selected", String(activa));
    });
  }

  notificar(texto: string, tipo: "bien" | "error" = "bien"): void {
    if (this.tiempoMensaje) window.clearTimeout(this.tiempoMensaje);
    this.mensaje.textContent = texto;
    this.mensaje.className = `mensaje ${tipo}`;
    this.mensaje.hidden = false;
    this.tiempoMensaje = window.setTimeout(() => {
      this.mensaje.hidden = true;
    }, 3500);
  }

  private crearBoton(texto: string, accion: string, id: number): HTMLButtonElement {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.dataset.accion = accion;
    boton.dataset.id = String(id);
    boton.className = accion === "eliminar" ? "boton-mini peligro" : "boton-mini";
    return boton;
  }
}
