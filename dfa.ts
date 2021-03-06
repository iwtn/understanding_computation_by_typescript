import * as Immutable from 'immutable';
import { FARule } from './farule';

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

export class DFA {
  constructor(private currentState: any, private acceptStates: Immutable.Set<any>, private ruleBook: DFARulebook) {
  }

  isAccepting(): boolean {
    for (const acs of this.acceptStates) {
      if (typeof(acs) == 'object' && typeof(this.currentState) == 'object') {
        if (acs.equals(this.currentState)) {
          return true
        }
      } else {
        if (acs == this.currentState) {
          return true
        }
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentState = this.ruleBook.nextState(this.currentState, character)
  }

  readString(characters: string): void {
    for (const char of characters) {
      this.readCharacter(char)
    }
  }
}

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
