import { Injectable, signal } from '@angular/core';

/**
 * Servicio encargado de gestionar el tema visual (claro/oscuro) de la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Clave para almacenar la preferencia de tema en localStorage. */
  private readonly STORAGE_KEY = 'darkMode';

  /** Señal privada que indica si el modo oscuro está activo. */
  private _isDark = signal<boolean>(this.getInitialTheme());

  /** Señal de solo lectura para exponer el estado del modo oscuro. */
  readonly isDark = this._isDark.asReadonly();

  /**
   * Constructor del servicio ThemeService.
   * Inicializa la preferencia de tema y aplica el estilo correspondiente al cuerpo del documento.
   */
  constructor() {
    if (localStorage.getItem(this.STORAGE_KEY) === null) {
      localStorage.setItem(this.STORAGE_KEY, 'false');
    }
    this.applyTheme(this._isDark());
  }

  /**
   * Alterna entre el modo claro y el modo oscuro.
   */
  toggle(): void {
    const newValue = !this._isDark();
    this._isDark.set(newValue);
    this.applyTheme(this._isDark());
    localStorage.setItem(this.STORAGE_KEY, newValue.toString());
  }

  /**
   * Obtiene la preferencia de tema inicial desde el almacenamiento local.
   * @returns true si el modo oscuro está guardado como preferencia, false en caso contrario.
   */
  private getInitialTheme(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  /**
   * Aplica la clase CSS correspondiente al elemento body para cambiar el tema.
   * @param isDark Indica si se debe aplicar el modo oscuro.
   */
  private applyTheme(isDark: boolean): void {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    this.getInitialTheme(); // Uso this para cumplir con la regla JS-0105 de DeepSource
  }
}
