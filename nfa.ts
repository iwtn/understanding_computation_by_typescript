import { assert, part } from './test'

export class FARule {
  constructor(private state: any, private character: string, private nextState: any) {
  }

  appliesTo(state: any, character: string): boolean {
    return (this.state == state && this.character == character)
  }

  follow(): any {
    return this.nextState
  }

  inspect(): string {
    return `#<FARule ${this.state} --${this.character}--> ${this.nextState}>`
  }
}

const isSubset = (moreStates: Set<any>, targetStates: Set<any>): boolean => {
  for (const ts of targetStates) {
    let isIn = false

    for(const ms of moreStates) {
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

export class NFARulebook {
  constructor(public rules: FARule[]) {
  }

  nextStates(states: Set<any>, character: string): Set<any> {
    const results:any[][] = []
    for (const state of states) {
      results.push(this.followRulesFor(state, character).flat())
    }
    return new Set<any>(results.flat())
  }

  followRulesFor(state: any, character: string): any[] {
    return this.rulesFor(state, character).map( rule => rule.follow())
  }

  rulesFor(state: any, character: string): FARule[] {
    const rls: FARule[] = []
    for (const rule of this.rules) {
      if (rule.appliesTo(state, character)) {
        rls.push(rule)
      }
    }
    return rls
  }

  followFreeMoves(states: Set<any>): Set<any> {
    const moreStates: Set<any> = this.nextStates(states, null)

    if (isSubset(states, moreStates)) {
      return states
    } else {
      return this.followFreeMoves(new Set(Array.from(states).concat(Array.from(moreStates))))
    }
  }
}

class NFA {
  constructor(private currentStates: Set<any>, private acceptStates: Set<any>, private ruleBook: NFARulebook) {
  }

  getCurrentStates(): Set<any> {
    return this.ruleBook.followFreeMoves(this.currentStates)
  }

  isAccepting(): boolean {
    for (const currentState of this.getCurrentStates()) {
      for (const acceptState of this.acceptStates) {
        if (currentState == acceptState) {
          return true
        }
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentStates = this.ruleBook.nextStates(this.getCurrentStates(), character)
  }

  readString(characters: string): void {
    for (const char of characters) {
      this.readCharacter(char)
    }
  }
}

export class NFADesign {
  constructor(public startState: any, public acceptStates: Set<any>, public rulebook: NFARulebook) {
  }

  toNfa(currentStates: Set<any> = (new Set([this.startState]))): NFA {
    return new NFA(currentStates, this.acceptStates, this.rulebook)
  }

  isAccepts(characters: string): boolean {
    const nfa: NFA = this.toNfa()
    nfa.readString(characters)
    return nfa.isAccepting()
  }
}


class NFASimulation {
  constructor(private nfaDesign: NFADesign) {
  }

  nextState(state: Set<any>, character: string): Set<any> {
    const nfa = this.nfaDesign.toNfa(state)
    nfa.readCharacter(character)
    return nfa.getCurrentStates()
  }
}

/*
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


part("NFA")
const nfa = new NFA(new Set([1]), new Set([4]), rulebook)
assert(false, nfa.isAccepting())
nfa.readCharacter('b')
assert(false, nfa.isAccepting())
nfa.readCharacter('a')
assert(false, nfa.isAccepting())
nfa.readCharacter('b')
assert(true, nfa.isAccepting())

const nfa2 = new NFA(new Set([1]), new Set([4]), rulebook)
assert(false, nfa2.isAccepting())
nfa2.readString('bbbbb')
assert(true, nfa2.isAccepting())

part("NFADesign")
const nfaDesign = new NFADesign(1, new Set([4]), rulebook)
assert(true, nfaDesign.isAccepts('bab'))
assert(true, nfaDesign.isAccepts('bbbbb'))
assert(false, nfaDesign.isAccepts('bbabb'))

part("NFADesign with Free Move")
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
assert(true, nfaDesign2.isAccepts('aa'))
assert(true, nfaDesign2.isAccepts('aaa'))
assert(false, nfaDesign2.isAccepts('aaaaa'))
assert(true, nfaDesign2.isAccepts('aaaaaa'))
assert(false, nfaDesign2.isAccepts('aaaaaaa'))

assert(true, isSubset(new Set([1, 2, 3]), new Set([1])))
assert(false, isSubset(new Set([1, 2, 3]), new Set([4])))
assert(true, isSubset(new Set([1, 2]), new Set([1, 2])))
assert(true, isSubset(new Set([1, 2, 3]), new Set([1, 3])))
assert(false, isSubset(new Set([1]), new Set([1, 2])))
assert(true, isSubset(new Set([1]), new Set([])))
*/

const rulebook2: NFARulebook = new NFARulebook([
   new FARule(1, 'a', 1),
   new FARule(1, 'a', 2),
   new FARule(1, null, 2),
   new FARule(2, 'b', 3),
   new FARule(3, 'b', 1),
   new FARule(3, null, 2)
])
console.log(rulebook2)
const nfaDesign3 = new NFADesign(1, new Set([3]), rulebook2)
console.log(nfaDesign3)
console.log(nfaDesign3.toNfa().getCurrentStates())
console.log(nfaDesign3.toNfa(new Set([2])).getCurrentStates())
console.log(nfaDesign3.toNfa(new Set([3])).getCurrentStates())

const simulation = new NFASimulation(nfaDesign3)
console.log(simulation)
console.log(simulation.nextState(new Set([1, 2]), 'a')) // #<Set: {1, 2}>
console.log(simulation.nextState(new Set([1, 2]), 'b')) // #<Set: {3, 2}>
console.log(simulation.nextState(new Set([3, 2]), 'b')) // #<Set: {1, 3, 2}>
console.log(simulation.nextState(new Set([1, 3, 2]), 'b')) // #<Set: {1, 3, 2}>
console.log(simulation.nextState(new Set([1, 3, 2]), 'a')) // #<Set: {1, 2}>
