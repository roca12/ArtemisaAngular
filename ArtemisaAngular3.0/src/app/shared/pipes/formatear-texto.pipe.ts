import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatearTexto',
  standalone: true,
})
export class FormatearTextoPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(texto: string | null): SafeHtml {
    if (!texto) return '';

    const formateado = texto
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return this.sanitizer.bypassSecurityTrustHtml(formateado);
  }
}
