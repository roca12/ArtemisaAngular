import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Temario } from '../shared/models/temario.model';

/** Datos para crear un tema (sin los campos que gestiona el backend). */
export type CrearTemario = Omit<
  Temario,
  'ID' | '_id' | 'fecha_creacion' | 'fecha_modificacion'
>;
/** Cambios para actualizar un tema (todos los campos opcionales). */
export type ActualizarTemario = Partial<
  Omit<Temario, 'ID' | '_id' | 'fecha_creacion'>
>;
/** Respuesta de las mutaciones de temario. */
export interface RespuestaTemario {
  ok: boolean;
  message: string;
  temario: Temario;
}
/** Respuesta estándar de las operaciones que solo confirman el resultado. */
export interface RespuestaSimple {
  ok: boolean;
  message: string;
}

/**
 * Servicio encargado de gestionar el temario y los grupos de la plataforma.
 */
@Injectable({
  providedIn: 'root',
})
export class SyllabusService {
  /** Cliente HTTP para realizar peticiones. */
  private http = inject(HttpClient);
  /** URL base para los endpoints del temario (sin barra final). */
  private readonly baseUrl: string = `${environment.apiUrl}temario`;

  /**
   * Obtiene el temario completo desde el servidor.
   * @returns Un Observable con la colección de temas.
   */
  getSyllabus() {
    return this.http.get<Temario[]>(this.baseUrl);
  }

  /**
   * Obtiene la lista de supergrupos del temario desde el servidor.
   * @returns Un Observable con la lista de nombres de supergrupos.
   */
  getSuperGrupos() {
    return this.http.get<string[]>(`${this.baseUrl}/supergrupos`);
  }

  /**
   * Obtiene un tema por su identificador.
   * @param id Identificador (`_id`) del tema.
   * @returns Un Observable con el tema solicitado.
   */
  getTema(id: string) {
    return this.http.get<Temario>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea un nuevo tema en el temario.
   * @param tema Datos del tema a registrar.
   * @returns Un Observable con la confirmación y el tema creado.
   */
  crearTema(tema: CrearTemario) {
    return this.http.post<RespuestaTemario>(`${this.baseUrl}/crear`, tema);
  }

  /**
   * Actualiza un tema existente.
   * @param id Identificador (`_id`) del tema a actualizar.
   * @param cambios Campos a modificar.
   * @returns Un Observable con la confirmación y el tema actualizado.
   */
  actualizarTema(id: string, cambios: ActualizarTemario) {
    return this.http.put<RespuestaTemario>(`${this.baseUrl}/${id}`, cambios);
  }

  /**
   * Elimina un tema por su identificador.
   * @param id Identificador (`_id`) del tema a eliminar.
   * @returns Un Observable con la confirmación del servidor.
   */
  eliminarTema(id: string) {
    return this.http.delete<RespuestaSimple>(`${this.baseUrl}/${id}`);
  }
}
