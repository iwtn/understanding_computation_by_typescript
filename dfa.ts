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

class DFA {
  constructor(private currentState: number, private acceptStates: number[], private ruleBook: DFARulebook) {
  }

  isAccepting(): boolean {
    for (const as of this.acceptStates) {
      if (as == this.currentState) {
        return true
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentState = rulebook.nextState(this.currentState, character)
  }

  readString(characters: string): void {
    for (const char of characters) {
      this.readCharacter(char)
    }
  }
}

let dfa = new DFA(1, [3], rulebook)
console.log(dfa.isAccepting())
dfa.readCharacter('b')
console.log(dfa.isAccepting())
dfa.readCharacter('a')
dfa.readCharacter('a')
dfa.readCharacter('a')
console.log(dfa.isAccepting())
dfa.readCharacter('b')
console.log(dfa.isAccepting())

dfa = new DFA(1, [3], rulebook)
dfa.readString('baaab')
console.log(dfa.isAccepting())

class DFADesign {
  constructor(private startState: number, private acceptStates: number[], private rulebook: DFARulebook) {
  }

  toDfa(): DFA {
    return new DFA(this.startState, this.acceptStates, this.rulebook)
  }

  isAccepts(characters: string): boolean {
    const dfa: DFA = this.toDfa()
    dfa.readString(characters)
    return dfa.isAccepting()
  }
}

const dd = new DFADesign(1, [3], rulebook)
console.log(dd.isAccepts('a'))
console.log(dd.isAccepts('baa'))
console.log(dd.isAccepts('baba'))
