import { LibroModel } from "../models/LibroModel.js";
import { LibroView } from "../views/LibroView.js";

export class LibroController {
  constructor(private modelo: LibroModel, private vista: LibroView) {
    this.configurarEventos();
    this.actualizarPantalla();
  }

  private configurarEventos(): void {
    this.vista.formulario.addEventListener("submit", evento => {
      evento.preventDefault();
      this.guardarLibro();
    });

    this.vista.cancelar.addEventListener("click", () => this.vista.limpiarFormulario());
    this.vista.busqueda.addEventListener("input", () => this.actualizarPantalla());
    this.vista.filtroCategoria.addEventListener("change", () => this.actualizarPantalla());
    this.vista.filtroEstado.addEventListener("change", () => this.actualizarPantalla());

    this.vista.tabla.addEventListener("click", evento => {
      const boton = (evento.target as HTMLElement).closest<HTMLButtonElement>("button[data-accion]");
      if (!boton) return;
      const id = Number(boton.dataset.id);
      if (boton.dataset.accion === "editar") this.editarLibro(id);
      if (boton.dataset.accion === "eliminar") this.eliminarLibro(id);
    });

    this.vista.pestanas.forEach(boton => {
      boton.addEventListener("click", () => {
        this.vista.mostrarPestana(boton.dataset.pestana || "catalogo");
      });
    });
  }

  private guardarLibro(): void {
    const datos = this.vista.obtenerDatos();
    const id = this.vista.obtenerIdEdicion();

    try {
      if (id !== null) {
        this.modelo.actualizar(id, datos);
        this.vista.notificar("Libro actualizado correctamente.");
      } else {
        this.modelo.agregar(datos);
        this.vista.notificar("Libro registrado correctamente.");
      }
      this.vista.limpiarFormulario();
      this.actualizarPantalla();
    } catch (error) {
      this.vista.notificar((error as Error).message, "error");
    }
  }

  private editarLibro(id: number): void {
    const libro = this.modelo.buscarPorId(id);
    if (libro) this.vista.cargarFormulario(libro);
  }

  private eliminarLibro(id: number): void {
    if (!confirm("¿Seguro que quieres eliminar este libro?")) return;
    try {
      this.modelo.eliminar(id);
      if (this.vista.obtenerIdEdicion() === id) this.vista.limpiarFormulario();
      this.actualizarPantalla();
      this.vista.notificar("Libro eliminado correctamente.");
    } catch (error) {
      this.vista.notificar((error as Error).message, "error");
    }
  }

  private actualizarPantalla(): void {
    const libros = this.modelo.filtrar(
      this.vista.busqueda.value,
      this.vista.filtroCategoria.value,
      this.vista.filtroEstado.value
    );
    this.vista.mostrarLibros(libros);
    this.vista.mostrarResumen(this.modelo.listar());
  }
}
