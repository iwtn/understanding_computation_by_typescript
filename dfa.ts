import * as Immutable from 'immutable';

export class FARule {
  constructor(private state: any, private character: string, private next_tate: any) {
  }

  appliesTo(state: any, character: string): boolean {
    return (this.state == state && this.character == character)
  }

  follow(): any {
    return this.next_tate
  }

  inspect(): string {
    return `#<FARule ${this.state} --${this.character}--> ${this.next_tate}>`
  }
}

export class DFARulebook {
  constructor(private rules: FARule[]) {
  }

  nextState(state: any, character: string): any {
    return this.ruleFor(state, character).follow()
  }

  ruleFor(state: any, character: string): FARule {
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

class DFA {
  constructor(private currentState: any, private acceptStates: Immutable.Set<any>, private ruleBook: DFARulebook) {
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

let dfa = new DFA(1, Immutable.Set([3]), rulebook)
console.log(dfa.isAccepting())
dfa.readCharacter('b')
console.log(dfa.isAccepting())
dfa.readCharacter('a')
dfa.readCharacter('a')
dfa.readCharacter('a')
console.log(dfa.isAccepting())
dfa.readCharacter('b')
console.log(dfa.isAccepting())

dfa = new DFA(1, Immutable.Set([3]), rulebook)
dfa.readString('baaab')
console.log(dfa.isAccepting())

export class DFADesign {
  constructor(private startState: any, private acceptStates: Immutable.Set<any>, private rulebook: DFARulebook) {
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

const dd = new DFADesign(1, Immutable.Set([3]), rulebook)
console.log(dd.isAccepts('a'))
console.log(dd.isAccepts('baa'))
console.log(dd.isAccepts('baba'))
