export class Stack<T> {
  constructor(private contents: T[]) {
  }

  pop(): Stack<T> {
    this.contents.shift()
    return new Stack(this.contents)
  }

  push(content: T): Stack<T> {
    this.contents.unshift(content)
    return new Stack(this.contents)
  }

  top(): T {
    return this.contents[0]
  }
}
