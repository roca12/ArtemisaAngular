type Item<T> = {
  value: T;
  priority: number;
};

export class PriorityQueue<T> {
  private items: Item<T>[] = [];

  private parentOf = (i: number) => Math.floor((i - 1) / 2);
  private leftOf   = (i: number) => 2 * i + 1;
  private rightOf  = (i: number) => 2 * i + 2;

  private swap(a: number, b: number): void {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = this.parentOf(i);
      if (this.items[i].priority <= this.items[parent].priority) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.items.length;

    while (true) {
      let largest = i;
      const left  = this.leftOf(i);
      const right = this.rightOf(i);

      if (left  < n && this.items[left].priority  > this.items[largest].priority) largest = left;
      if (right < n && this.items[right].priority > this.items[largest].priority) largest = right;
      if (largest === i) break;

      this.swap(i, largest);
      i = largest;
    }
  }

  enqueue(data: T, priority: number): void {
    this.items.push({ value: data, priority });
    this.bubbleUp(this.items.length - 1);
  }

  find(data: T): Item<T> | undefined {
    const target = data as Record<string, unknown>;

    return this.items.find(({ value }) => {
      const v = value as Record<string, unknown>;
      return v["data"] === target["data"] && v["type"] === target["type"];
    });
  }

  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined;
    if (this.items.length === 1) return this.items.pop()!.value;

    const top = this.items[0].value;
    this.items[0] = this.items.pop()!;
    this.bubbleDown(0);
    return top;
  }

  peek(): T | undefined {
    return this.items[0]?.value;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  forEach(callback: (item: T, index: number, array: T[]) => void): void {
    const values = this.items.map((obj) => obj.value);

    for (let i = 0; i < this.items.length; i++) {
      callback(this.items[i].value, i, values);
    }
  }

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
