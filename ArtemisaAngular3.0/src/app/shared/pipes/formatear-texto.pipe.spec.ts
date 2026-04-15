import { FormatearTextoPipe } from './formatear-texto.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('FormatearTextoPipe', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    sanitizer = {
      bypassSecurityTrustHtml: (val: string) => val,
    } as unknown as DomSanitizer;
  });

  it('create an instance', () => {
    const pipe = new FormatearTextoPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
