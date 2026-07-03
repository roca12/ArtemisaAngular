import { Injectable, signal } from '@angular/core';

/** Opciones para personalizar el diálogo de confirmación. */
export interface ConfirmOptions {
  /** Título del diálogo. */
  titulo?: string;
  /** Mensaje principal (la pregunta). */
  mensaje: string;
  /** Texto del botón que confirma la acción. */
  textoConfirmar?: string;
  /** Texto del botón que cancela. */
  textoCancelar?: string;
  /** Si la acción es destructiva, el botón de confirmar se muestra en rojo. */
  peligro?: boolean;
}

/** Estado interno del diálogo cuando está visible. */
interface ConfirmState extends ConfirmOptions {
  titulo: string;
  textoConfirmar: string;
  textoCancelar: string;
  peligro: boolean;
}

/**
 * Servicio de confirmación reutilizable que reemplaza el `confirm()` nativo del
 * navegador (bloqueante y no estilizable) por un diálogo propio.
 *
 * `ConfirmDialogComponent`, montado una sola vez en la raíz de la app, observa
 * el estado de este servicio y renderiza el diálogo. Los componentes solo llaman
 * a `ask(...)` y esperan el booleano resultante.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  /** Estado actual del diálogo; `null` cuando está oculto. */
  private readonly _state = signal<ConfirmState | null>(null);
  /** Señal de solo lectura para que el diálogo se renderice. */
  readonly state = this._state.asReadonly();

  /** Resolver de la promesa pendiente devuelta por `ask`. */
  private resolver: ((confirmado: boolean) => void) | null = null;

  /**
   * Muestra el diálogo y espera la decisión del usuario.
   * @param opciones Configuración del diálogo (mensaje obligatorio).
   * @returns `true` si el usuario confirma; `false` si cancela o cierra.
   */
  ask(opciones: ConfirmOptions): Promise<boolean> {
    this._state.set({
      titulo: opciones.titulo ?? 'Confirmar',
      mensaje: opciones.mensaje,
      textoConfirmar: opciones.textoConfirmar ?? 'Aceptar',
      textoCancelar: opciones.textoCancelar ?? 'Cancelar',
      peligro: opciones.peligro ?? false,
    });
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  /** Confirma la acción y cierra el diálogo. */
  confirmar(): void {
    this.cerrar(true);
  }

  /** Cancela la acción y cierra el diálogo. */
  cancelar(): void {
    this.cerrar(false);
  }

  /**
   * Resuelve la promesa pendiente y oculta el diálogo.
   * @param confirmado Decisión del usuario.
   */
  private cerrar(confirmado: boolean): void {
    this.resolver?.(confirmado);
    this.resolver = null;
    this._state.set(null);
  }
}
