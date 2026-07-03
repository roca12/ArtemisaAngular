import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

// El worker de pdf.js se copia a /assets desde node_modules (ver angular.json).
GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs';

/** Portada generada a partir de un PDF. */
export interface Portada {
  /** Imagen lista para subir (JPEG). */
  file: File;
  /** Data URL para previsualizar en un `<img>`. */
  dataUrl: string;
}

/**
 * Renderiza la primera página de un PDF a una imagen JPEG.
 *
 * Se usa para generar automáticamente la portada de un libro a partir de su
 * PDF, sin que el administrador tenga que aportar una imagen.
 *
 * @param pdf Archivo PDF de origen.
 * @param nombre Nombre del archivo de imagen resultante.
 * @param anchoObjetivo Ancho deseado de la portada en píxeles.
 * @returns La imagen de portada como `File` y su data URL de previsualización.
 */
export async function extraerPortada(
  pdf: File,
  nombre = 'portada.jpg',
  anchoObjetivo = 600,
): Promise<Portada> {
  const buffer = await pdf.arrayBuffer();
  const loadingTask = getDocument({ data: buffer });
  const doc = await loadingTask.promise;
  try {
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = anchoObjetivo / base.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No se pudo crear el contexto del canvas.');
    }

    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('toBlob devolvió null'))),
        'image/jpeg',
        0.85,
      );
    });
    return { file: new File([blob], nombre, { type: 'image/jpeg' }), dataUrl };
  } finally {
    await loadingTask.destroy();
  }
}
