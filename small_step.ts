class Nmbr {
  constructor(public value: any) {
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

  reduce(environment: object): any {
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

  reduce(environment: object): any {
    if (this.left.isReducible()) {
      return new Add(this.left.reduce(environment), this.right)
    } else if (this.right.isReducible()) {
      return new Add(this.left, this.right.reduce(environment))
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

  reduce(environment: object): any {
    if (this.left.isReducible()) {
      return new Multiply(this.left.reduce(environment), this.right)
    } else if (this.right.isReducible()) {
      return new Multiply(this.left, this.right.reduce(environment))
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

/*
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
*/

class Machine {
  constructor(public expression: any, public environment: object) {
  }

  step(): void {
    this.expression = this.expression.reduce(this.environment)
  }

  run(): void {
    while(this.expression.isReducible()) {
      console.log(this.expression.inspect())
      this.step()
    }
    console.log(this.expression.inspect())
  }
}

(new Machine(new Add(new Multiply(new Nmbr(1), new Nmbr(2)), new Multiply(new Nmbr(3), new Nmbr(4))), {})).run()

class Bool {
  constructor(public value: boolean) {
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

  reduce(environment: object): any {
  }
}

class LessThan extends Bool {
  constructor(private left: Nmbr, private right: Nmbr) {
    super(left.value < right.value)
  }

  inspect(): string {
    return `<<${this.left.toString()} < ${this.right.toString()}>>`
  }

  toString(): string {
    return `${this.left} < ${this.right}`
  }

  isReducible(): boolean {
    return true
  }

  reduce(environment: object): any {
    if (this.left.isReducible()) {
      return new LessThan(this.left.reduce(environment), this.right)
    } else if (this.right.isReducible()) {
      return new LessThan(this.left, this.right.reduce(environment))
    } else {
      return new Bool(this.left.value < this.right.value)
    }
  }
}

(new Machine(new LessThan(new Nmbr(5), new Add(new Nmbr(2), new Nmbr(2))), {})).run()

class Variable {
  constructor(public value: any) {
  }

  inspect(): string {
    return `<<${this.value}>>`
  }

  toString(): string {
    return `${this.value}`
  }

  isReducible() : boolean {
    return true
  }

  reduce(environment: object): any {
    return environment[this.value]
  }
}

(new Machine(new Add(new Variable('x'), new Variable('y')), { x: (new Nmbr(3)), y: (new Nmbr(4)) })).run()

class DoNothing {
  inspect(): string {
    return `<<${this}>>`
  }

  toString(): string {
    return 'do-nothing'
  }

  isReducible() : boolean {
    return false
  }

  equal(otherStatement: any): boolean {
    return otherStatement.instanceof(DoNothing)
  }
}

class Assign {
  constructor(public name: any, public expression: any) {
  }

  inspect(): string {
    return `<<${this}>>`
  }

  toString(): string {
    return `${this.name} = ${this.expression}`
  }

  isReducible() : boolean {
    return true
  }

  reduce(environment: object): any {
    if (this.expression.isReducible()) {
      return [new Assign(this.name, this.expression.reduce(environment)), environment]
    } else {
      const addEnv: object = {}
      addEnv[this.name] = this.expression
      return [new DoNothing(), (<any>Object).assign(environment, addEnv)]
    }
  }
}

class StatementMachine {
  constructor(public statement: any, public environment: object) {
  }

  step(): void {
    const result = this.statement.reduce(this.environment)
    this.statement = result[0]
    this.environment = result[1]
  }

  run(): void {
    while(this.statement.isReducible()) {
      console.log(this.statement.inspect(), this.environment)
      this.step()
    }
    console.log(this.statement.inspect(), this.environment)
  }
}

(new StatementMachine(
  new Assign('x', new Add(new Variable('x'), new Nmbr(1))),
  { x: new Nmbr(2) }
)).run()

class If {
  constructor(public condition: any, public consequence: any, public altervative: any) {
  }

  inspect(): string {
    return `<<${this}>>`
  }

  toString(): string {
    return `if i(${this.condition}) { ${this.consequence} } else { ${this.altervative} }`
  }

  isReducible() : boolean {
    return true
  }

  reduce(environment: object): any {
    let first: any = null
    let second: any = null
    if (this.condition.isReducible()) {
      first = new If(this.condition.reduce(environment), this.consequence, this.altervative)
      second = environment
    } else {
      switch (this.condition.value) {
        case (true):
          first = this.consequence
          second = environment
          break;
        case (false):
          first = this.altervative
          second = environment
          break;
        default:
          break;
      }
    }
    return [first, second]
  }
}

(new StatementMachine(
  new If(new Variable('x'), new Assign('y', new Nmbr(1)),  new Assign('y', new Nmbr(2))),
  { x: new Bool(true) }
)).run()

class Sequence {
  constructor(public first: any, public second: any) {
  }

  inspect(): string {
    return `<<${this}>>`
  }

  toString(): string {
    return `${this.first}; ${this.second}`
  }

  isReducible() : boolean {
    return true
  }

  reduce(environment: object): any {
    if (this.first instanceof DoNothing) {
      return [this.second, environment]
    } else {
      const result = this.first.reduce(environment)
      return [new Sequence(result[0], this.second), result[1]]
    }
  }
}

(new StatementMachine(
  new Sequence(
    new Assign('x', new Add(new Nmbr(1), new Nmbr(1))),
    new Assign('y', new Add(new Variable('x'), new Nmbr(3)))
  ),
  {}
)).run()

class While {
  constructor(public condition: any, public body: any) {
  }

  inspect(): string {
    return `<<${this}>>`
  }

  toString(): string {
    return `while (${this.condition}) { ${this.body} }`
  }

  isReducible() : boolean {
    return true
  }

  reduce(environment: object): any {
    return [new If(this.condition, new Sequence(this.body, this), new DoNothing()), environment]
  }
}

(new StatementMachine(
  new While(
    new LessThan(new Variable('x'), new Nmbr(5)),
    new Assign('x', new Multiply(new Variable('x'), new Nmbr(3)))
  ),
  {
    x: new Nmbr(1),
  }
)).run()
