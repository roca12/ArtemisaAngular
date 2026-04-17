import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe que transforma texto plano en HTML seguro, reemplazando saltos de línea y tabulaciones.
 * Utiliza DomSanitizer para asegurar que el contenido resultante sea tratado como HTML confiable.
 */
@Pipe({
  name: 'formatearTexto',
  standalone: true,
})
export class FormatearTextoPipe implements PipeTransform {
  /**
   * Constructor del pipe.
   * @param sanitizer Servicio para desinfectar y marcar contenido HTML como seguro.
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Transforma el texto de entrada aplicando formato HTML básico.
   * @param texto El texto plano a formatear.
   * @returns Un objeto SafeHtml con los saltos de línea y tabulaciones convertidos.
   */
  transform(texto: string | null): SafeHtml {
    if (!texto) return '';

    const formateado = texto
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return this.sanitizer.bypassSecurityTrustHtml(formateado);
  }
}
