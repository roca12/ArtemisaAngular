import { inject, Injectable, signal } from '@angular/core';
import { SyllabusService } from './syllabus.service';
import { ProblemService } from './problem.service';
import { BookService } from './book.service';
import { lastValueFrom } from 'rxjs';
import { Recomendation } from '../shared/models/recomendation.model';
import { Problema } from '../shared/models/problema.model';
import { Temario } from '../shared/models/temario.model';

/**
 * Servicio encargado de generar y gestionar las recomendaciones de búsqueda en la plataforma.
 * Recopila información de temas, problemas y libros para ofrecer sugerencias al usuario.
 */
@Injectable({ providedIn: 'root' })
export class RecomendationService {
  /** Servicio de temario para obtener grupos y temas. */
  private syllabus = inject(SyllabusService);
  /** Servicio de problemas para obtener títulos y metadatos. */
  private problemService = inject(ProblemService);
  /** Servicio de libros para obtener títulos. */
  private bookService = inject(BookService);

  /** Señal que almacena un conjunto único de recomendaciones. */
  private _recomendations = signal<Set<Recomendation>>(
    new Set<Recomendation>(),
  );

  /**
   * Inicializa las recomendaciones de forma asíncrona cargando datos de múltiples fuentes.
   * @returns Una promesa que se resuelve cuando todas las recomendaciones han sido cargadas.
   */
  async initializeRecomendationsAsync(): Promise<void> {
    const superGruposPromise = lastValueFrom(
      this.syllabus.getSuperGrupos(),
    ).then((response) => {
      const superGrupos = response as string[];
      superGrupos.forEach((sg) => {
        const recoSuperGrupo: Recomendation = {
          data: sg,
          type: 'grupo-temario',
        };
        this.addRecomendations([recoSuperGrupo]);
      });
    });

    const temarioPromise = lastValueFrom(this.syllabus.getSyllabus()).then(
      (response) => {
        const temario = response as Temario[];
        temario.forEach((t) => {
          const recoTema: Recomendation = {
            data: t.tema,
            type: 'tema',
          };
          this.addRecomendations([recoTema]);
        });
      },
    );

    const problemasPromise = lastValueFrom(
      this.problemService.getProblems(),
    ).then((response) => {
      const problems = response as Problema[];
      const temas: Set<Recomendation> = new Set();
      const subtemas: Set<Recomendation> = new Set();
      const dificultades: Set<Recomendation> = new Set();
      const jueces: Set<Recomendation> = new Set();
      problems.forEach((p) => {
        const recoProblema: Recomendation = {
          data: p.titulo,
          type: 'problema',
        };
        this.addRecomendations([recoProblema]);

        const recoTema: Recomendation = {
          data: p.tema_1,
          type: 'problema-tema',
        };
        temas.add(recoTema);

        const recoDificultad: Recomendation = {
          data:
            p.dificultad <= 5
              ? 'Aprendíz'
              : p.dificultad <= 10
                ? 'Básica'
                : p.dificultad <= 15
                  ? 'Intermedia'
                  : p.dificultad <= 20
                    ? 'Avanzada'
                    : p.dificultad <= 25
                      ? 'Elite'
                      : '',
          type: 'dificultad-problema',
        };
        dificultades.add(recoDificultad);

        const recoJuez: Recomendation = {
          data: p.juez,
          type: 'juez-problema',
        };

        jueces.add(recoJuez);
      });

      problems.forEach((p) => {
        const recoSubtema1: Recomendation = {
          data: p.tema_2,
          type: 'tema',
        };

        const recoSubtema2: Recomendation = {
          data: p.tema_3,
          type: 'tema',
        };

        const recoSubtema3: Recomendation = {
          data: p.tema_4,
          type: 'tema',
        };
        if (!temas.has(recoSubtema1)) {
          recoSubtema1.type = 'subtema-problema';
          subtemas.add(recoSubtema1);
        }
        if (!temas.has(recoSubtema2)) {
          recoSubtema2.type = 'subtema-problema';
          subtemas.add(recoSubtema2);
          subtemas.add(recoSubtema2);
        }
        if (!temas.has(recoSubtema3)) {
          recoSubtema3.type = 'subtema-problema';
          subtemas.add(recoSubtema3);
        }
      });
      this.addRecomendations([
        ...temas,
        ...dificultades,
        ...jueces,
        ...subtemas,
      ]);
    });

    const librosPromise = lastValueFrom(this.bookService.getLibros()).then(
      (response) => {
        response.forEach((l) => {
          const recoLibro: Recomendation = {
            data: l.titulo,
            type: 'libro',
          };
          this.addRecomendations([recoLibro]);
        });
      },
    );

    await Promise.all([
      superGruposPromise,
      problemasPromise,
      librosPromise,
      temarioPromise,
    ]);
  }

  /**
   * Recarga solo las recomendaciones de tipo `libro` desde el backend.
   *
   * A diferencia de `initializeRecomendationsAsync` (que corre una única vez al
   * arrancar la app), este método se invoca tras crear/editar/eliminar un libro
   * para que el buscador refleje el cambio sin recargar toda la página.
   * Reconstruye el conjunto quitando los libros anteriores y añadiendo los
   * actuales, de modo que también se reflejan renombrados y borrados.
   * @returns Una promesa que se resuelve cuando las recomendaciones se han actualizado.
   */
  async refreshLibros(): Promise<void> {
    const libros = await lastValueFrom(this.bookService.getLibros());
    const sinLibros = Array.from(this._recomendations()).filter(
      (rec) => rec.type !== 'libro',
    );
    const actualizadas = new Set<Recomendation>(sinLibros);
    libros.forEach((l) => actualizadas.add({ data: l.titulo, type: 'libro' }));
    this._recomendations.set(actualizadas);
  }

  /**
   * Añade un conjunto de nuevas recomendaciones a la lista existente.
   * @param newRecomendations Arreglo de recomendaciones a añadir.
   */
  addRecomendations(newRecomendations: Recomendation[]) {
    const currentRecomendations = this._recomendations();
    newRecomendations.forEach((rec) => currentRecomendations.add(rec));
    this._recomendations.set(currentRecomendations);
  }

  /**
   * Obtiene la lista actual de recomendaciones.
   * @returns Un arreglo con todas las recomendaciones almacenadas.
   */
  getRecomendations(): Recomendation[] {
    return Array.from(this._recomendations());
  }
}
