import { Stack } from './stack'

export class PDAConfiguration<T> {
  constructor(public state: any, public stack: Stack<T>) {
  }
}

export class PDARule<T> {
  constructor(public state: any, public character: string, public nextState: any, public popCharacter: T, public pushCharacters: T[]) {
  }

  appliesTo(configuration: PDAConfiguration<T>, character: string): boolean {
    return this.state == configuration.state && this.popCharacter == configuration.stack.top() && this.character == character
  }

  follow(configuration: PDAConfiguration<T>): PDAConfiguration<T> {
    return new PDAConfiguration<T>(this.nextState, this.nextStack(configuration))
  }

  nextStack(configuration: PDAConfiguration<T>): Stack<T> {
    let popedStack = configuration.stack.pop()
    const rpc = this.pushCharacters.concat().reverse();
    for (const c of rpc) {
      popedStack = popedStack.push(c)
    }
    return popedStack
  }
}

export class DPDARulebook<T> {
  constructor(public rules: PDARule<T>[]) {
  }

  nextConfiguration(configuration: PDAConfiguration<T>, character: string): PDAConfiguration<T> {
    return this.ruleFor(configuration, character).follow(configuration)
  }

  ruleFor(configuration: PDAConfiguration<T>, character: string): PDARule<T> {
    for(const rule of this.rules) {
      if (rule.appliesTo(configuration, character)) {
        return rule
      }
    }
  }
}

export class DPDA<T> {
  constructor(public currentConfiguration: PDAConfiguration<T>, public acceptStates: any[], public rulebook: DPDARulebook<T>) {
  }

  isAccepting(): boolean {
    for(const state of this.acceptStates) {
      if (state == this.currentConfiguration.state) {
        return true
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentConfiguration = this.rulebook.nextConfiguration(this.currentConfiguration, character)
  }

  readString(characters: string): void {
    for (const char of characters) {
      this.readCharacter(char)
    }
  }
}
