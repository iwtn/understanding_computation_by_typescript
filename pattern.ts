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
    const startState = new Object()
    const acceptState = new Object()
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
}

class Repeat extends Pattern {
  constructor(private pattern: Pattern) {
    super()
  }

  toS(): string {
    return this.pattern.bracket(this.precedence()) + '*'
  }

  precedence(): number {
    return 3
  }
}

const pattern = new Repeat(new Choose(new Concatenate(new Literal('a'), new Literal('b')), new Literal('a')))
console.log(pattern)
console.log(pattern.inspect())

const nfaDesign = new Empty().toNFADesign()
console.log(nfaDesign.isAccepts(''))
console.log(nfaDesign.isAccepts('a'))
const nfaDesign2 = new Literal('a').toNFADesign()
console.log(nfaDesign2.isAccepts(''))
console.log(nfaDesign2.isAccepts('a'))
console.log(nfaDesign2.isAccepts('b'))

console.log((new Empty()).isMatch('a'))
console.log((new Literal('a')).isMatch('a'))
