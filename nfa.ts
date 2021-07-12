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

  nextState(states: Set<number>, character: string): Set<number> {
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
console.log(rulebook.nextState(new Set([1]), 'b'))
console.log(rulebook.nextState(new Set([1, 2]), 'a'))
console.log(rulebook.nextState(new Set([1, 3]), 'b'))
