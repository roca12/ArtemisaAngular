type Item<T> = {
  value: T;
  priority: number;
}

export class PriorityQueue<T> {
  private items: Item<T>[] = [];

  enqueue(data: T, priority: number): void {
    const item = { value: data, priority };
    let inserted = false;
    for (let i = 0; i < this.items.length; i++) {
      if (item.priority > this.items[i].priority) {
        this.items.splice(i, 0, item);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      this.items.push(item);
    }
  }

  find(data: T){
    return this.items.find(item =>
      (item.value as any).data === (data as any).data &&
      (item.value as any).type === (data as any).type);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.value;
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
    this.items.forEach(obj => callback(obj.value, this.items.indexOf(obj), this.items.map(x => x.value)));
  }

  [Symbol.iterator](): Iterator<T> {
    let index = 0;

    const values = this.items.map(obj => obj.value);
    return {
      next: () => {
        if(index<values.length){
          return {value: values[index++], done: false};
        }else{
          return {value: undefined, done: true}
        }
      }
    }
  }
}
