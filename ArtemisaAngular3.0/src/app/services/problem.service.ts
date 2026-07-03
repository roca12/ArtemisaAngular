import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Problema } from '../shared/models/problema.model';
import { environment } from '../../environments/environment';

/** Datos para crear un problema (sin los identificadores que asigna el backend). */
export type CrearProblema = Omit<Problema, 'id' | '_id'>;
/** Cambios para actualizar un problema (todos los campos opcionales). */
export type ActualizarProblema = Partial<CrearProblema>;
/** Respuesta estándar de las operaciones que solo confirman el resultado. */
export interface RespuestaSimple {
  ok: boolean;
  message: string;
}

/**
 * Servicio encargado de gestionar las operaciones relacionadas con los problemas de programación.
 */
@Injectable({
  providedIn: 'root',
})
export class ProblemService {
  /** Cliente HTTP para realizar peticiones. */
  private http = inject(HttpClient);
  /** URL base para los endpoints de problemas. */
  private readonly baseUrl: string = `${environment.apiUrl}problema/`;

  /**
   * Obtiene la lista de problemas disponibles desde el servidor.
   * @returns Un Observable con la colección de problemas.
   */
  getProblems() {
    return this.http.get<Problema[]>(this.baseUrl);
  }

  /**
   * Obtiene un problema por su identificador.
   * @param id Identificador (`_id`) del problema.
   * @returns Un Observable con el problema solicitado.
   */
  getProblem(id: string) {
    return this.http.get<Problema>(`${this.baseUrl}${id}`);
  }

  /**
   * Crea un nuevo problema en el sistema.
   * @param problem Datos del problema a registrar.
   * @returns Un Observable con el problema creado.
   */
  createProblem(problem: CrearProblema) {
    return this.http.post<Problema>(`${this.baseUrl}crear`, problem);
  }

  /**
   * Actualiza un problema existente.
   * @param id Identificador (`_id`) del problema a actualizar.
   * @param cambios Campos a modificar.
   * @returns Un Observable con el problema actualizado.
   */
  updateProblem(id: string, cambios: ActualizarProblema) {
    return this.http.put<Problema>(`${this.baseUrl}${id}`, cambios);
  }

  /**
   * Elimina un problema por su identificador.
   * @param id Identificador (`_id`) del problema a eliminar.
   * @returns Un Observable con la confirmación del servidor.
   */
  deleteProblem(id: string) {
    return this.http.delete<RespuestaSimple>(`${this.baseUrl}${id}`);
  }
}
