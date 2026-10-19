import { CATEGORIAS } from "../models/Libro.js";
export class LibroView {
    constructor() {
        this.formulario = document.querySelector("#form-libro");
        this.tabla = document.querySelector("#tabla-libros");
        this.busqueda = document.querySelector("#busqueda");
        this.filtroCategoria = document.querySelector("#filtro-categoria");
        this.filtroEstado = document.querySelector("#filtro-estado");
        this.cancelar = document.querySelector("#cancelar");
        this.pestanas = document.querySelectorAll("[data-pestana]");
        this.mensaje = document.querySelector("#mensaje");
        this.contador = document.querySelector("#contador");
        this.avisoVacio = document.querySelector("#sin-resultados");
    }
    obtenerDatos() {
        const campo = (nombre) => this.formulario.elements.namedItem(nombre).value;
        return {
            titulo: campo("titulo"),
            autor: campo("autor"),
            anio: Number(campo("anio")),
            categoria: campo("categoria"),
            estado: campo("estado"),
            correo: campo("correo")
        };
    }
    obtenerIdEdicion() {
        const valor = this.formulario.elements.namedItem("id").value;
        return valor ? Number(valor) : null;
    }
    cargarFormulario(libro) {
        const poner = (nombre, valor) => {
            this.formulario.elements.namedItem(nombre).value = valor;
        };
        poner("id", String(libro.id));
        poner("titulo", libro.titulo);
        poner("autor", libro.autor);
        poner("anio", String(libro.anio));
        poner("categoria", libro.categoria);
        poner("estado", libro.estado);
        poner("correo", libro.correo);
        document.querySelector("#titulo-form").textContent = "Editar libro";
        document.querySelector("#guardar").textContent = "Actualizar";
        this.cancelar.hidden = false;
        this.formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    limpiarFormulario() {
        this.formulario.reset();
        this.formulario.elements.namedItem("id").value = "";
        document.querySelector("#titulo-form").textContent = "Registrar libro";
        document.querySelector("#guardar").textContent = "Guardar libro";
        this.cancelar.hidden = true;
    }
    mostrarLibros(libros) {
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
    mostrarResumen(libros) {
        document.querySelector("#total-libros").textContent = String(libros.length);
        document.querySelector("#total-pendientes").textContent =
            String(libros.filter(libro => libro.estado === "Pendiente").length);
        document.querySelector("#total-leyendo").textContent =
            String(libros.filter(libro => libro.estado === "Leyendo").length);
        document.querySelector("#total-leidos").textContent =
            String(libros.filter(libro => libro.estado === "Leído").length);
        const lista = document.querySelector("#resumen-categorias");
        lista.replaceChildren();
        CATEGORIAS.forEach(categoria => {
            const cantidad = libros.filter(libro => libro.categoria === categoria).length;
            if (cantidad === 0)
                return;
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
    mostrarPestana(nombre) {
        document.querySelectorAll("[data-vista]").forEach(vista => {
            vista.hidden = vista.dataset.vista !== nombre;
        });
        this.pestanas.forEach(boton => {
            const activa = boton.dataset.pestana === nombre;
            boton.classList.toggle("activa", activa);
            boton.setAttribute("aria-selected", String(activa));
        });
    }
    notificar(texto, tipo = "bien") {
        if (this.tiempoMensaje)
            window.clearTimeout(this.tiempoMensaje);
        this.mensaje.textContent = texto;
        this.mensaje.className = `mensaje ${tipo}`;
        this.mensaje.hidden = false;
        this.tiempoMensaje = window.setTimeout(() => {
            this.mensaje.hidden = true;
        }, 3500);
    }
    crearBoton(texto, accion, id) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        boton.dataset.accion = accion;
        boton.dataset.id = String(id);
        boton.className = accion === "eliminar" ? "boton-mini peligro" : "boton-mini";
        return boton;
    }
}
