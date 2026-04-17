/**
 * Representa un elemento dentro de la cola de prioridad.
 * @template T Tipo del valor almacenado.
 */
type Item<T> = {
  /** El valor del elemento. */
  value: T;
  /** El puntaje de prioridad (mayor valor significa mayor prioridad). */
  priority: number;
};

/**
 * Implementación de una cola de prioridad utilizando un montículo (heap) máximo.
 * @template T Tipo de los elementos que se almacenarán en la cola.
 */
export class PriorityQueue<T> {
  /** Arreglo interno que almacena los elementos del montículo. */
  private items: Item<T>[] = [];

  /** Calcula el índice del padre de un nodo. */
  private static parentOf(i: number) {
    return Math.floor((i - 1) / 2);
  }
  /** Calcula el índice del hijo izquierdo de un nodo. */
  private static leftOf(i: number) {
    return 2 * i + 1;
  }
  /** Calcula el índice del hijo derecho de un nodo. */
  private static rightOf(i: number) {
    return 2 * i + 2;
  }

  /**
   * Intercambia dos elementos en el arreglo interno.
   * @param a Índice del primer elemento.
   * @param b Índice del segundo elemento.
   * @private
   */
  private swap(a: number, b: number): void {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }

  /**
   * Reestablece la propiedad de montículo hacia arriba desde un índice dado.
   * @param i Índice inicial.
   * @private
   */
  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = PriorityQueue.parentOf(i);
      if (this.items[i].priority <= this.items[parent].priority) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  /**
   * Reestablece la propiedad de montículo hacia abajo desde un índice dado.
   * @param i Índice inicial.
   * @private
   */
  private bubbleDown(i: number): void {
    const n = this.items.length;

    while (true) {
      let largest = i;
      const left = PriorityQueue.leftOf(i);
      const right = PriorityQueue.rightOf(i);

      if (left < n && this.items[left].priority > this.items[largest].priority)
        largest = left;
      if (
        right < n &&
        this.items[right].priority > this.items[largest].priority
      )
        largest = right;
      if (largest === i) break;

      this.swap(i, largest);
      i = largest;
    }
  }

  /**
   * Inserta un nuevo elemento en la cola con una prioridad dada.
   * @param data El valor a insertar.
   * @param priority La prioridad del valor.
   */
  enqueue(data: T, priority: number): void {
    this.items.push({ value: data, priority });
    this.bubbleUp(this.items.length - 1);
  }

  /**
   * Busca un elemento en la cola comparando sus propiedades internas (específicamente data y type).
   * @param data El valor a buscar.
   * @returns El Item encontrado o undefined si no existe.
   */
  find(data: T): Item<T> | undefined {
    const target = data as Record<string, unknown>;

    return this.items.find(({ value }) => {
      const v = value as Record<string, unknown>;
      return v['data'] === target['data'] && v['type'] === target['type'];
    });
  }

  /**
   * Extrae y devuelve el elemento con la mayor prioridad.
   * @returns El valor con mayor prioridad o undefined si la cola está vacía.
   */
  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined;
    if (this.items.length === 1) return this.items.pop()?.value;

    const top = this.items[0].value;
    const last = this.items.pop();
    if (last) {
      this.items[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  /**
   * Devuelve el elemento con la mayor prioridad sin extraerlo.
   * @returns El valor con mayor prioridad o undefined si la cola está vacía.
   */
  peek(): T | undefined {
    return this.items[0]?.value;
  }

  /**
   * Indica si la cola está vacía.
   * @returns true si no hay elementos, false en caso contrario.
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Obtiene la cantidad de elementos en la cola.
   * @returns Número de elementos.
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Ejecuta una función para cada elemento de la cola.
   * @param callback Función a ejecutar por cada elemento.
   */
  forEach(callback: (item: T, index: number, array: T[]) => void): void {
    const values = this.items.map((obj) => obj.value);

    for (let i = 0; i < this.items.length; i++) {
      callback(this.items[i].value, i, values);
    }
  }

  /**
   * Permite iterar sobre los elementos de la cola en su orden interno (no necesariamente por prioridad).
   */
  [Symbol.iterator](): Iterator<T> {
    let index = 0;
    const items = this.items;

    return {
      next(): IteratorResult<T> {
        if (index < items.length) {
          return { value: items[index++].value, done: false };
        }
        return { value: undefined as unknown as T, done: true };
      },
    };
  }
}
