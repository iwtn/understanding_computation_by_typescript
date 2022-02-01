import { assert, part } from './mytst'
import * as Immutable from 'immutable';

export class FARule {
  constructor(private state: any, private character: string, private nextState: any) {
  }

  appliesTo(state: any, character: string): boolean {
    return (this.state == state && this.character == character)
  }

  getCharacter(): string {
    return this.character
  }

  follow(): any {
    return this.nextState
  }

  inspect(): string {
    return `#<FARule ${this.state} --${this.character}--> ${this.nextState}>`
  }
}

export class NFARulebook {
  constructor(public rules: FARule[]) {
  }

  nextStates(states: Immutable.Set<any>, character: string): Immutable.Set<any> {
    const results:any[][] = []
    for (const state of states) {
      results.push(this.followRulesFor(state, character).flat())
    }
    return Immutable.Set(results.flat())
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

  followFreeMoves(states: Immutable.Set<any>): Immutable.Set<any> {
    const moreStates: Immutable.Set<any> = this.nextStates(states, null)

    if (moreStates.isSubset(states)) {
      return states
    } else {
      return this.followFreeMoves(Immutable.Set(Array.from(states).concat(Array.from(moreStates))))
    }
  }

  alphabet(): string[] {
    const array = this.rules.map(rule => rule.getCharacter())
    let charas = Immutable.Set([])
    for(const item of array) {
      if (item != null) {
        charas = charas.add(item)
      }
    }
    return charas.toArray()
  }
}

class NFA {
  constructor(private currentStates: Immutable.Set<any>, private acceptStates: Immutable.Set<any>, private ruleBook: NFARulebook) {
  }

  getCurrentStates(): Immutable.Set<any> {
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
  constructor(public startState: any, public acceptStates: Immutable.Set<any>, public rulebook: NFARulebook) {
  }

  toNfa(currentStates: Immutable.Set<any> = Immutable.Set([this.startState])): NFA {
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

  nextStates(state: Immutable.Set<any>, character: string): Immutable.Set<any> {
    const nfa = this.nfaDesign.toNfa(state)
    nfa.readCharacter(character)
    return nfa.getCurrentStates()
  }

  rulesFor(state: Immutable.Set<any>): FARule[] {
    const newRules: FARule[] = []
    for (const c of this.nfaDesign.rulebook.alphabet()) {
      newRules.push(new FARule(state, c, this.nextStates(state, c)))
    }
    return newRules
  }

  discoverStatesAndRules(states: Immutable.Set<any>): any {
    const rules: FARule[] = []
    for (const state of states) {
      for (const r of this.rulesFor(state)) {
        rules.push(r)
      }
    }
    let moreStates = Immutable.Set([])
    for (const rule of rules) {
      moreStates = moreStates.add(rule.follow())
    }

    if (moreStates.isSubset(states)) {
      return [states, rules]
    } else {
      return this.discoverStatesAndRules(Immutable.Set(states.toArray().concat(moreStates.toArray())))
    }
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
console.log(rulebook.nextStates(Immutable.Set([1]), 'b').toJSON())
console.log(rulebook.nextStates(Immutable.Set([1, 2]), 'a').toJSON())
console.log(rulebook.nextStates(Immutable.Set([1, 3]), 'b').toJSON())


part("NFA")
const nfa = new NFA(Immutable.Set([1]), Immutable.Set([4]), rulebook)
assert(false, nfa.isAccepting())
nfa.readCharacter('b')
assert(false, nfa.isAccepting())
nfa.readCharacter('a')
assert(false, nfa.isAccepting())
nfa.readCharacter('b')
assert(true, nfa.isAccepting())

const nfa2 = new NFA(Immutable.Set([1]), Immutable.Set([4]), rulebook)
assert(false, nfa2.isAccepting())
nfa2.readString('bbbbb')
assert(true, nfa2.isAccepting())

part("NFADesign")
const nfaDesign = new NFADesign(1, Immutable.Set([4]), rulebook)
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
const nfaDesign2 = new NFADesign(1, Immutable.Set([2, 4]), rulebookWithFree)
assert(true, nfaDesign2.isAccepts('aa'))
assert(true, nfaDesign2.isAccepts('aaa'))
assert(false, nfaDesign2.isAccepts('aaaaa'))
assert(true, nfaDesign2.isAccepts('aaaaaa'))
assert(false, nfaDesign2.isAccepts('aaaaaaa'))
*/

part("Simulation")
const rulebook3: NFARulebook = new NFARulebook([
   new FARule(1, 'a', 1),
   new FARule(1, 'a', 2),
   new FARule(1, null, 2),
   new FARule(2, 'b', 3),
   new FARule(3, 'b', 1),
   new FARule(3, null, 2),
])
console.log(rulebook3)
const nfaDesign3 = new NFADesign(1, Immutable.Set([3]), rulebook3)
console.log(nfaDesign3)
console.log(nfaDesign3.toNfa().getCurrentStates().toJSON())
console.log(nfaDesign3.toNfa(Immutable.Set([2])).getCurrentStates().toJSON())
console.log(nfaDesign3.toNfa(Immutable.Set([3])).getCurrentStates().toJSON())

const simulation = new NFASimulation(nfaDesign3)
console.log(simulation)
console.log(simulation.nextStates(Immutable.Set([1, 2]), 'a').toJSON()) // #<Set: {1, 2}>
console.log(simulation.nextStates(Immutable.Set([1, 2]), 'b').toJSON()) // #<Set: {3, 2}>
console.log(simulation.nextStates(Immutable.Set([3, 2]), 'b').toJSON()) // #<Set: {1, 3, 2}>
console.log(simulation.nextStates(Immutable.Set([1, 3, 2]), 'b').toJSON()) // #<Set: {1, 3, 2}>
console.log(simulation.nextStates(Immutable.Set([1, 3, 2]), 'a').toJSON()) // #<Set: {1, 2}>

part("Alphabet & RulesFor")
console.log(rulebook3.alphabet())
console.log(simulation.rulesFor(Immutable.Set([1, 2])))
console.log(simulation.rulesFor(Immutable.Set([3, 2])))

part("Discover States & Rules")
const startState = nfaDesign3.toNfa().getCurrentStates()
console.log(startState)
console.log(simulation.discoverStatesAndRules(Immutable.Set([startState])))
