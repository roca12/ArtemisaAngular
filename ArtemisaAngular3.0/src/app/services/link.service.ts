import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Link } from '../shared/models/link.model';

/** Datos para crear un enlace (sin el identificador que asigna el backend). */
export type CrearLink = Omit<Link, '_id'>;
/** Cambios para actualizar un enlace (todos los campos opcionales). */
export type ActualizarLink = Partial<CrearLink>;
/** Respuesta estándar de las operaciones que solo confirman el resultado. */
export interface RespuestaSimple {
  ok: boolean;
  message: string;
}

/**
 * Servicio encargado de gestionar los enlaces valiosos de la plataforma.
 */
@Injectable({
  providedIn: 'root',
})
export class LinkService {
  /** Cliente HTTP para realizar peticiones. */
  private http = inject(HttpClient);
  /** URL base para los endpoints de enlaces valiosos. */
  private readonly baseUrl: string = `${environment.apiUrl}link-valioso/`;

  /**
   * Obtiene la lista de enlaces valiosos desde el servidor.
   * @returns Un Observable con la colección de enlaces.
   */
  obtenerLinks() {
    return this.http.get<Link[]>(`${this.baseUrl}`);
  }

  /**
   * Obtiene un enlace valioso por su identificador.
   * @param id Identificador (`_id`) del enlace.
   * @returns Un Observable con el enlace solicitado.
   */
  obtenerLink(id: string) {
    return this.http.get<Link>(`${this.baseUrl}${id}`);
  }

  /**
   * Crea un nuevo enlace valioso.
   * @param link Datos del enlace a registrar.
   * @returns Un Observable con el enlace creado.
   */
  crearLink(link: CrearLink) {
    return this.http.post<Link>(`${this.baseUrl}crear`, link);
  }

  /**
   * Actualiza un enlace valioso existente.
   * @param id Identificador (`_id`) del enlace a actualizar.
   * @param cambios Campos a modificar.
   * @returns Un Observable con el enlace actualizado.
   */
  actualizarLink(id: string, cambios: ActualizarLink) {
    return this.http.put<Link>(`${this.baseUrl}${id}`, cambios);
  }

  /**
   * Elimina un enlace valioso por su identificador.
   * @param id Identificador (`_id`) del enlace a eliminar.
   * @returns Un Observable con la confirmación del servidor.
   */
  eliminarLink(id: string) {
    return this.http.delete<RespuestaSimple>(`${this.baseUrl}${id}`);
  }
}
