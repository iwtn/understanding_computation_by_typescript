class Nmbr {
  constructor(public value: number) {
  }

  inspect(): string {
    return `<<${this.value}>>`
  }

  toString(): string {
    return `${this.value}`
  }

  isReducible() : boolean {
    return false
  }

  reduce(): any {
  }
}

class Add extends Nmbr{
  constructor(private left: Nmbr, private right: Nmbr) {
    super(left.value + right.value)
  }

  inspect(): string {
    return `<<${this.left.toString()} + ${this.right.toString()}>>`
  }

  toString(): string {
    return `${this.left} + ${this.right}`
  }

  isReducible(): boolean {
    return true
  }

  reduce(): any {
    if (this.left.isReducible()) {
      return new Add(this.left.reduce(), this.right)
    } else if (this.right.isReducible()) {
      return new Add(this.left, this.right.reduce())
    } else {
      return new Nmbr(this.left.value + this.right.value)
    }
  }
}

class Multiply extends Nmbr {
  constructor(private left: Nmbr, private right: Nmbr) {
    super(left.value * right.value)
  }

  inspect(): string {
    return `<<${this.left.toString()} * ${this.right.toString()}>>`
  }

  toString(): string {
    return `${this.left} * ${this.right}`
  }

  isReducible(): boolean {
    return true
  }

  reduce(): any {
    if (this.left.isReducible()) {
      return new Multiply(this.left.reduce(), this.right)
    } else if (this.right.isReducible()) {
      return new Multiply(this.left, this.right.reduce())
    } else {
      return new Nmbr(this.left.value * this.right.value)
    }
  }
}

const add = new Add(new Multiply(new Nmbr(1), new Nmbr(2)), new Multiply(new Nmbr(3), new Nmbr(4)))
console.log(add.inspect())
console.log(new Nmbr(5).inspect())

console.log((new Nmbr(1)).isReducible())
console.log(add.isReducible())

let expression = new Add(new Multiply(new Nmbr(1), new Nmbr(2)), new Multiply(new Nmbr(3), new Nmbr(4)))
console.log(expression.inspect())
console.log(expression.isReducible())
expression = expression.reduce()
console.log(expression.inspect())
console.log(expression.isReducible())
expression = expression.reduce()
console.log(expression.inspect())
console.log(expression.isReducible())
expression = expression.reduce()
console.log(expression.inspect())
console.log(expression.isReducible())

class Machine {
  constructor(public expression: any) {
  }

  step(): void {
    this.expression = this.expression.reduce()
  }

  run(): void {
    while(this.expression.isReducible()) {
      console.log(this.expression.inspect())
      this.step()
    }
    console.log(this.expression.inspect())
  }
}

(new Machine(new Add(new Multiply(new Nmbr(1), new Nmbr(2)), new Multiply(new Nmbr(3), new Nmbr(4))))).run()
