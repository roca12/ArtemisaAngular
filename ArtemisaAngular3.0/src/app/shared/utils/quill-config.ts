import Quill from 'quill';
import type { QuillModules } from 'ngx-quill';

/**
 * Configuración de Quill para el editor de texto/teoría del temario.
 *
 * Por defecto Quill aplica tamaño, fuente y alineación mediante **clases CSS**
 * (`ql-size-*`, `ql-font-*`, `ql-align-*`) que solo tienen efecto dentro del
 * editor. Como la biblioteca renderiza el HTML crudo (con
 * `bypassSecurityTrustHtml`, ver `FormatearTextoPipe`), registramos los
 * atributos como **estilos inline** para que el HTML sea autónomo y se vea
 * igual fuera del editor.
 */

/** Tamaños de fuente ofrecidos (valores CSS reales para estilos inline). */
const TAMANIOS = ['12px', '14px', '16px', '18px', '24px', '32px', '48px'];
/** Familias tipográficas ofrecidas (genéricas, disponibles en todo navegador). */
const FUENTES = ['sans-serif', 'serif', 'monospace', 'cursive'];

// Atributos basados en estilo inline (en vez de clases).
const SizeStyle = Quill.import('attributors/style/size') as {
  whitelist: string[];
};
SizeStyle.whitelist = TAMANIOS;

const FontStyle = Quill.import('attributors/style/font') as {
  whitelist: string[];
};
FontStyle.whitelist = FUENTES;

const AlignStyle = Quill.import('attributors/style/align');

Quill.register(SizeStyle as unknown as Parameters<typeof Quill.register>[0], true);
Quill.register(FontStyle as unknown as Parameters<typeof Quill.register>[0], true);
Quill.register(AlignStyle as Parameters<typeof Quill.register>[0], true);

/** Módulos (barra de herramientas) del editor de temario. */
export const quillTemarioModules: QuillModules = {
  toolbar: [
    [{ font: FUENTES }, { size: TAMANIOS }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block', 'link'],
    ['clean'],
  ],
};
