class Nmbr {
  constructor(public value: any) {
  }

  evaluate(environment: object): any {
    return this
  }
}

class Bool {
  constructor(public value: boolean) {
  }

  evaluate(environment: object): any {
    return this
  }
}

class Variable {
  constructor(public name: any) {
  }

  evaluate(environment: object): any {
    return environment[this.name]
  }
}

class Add {
  constructor(private left: any, private right: any) {
  }

  evaluate(environment: object): any {
    return new Nmbr(this.left.evaluate(environment).value + this.right.evaluate(environment).value)
  }
}

class Multiply {
  constructor(private left: any, private right: any) {
  }

  evaluate(environment: object): any {
    return new Nmbr(this.left.evaluate(environment).value * this.right.evaluate(environment).value)
  }
}

class LessThan {
  constructor(private left: any, private right: any) {
  }

  evaluate(environment: object): any {
    return new Bool(this.left.evaluate(environment).value < this.right.evaluate(environment).value)
  }
}

console.log(new Nmbr(23).evaluate({}))
console.log(new Variable('x').evaluate({ x: new Nmbr(23)}))
const result = new LessThan(
  new Add(new Variable('x'), new Nmbr(2)),
  new Variable('y')
).evaluate({ x: new Nmbr(2), y: new Nmbr(5) })
console.log(result)
