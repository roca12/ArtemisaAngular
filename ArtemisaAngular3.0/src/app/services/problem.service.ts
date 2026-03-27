import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Problema} from '../shared/models/problema.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProblemService {
  private readonly baseUrl: string = environment.apiUrl +'problema/';
  constructor(private http: HttpClient) { }
  getProblems() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  createProblem(problem: Problema) {
    return this.http.post(`${this.baseUrl}crear`, problem);
  }
}
