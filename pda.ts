import { Stack } from './stack'

export class PDAConfiguration<T> {
  constructor(public state: any, public stack: Stack<T>) {
  }
}

export class PDARule<T> {
  constructor(public state: any, public character: string, public nextState: any, public popCharacter: T, public pushCharacters: T[]) {
  }

  appliesTo(configuration: PDAConfiguration<T> | null, character: string): boolean {
    if (configuration == null) {
      return false
    }
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

  nextConfiguration(configuration: PDAConfiguration<T> | null, character: string | null): PDAConfiguration<T> | null {
    const rule = this.ruleFor(configuration, character)
    if (rule == null) {
      return null
    } else {
      return rule.follow(configuration)
    }
  }

  ruleFor(configuration: PDAConfiguration<T> | null, character: string): (PDARule<T> | null) {
    for(const rule of this.rules) {
      if (rule.appliesTo(configuration, character)) {
        return rule
      }
    }
    return null
  }

  isAppliesTo(configuration: PDAConfiguration<T>, character: string): boolean {
    return !(this.ruleFor(configuration, character) == null)
  }

  followFreeMoves(configuration: PDAConfiguration<T> | null): PDAConfiguration<T> {
    if (this.isAppliesTo(configuration, null)) {
      return this.followFreeMoves(this.nextConfiguration(configuration, null))
    } else {
      return configuration
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
