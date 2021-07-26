class FARule {
  constructor(private state: number, private character: string, private nextState: number) {
  }

  appliesTo(state: number, character: string): boolean {
    return (this.state == state && this.character == character)
  }

  follow(): number {
    return this.nextState
  }

  inspect(): string {
    return `#<FARule ${this.state} --${this.character}--> ${this.nextState}>`
  }
}

class NFARulebook {
  constructor(private rules: FARule[]) {
  }

  nextStates(states: Set<number>, character: string): Set<number> {
    const results:number[][] = []
    for (const state of states) {
      results.push(this.followRulesFor(state, character).flat())
    }
    return new Set<number>(results.flat())
  }

  followRulesFor(state: number, character: string): number[] {
    return this.rulesFor(state, character).map( rule => rule.follow())
  }

  rulesFor(state: number, character: string): FARule[] {
    const rls: FARule[] = []
    for (const rule of this.rules) {
      if (rule.appliesTo(state, character)) {
        rls.push(rule)
      }
    }
    return rls
  }
}

const rulebook: NFARulebook = new NFARulebook([
   new FARule(1, 'a', 1),
   new FARule(1, 'b', 1),
   new FARule(1, 'b', 2),
   new FARule(2, 'a', 3),
   new FARule(2, 'b', 3),
   new FARule(3, 'a', 4),
   new FARule(3, 'b', 4)
 ])
console.log(rulebook)
console.log(rulebook.nextStates(new Set([1]), 'b'))
console.log(rulebook.nextStates(new Set([1, 2]), 'a'))
console.log(rulebook.nextStates(new Set([1, 3]), 'b'))


class NFA {
  constructor(private currentStates: Set<number>, private acceptStates: Set<number>, private ruleBook: NFARulebook) {
  }

  isAccepting(): boolean {
    for (const currentState of this.currentStates) {
      for (const acceptState of this.acceptStates) {
        if (currentState == acceptState) {
          return true
        }
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentStates = this.ruleBook.nextStates(this.currentStates, character)
  }

  readString(characters: string): void {
    for (const char of characters) {
      this.readCharacter(char)
    }
  }
}

console.log("\n NFA")
const nfa = new NFA(new Set([1]), new Set([4]), rulebook)
console.log(nfa.isAccepting())
nfa.readCharacter('b')
console.log(nfa.isAccepting())
nfa.readCharacter('a')
console.log(nfa.isAccepting())
nfa.readCharacter('b')
console.log(nfa.isAccepting())

const nfa2 = new NFA(new Set([1]), new Set([4]), rulebook)
console.log(nfa2.isAccepting())
nfa2.readString('bbbbb')
console.log(nfa2.isAccepting())

class NFADesign {
  constructor(private startState: number, private acceptStates: Set<number>, private rulebook: NFARulebook) {
  }

  toNfa(): NFA {
    return new NFA(new Set([this.startState]), this.acceptStates, this.rulebook)
  }

  isAccepts(characters: string): boolean {
    const nfa: NFA = this.toNfa()
    nfa.readString(characters)
    return nfa.isAccepting()
  }
}

console.log("\n NFADesign")
const nfaDesign = new NFADesign(1, new Set([4]), rulebook)
console.log(nfaDesign.isAccepts('bbbbb'))
console.log(nfaDesign.isAccepts('bbabb'))
