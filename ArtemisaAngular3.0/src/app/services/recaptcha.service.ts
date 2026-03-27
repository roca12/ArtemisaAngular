import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  constructor(private http: HttpClient) {}

  verificarCaptcha(token: string): Observable<{ esHumano: boolean }> {
    return this.http.post<{ esHumano: boolean }>(
      environment.apiUrl + 'usuario/autenticar/captcha',
      { token },
    );
  }
}
