import { assert, part } from './test'
import { FARule, NFADesign, NFARulebook } from './nfa';

class Pattern {
  bracket(outerPrecedence: number): string {
    if (this.precedence() < outerPrecedence) {
      return '(' + this.toS() + ')'
    } else {
      return this.toS()
    }
  }

  inspect(): string {
    return `/${this.toS()}/`
  }

  toS(): string {
    throw new Error('error');
  }

  precedence(): number {
    throw new Error('error');
  }

  toNFADesign(): NFADesign {
    throw new Error('error');
  }

  isMatch(characters: string): boolean {
    return this.toNFADesign().isAccepts(characters)
  }
}

class Empty extends Pattern {
  toS(): string {
    return ''
  }

  precedence(): number {
    return 3
  }

  toNFADesign(): NFADesign {
    const startState = new Object()
    const acceptState = new Set([startState])
    const rulebook = new NFARulebook([])
    return new NFADesign(startState, acceptState, rulebook)
  }
}

class Literal extends Pattern {
  constructor(private character: string) {
    super()
  }

  toS(): string {
    return this.character
  }

  precedence(): number {
    return 3
  }

  toNFADesign(): NFADesign {
    const startState = 2
    const acceptState = 3
    const rule = new FARule(startState, this.character, acceptState)
    const rulebook = new NFARulebook([rule])
    return new NFADesign(startState, new Set([acceptState]), rulebook)
  }
}

class Concatenate extends Pattern {
  constructor(private first: Pattern, private second: Pattern) {
    super()
  }

  toS(): string {
    return `${this.first.bracket(this.precedence())}${this.second.bracket(this.precedence())}`
  }

  precedence(): number {
    return 1
  }

  toNFADesign(): NFADesign {
    const firstNFADesign = this.first.toNFADesign()
    const secondNFADesign = this.second.toNFADesign()

    const startState = firstNFADesign.startState
    const acceptStates = secondNFADesign.acceptStates
    const rules = firstNFADesign.rulebook.rules.concat(secondNFADesign.rulebook.rules)
    const extraRules:FARule[] = []
    for(const state of firstNFADesign.acceptStates) {
      extraRules.push(new FARule(state, null, secondNFADesign.startState))
    }
    const rulebook = new NFARulebook(rules.concat(extraRules))
    return new NFADesign(startState, acceptStates, rulebook)
  }
}

class Choose extends Pattern {
  constructor(private first: Pattern, private second: Pattern) {
    super()
  }

  toS(): string {
    return `${this.first.bracket(this.precedence())}|${this.second.bracket(this.precedence())}`
  }

  precedence(): number {
    return 0
  }

  toNFADesign(): NFADesign {
    const firstNFADesign = this.first.toNFADesign()
    const secondNFADesign = this.second.toNFADesign()

    const startState = new Object()
    const acceptStates = Array.from(firstNFADesign.acceptStates).concat(Array.from(secondNFADesign.acceptStates))
    const rules = firstNFADesign.rulebook.rules.concat(secondNFADesign.rulebook.rules)
    const extraRules:FARule[] = [
      new FARule(startState, null, firstNFADesign.startState),
      new FARule(startState, null, secondNFADesign.startState)
    ]
    const rulebook = new NFARulebook(rules.concat(extraRules))
    return new NFADesign(startState, new Set(acceptStates), rulebook)
  }
}

class Repeat extends Pattern {
  constructor(private pattern: Pattern) {
    super()
  }

  toS(): string {
    return this.pattern.bracket(this.precedence()) + '*'
  }

  precedence(): number {
    return 2
  }

  toNFADesign(): NFADesign {
    const patternNFADesign = this.pattern.toNFADesign()
    // const startState = new Object()
    const startState = 1
    const acceptStates = Array.from(patternNFADesign.acceptStates).concat([startState])
    const rules = patternNFADesign.rulebook.rules
    const extraRules = []
    for (const as of patternNFADesign.acceptStates) {
      extraRules.push(new FARule(as, null, patternNFADesign.startState))
    }
    extraRules.push(new FARule(startState, null, patternNFADesign.startState))
    const ruleBook = new NFARulebook(Array.from(rules).concat(extraRules))
    return new NFADesign(startState, new Set(acceptStates), ruleBook)
  }
}

/*
const pattern = new Repeat(new Choose(new Concatenate(new Literal('a'), new Literal('b')), new Literal('a')))
console.log(pattern)
console.log(pattern.inspect())

part('Empty')
const nfaDesign = new Empty().toNFADesign()
assert(true, nfaDesign.isAccepts(''))
assert(false, nfaDesign.isAccepts('a'))

part('Literal')
const nfaDesign2 = new Literal('a').toNFADesign()
assert(false, nfaDesign2.isAccepts(''))
assert(true, nfaDesign2.isAccepts('a'))
assert(false, nfaDesign2.isAccepts('b'))

part('Empty 2')
assert(true, (new Empty()).isMatch(''))
assert(false, (new Empty()).isMatch('a'))

part('Literal2')
assert(false, (new Literal('a')).isMatch(''))
assert(true, (new Literal('a')).isMatch('a'))
assert(false, (new Literal('a')).isMatch('b'))

part('Concatenate ab')
const pattern2 = new Concatenate(new Literal('a'), new Literal('b'))
console.log(pattern2)
assert('ab', pattern2.toS())
assert(false, pattern2.isMatch('a'))
assert(true, pattern2.isMatch('ab'))
assert(false, pattern2.isMatch('abc'))

part('Concatenate abc')
const pattern3 = new Concatenate(new Literal('a'), new Concatenate(new Literal('b'), new Literal('c')))
console.log(pattern3)
assert('abc', pattern3.toS())
assert(false, pattern3.isMatch('a'))
assert(false, pattern3.isMatch('ab'))
assert(true, pattern3.isMatch('abc'))

part('Choose')
const pattern4 = new Choose(new Literal('a'), new Literal('b'))
console.log(pattern4)
assert('a|b', pattern4.toS())
assert(true, pattern4.isMatch('a'))
assert(true, pattern4.isMatch('b'))
assert(false, pattern4.isMatch('c'))
assert(false, pattern4.isMatch('ab'))
*/

part('Repeat')
const pattern5 = new Repeat(new Literal('a'))
console.log(pattern5)
console.log(pattern5.toNFADesign())
assert('a*', pattern5.toS())
assert(true, pattern5.isMatch(''))
assert(true, pattern5.isMatch('a'))
assert(true, pattern5.isMatch('aaaa'))
assert(false, pattern5.isMatch('b'))
