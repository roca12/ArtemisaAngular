
import { Injectable, signal } from '@angular/core';
import { SyllabusService } from './syllabus.service';
import { ProblemService } from './problem.service';
import { BookService } from './book.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {Recomendation} from '../shared/models/recomendation.model';
import {Problema} from '../shared/models/problema.model';
import {Temario} from '../shared/models/temario.model';



@Injectable({ providedIn: 'root' })
export class RecomendationService {
  private _recomendations = signal<Set<Recomendation>>(new Set<Recomendation>());

  constructor(
    private syllabus: SyllabusService,
    private problemService: ProblemService,
    private bookService: BookService,
    private router: Router
  ) {}



  async initializeRecomendationsAsync(): Promise<void> {
    const superGruposPromise = lastValueFrom(
      this.syllabus.getSuperGrupos()
    ).then(response => {
      const superGrupos = response.data as string[];
      superGrupos.forEach(sg => {
        const recoSuperGrupo: Recomendation = {
          data: sg,
          type: 'grupo-temario'
        };
        this.addRecomendations([recoSuperGrupo]);
      });
    });

    const temarioPromise = lastValueFrom(
      this.syllabus.getSyllabus()
    ).then(response => {
      const temario = response.data as Temario[];
      temario.forEach(t => {
        const recoTema: Recomendation = {
          data: t.tema,
          type: 'tema'
        };
        this.addRecomendations([recoTema]);
      });
      }
    );


    const problemasPromise = lastValueFrom(
      this.problemService.getProblems()
    ).then(response => {
      const problems = response.data as Problema[];
      let temas: Set<Recomendation> = new Set();
      let subtemas: Set<Recomendation> = new Set();
      let dificultades: Set<Recomendation> = new Set();
      let jueces: Set<Recomendation> = new Set();
      problems.forEach(p => {
        const recoProblema: Recomendation = {
          data: p.titulo,
          type: 'problema'
        }
        this.addRecomendations([recoProblema]);

        const recoTema: Recomendation = {
          data: p.tema_1,
          type: 'problema-tema'
        };
        temas.add(recoTema)

        const recoDificultad: Recomendation = {
            data: p.dificultad<=5? 'Aprendíz':
                  p.dificultad<=10? 'Básica':
                  p.dificultad<=15? 'Intermedia':
                  p.dificultad<=20? 'Avanzada':
                  p.dificultad<=25? 'Elite': '',
            type: 'dificultad-problema'
        };
        dificultades.add(recoDificultad)

        const recoJuez: Recomendation = {
            data: p.juez,
            type: 'juez-problema'
        }

        jueces.add(recoJuez);
      });

      problems.forEach(p => {
        const recoSubtema1:Recomendation = {
          data:p.tema_2, type: 'tema'
        }

        const recoSubtema2:Recomendation = {
          data:p.tema_3, type: 'tema'
        }

        const recoSubtema3:Recomendation = {
          data:p.tema_4, type: 'tema'
        }
        if(!temas.has(recoSubtema1)){
          recoSubtema1.type = 'subtema-problema';
          subtemas.add(recoSubtema1);
        }
        if(!temas.has(recoSubtema2)){
          recoSubtema2.type = 'subtema-problema';
          subtemas.add(recoSubtema2);
          subtemas.add(recoSubtema2);
        }
        if(!temas.has(recoSubtema3)){
          recoSubtema3.type = 'subtema-problema';
          subtemas.add(recoSubtema3);
        }
      })
      this.addRecomendations([...temas, ...dificultades, ...jueces, ...subtemas]);


    });

    const librosPromise = lastValueFrom(
      this.bookService.getLibros()
    ).then(response => {

      response.forEach(l => {
        const recoLibro: Recomendation = {
          data: l.titulo,
          type: 'libro'
        };
        this.addRecomendations([recoLibro]);
      });
    });

    await Promise.all([
      superGruposPromise,
      problemasPromise,
      librosPromise,
      temarioPromise,
    ]);
  }

  addRecomendations(newRecomendations: Recomendation[]) {
    const currentRecomendations = this._recomendations();
    newRecomendations.forEach(rec => currentRecomendations.add(rec));
    this._recomendations.set(currentRecomendations);
  }

  getRecomendations(): Recomendation[] {
    return Array.from(this._recomendations());
  }
}
