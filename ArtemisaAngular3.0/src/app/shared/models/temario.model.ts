/**
 * Representa un tema detallado dentro del temario de programación competitiva.
 */
export interface Temario {
  /** Identificador único del tema. */
  ID: number;
  /** Grupo superior al que pertenece el tema. */
  supergrupo: string;
  /** Nombre del tema. */
  tema: string;
  /** Descripción o contenido teórico del tema. */
  texto: string;
  /** Información sobre la complejidad temporal del algoritmo asociado. */
  complejidad_tiempo: string;
  /** Código de ejemplo en Java. */
  java: string;
  /** Código de ejemplo en C++. */
  cpp: string;
  /** Código de ejemplo en Python. */
  py: string;
  /** Orden jerárquico principal. */
  orden: number;
  /** Orden jerárquico secundario. */
  suborden: number;
  /** Fecha de creación del registro. */
  fecha_creacion: string;
  /** Fecha de la última modificación del registro. */
  fecha_modificacion: string;
}
