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

  followFreeMoves(states: Set<number>): Set<number> {
    const moreStates: Set<number> = this.nextStates(states, null)

    if (this.isSubset(moreStates, states)) {
      return states
    } else {
      return this.followFreeMoves(moreStates)
    }
  }

  isSubset(moreStates: Set<number>, targetStates: Set<number>): boolean {
    for (const ms of moreStates) {
      let isIn = false

      for(const ts of targetStates) {
        if (ts == ms) {
          isIn = true
        }
      }

      if (isIn == false) {
        return false
      }
    }
    return true
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

  getCurrentState() {
    this.currentStates = this.ruleBook.followFreeMoves(this.currentStates)
    return this.currentStates
  }

  isAccepting(): boolean {
    for (const currentState of this.getCurrentState()) {
      for (const acceptState of this.acceptStates) {
        if (currentState == acceptState) {
          return true
        }
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentStates = this.ruleBook.nextStates(this.getCurrentState(), character)
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

console.log("\n NFADesign with Free Move")
const rulebookWithFree = new NFARulebook([
  new FARule(1, null, 2),
  new FARule(2, 'a',  3),
  new FARule(3, 'a',  2),
  new FARule(4, 'a',  5),
  new FARule(5, 'a',  6),
  new FARule(6, 'a',  4),
  new FARule(1, null, 4)
])
const nfaDesign2 = new NFADesign(1, new Set([2, 4]), rulebookWithFree)
console.log(nfaDesign2.isAccepts('aa'))
console.log(nfaDesign2.isAccepts('aaa'))
console.log(nfaDesign2.isAccepts('aaaaa'))
console.log(nfaDesign2.isAccepts('aaaaaa'))
