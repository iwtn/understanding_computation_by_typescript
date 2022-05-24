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

  isSame(other: Stack<T>) {
    const size = this.contents.length
    if (size != other.contents.length) {
      return false
    }
    for(let i = 0; i < size; i++) {
      if(this.contents[i] != other.contents[i]) {
        return false
      }
    }
    return true
  }
}
