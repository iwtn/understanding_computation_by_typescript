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

class Assign {
  constructor(public name: any, public expression: any) {
  }

  evaluate(environment: object): any {
    environment[this.name] = this.expression.evaluate(environment)
    return environment
  }
}

class If {
  constructor(public condition: any, public consequence: any, public altervative: any) {
  }

  evaluate(environment: object): any {
    if (this.condition.evaluate(environment).value) {
      return this.consequence.evaluate(environment)
    } else {
      return this.altervative.evaluate(environment)
    }
  }
}

class Sequence {
  constructor(public first: any, public second: any) {
  }

  evaluate(environment: object): any {
    return this.second.evaluate(this.first.evaluate(environment))
  }
}

class While {
  constructor(public condition: any, public body: any) {
  }

  evaluate(environment: object): any {
    if (this.condition.evaluate(environment).value) {
      return this.evaluate(this.body.evaluate(environment))
    } else {
      return environment
    }
  }
}

let statement = new While(
  new LessThan(new Variable('x'), new Nmbr(5)),
  new Assign('x', new Multiply(new Variable('x'), new Nmbr(3)))
)
console.log(statement.evaluate({ x: new Nmbr(1) }))
