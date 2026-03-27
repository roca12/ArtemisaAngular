import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'darkMode';


  private _isDark = signal<boolean>(this.getInitialTheme());


  readonly isDark = this._isDark.asReadonly();

  constructor() {
    if (localStorage.getItem(this.STORAGE_KEY) === null) {
      localStorage.setItem(this.STORAGE_KEY, 'false');
    }
    this.applyTheme(this._isDark())
  }

  toggle(): void {
    const newValue = !this._isDark();
    this._isDark.set(newValue);
    this.applyTheme(this._isDark())
    localStorage.setItem(this.STORAGE_KEY, newValue.toString());
  }

  private getInitialTheme(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }
}
