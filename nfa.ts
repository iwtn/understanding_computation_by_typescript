import { assert, part } from './mytst'
import * as Immutable from 'immutable';
import { FARule } from './farule';
import { DFADesign, DFARulebook } from './dfa';

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

  alphabet(): Immutable.Set<any> {
    const array = this.rules.map(rule => rule.getCharacter())
    let charas = Immutable.Set([])
    for(const item of array) {
      if (item != null) {
        charas = charas.add(item)
      }
    }
    return Immutable.Set(charas.toArray())
  }
}

export class NFA {
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


export class NFASimulation {
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

  toDFADesigin(): DFADesign {
    const startState = this.nfaDesign.toNfa().getCurrentStates()
    const result = this.discoverStatesAndRules(Immutable.Set([startState]))
    const states = result[0]
    const rules = result[1]
    let acceptStates = Immutable.Set([])
    for (const state of states) {
      if (this.nfaDesign.toNfa(state).isAccepting) {
        acceptStates.add(state)
      }
    }
    return new DFADesign(startState, acceptStates, new DFARulebook(rules))
  }
}
