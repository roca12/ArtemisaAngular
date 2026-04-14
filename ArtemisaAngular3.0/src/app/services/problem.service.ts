import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Problema } from '../shared/models/problema.model';
import { environment } from '../../environments/environment';

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
   * @returns Un Observable con la colección de problemas envuelta en un objeto de respuesta.
   */
  getProblems() {
    return this.http.get<{ data: Problema[] }>(`${this.baseUrl}`);
  }

  /**
   * Crea un nuevo problema en el sistema.
   * @param problem El objeto Problema con los datos a registrar.
   * @returns Un Observable con la respuesta del servidor.
   */
  createProblem(problem: Problema) {
    return this.http.post(`${this.baseUrl}crear`, problem);
  }
}
