import { Stack } from './stack'
import { PDARule, PDAConfiguration } from './pda'

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
  constructor(private currentConfig: PDAConfiguration<T>, public acceptStates: any[], public rulebook: DPDARulebook<T>) {
  }

  nextConfiguration(character: string): PDAConfiguration<T> | null {
    if (this.rulebook.isAppliesTo(this.currentConfiguration(), character)) {
      return this.rulebook.nextConfiguration(this.currentConfiguration(), character)
    } else {
      return this.currentConfiguration().stuck()
    }
  }

  isStuck(): boolean {
    return this.currentConfiguration().isStuck()
  }

  currentConfiguration(): PDAConfiguration<T> {
    return this.rulebook.followFreeMoves(this.currentConfig)
  }

  isAccepting(): boolean {
    for(const state of this.acceptStates) {
      if (state == this.currentConfiguration().state) {
        return true
      }
    }
    return false
  }

  readCharacter(character: string): void {
    this.currentConfig = this.nextConfiguration(character)
  }

  readString(characters: string): void {
    for (const char of characters) {
      if (!this.isStuck()) {
        this.readCharacter(char)
      }
    }
  }
}

export class DPDADesign<T> {
  constructor(public startState: any, public bottomCharacter: T, public acceptStates: any[], public rulebook: DPDARulebook<T>) {
  }

  isAccepts?(characters: string): boolean {
    const dpda = this.toDpda()
    dpda.readString(characters)
    return dpda.isAccepting()
  }

  toDpda(): DPDA<T> {
    const startStack = new Stack<T>([this.bottomCharacter])
    const startConfiguration = new PDAConfiguration<T>(this.startState, startStack)
    return new DPDA<T>(startConfiguration, this.acceptStates, this.rulebook)
  }
}
