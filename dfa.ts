class FARule {
  constructor(private state: number, private character: string, private next_tate: number) {
  }

  appliesTo(state: number, character: string): boolean {
    return (this.state == state && this.character == character)
  }

  follow(): number {
    return this.next_tate
  }

  inspect(): string {
    return `#<FARule ${this.state} --${this.character}--> ${this.next_tate}>`
  }
}

class DFARulebook {
  constructor(private rules: FARule[]) {
  }

  nextState(state: number, character: string): number {
    return this.ruleFor(state, character).follow()
  }

  ruleFor(state: number, character: string): FARule {
    for (const rule of this.rules) {
      if (rule.appliesTo(state, character)) {
        return rule
      }
    }
  }
}

const rulebook = new DFARulebook([
  new FARule(1, 'a', 2),
  new FARule(1, 'b', 1),
  new FARule(2, 'a', 2),
  new FARule(2, 'b', 3),
  new FARule(3, 'a', 3),
  new FARule(3, 'b', 3)
])
console.log(rulebook)
console.log(rulebook.nextState(1, 'a'))
console.log(rulebook.nextState(1, 'b'))
console.log(rulebook.nextState(2, 'b'))
