export class Tape {
  constructor(private left: string, public middle: string, private right: string, private blank: string) {
  }

  inspect(): string {
    return `${this.left}(${this.middle})${this.right}`
  }

  write(character: string): Tape {
    return new Tape(this.left, character, this.right, this.blank)
  }

  moveHeadLeft(): Tape {
    const newMiddle = (this.left.length == 0) ? this.blank : this.left[this.left.length - 1]
    return new Tape(this.left.substr(0, this.left.length - 1), newMiddle, this.middle + this.right, this.blank)
  }

  moveHeadRight(): Tape {
    const newMiddle = (this.right.length == 0) ? this.blank : this.right[0]
    return new Tape(this.left + this.middle, newMiddle, this.right.substr(1, this.right.length - 1), this.blank)
  }
}

export class TMConfiguration {
  constructor(public state: number, public tape: Tape) {
  }
}

export class TMRule {
  constructor(private state: number, private character: string, private nextState: number, private writeCharacter: string, private direction: 'right' | 'left') {
  }

  isAppliesTo(configuration: TMConfiguration): boolean {
    return ((this.state == configuration.state) && (this.character == configuration.tape.middle))
  }

  follow(configuration: TMConfiguration): TMConfiguration {
    return new TMConfiguration(this.nextState, this.nextTape(configuration))
  }

  nextTape(configuration: TMConfiguration): Tape {
    const writtenTape = configuration.tape.write(this.writeCharacter)

    if (this.direction == 'right') {
      return writtenTape.moveHeadRight()
    } else {
      return writtenTape.moveHeadLeft()
    }
  }
}

export class DTMRulebook {
  constructor(public rules: TMRule[]) {
  }

  nextConfiguration(configuration: TMConfiguration): TMConfiguration {
    return this.ruleFor(configuration).follow(configuration)
  }

  ruleFor(configuration: TMConfiguration): TMRule {
    for (const rule of this.rules) {
      if (rule.isAppliesTo(configuration)) {
        return rule
      }
    }
    return null
  }

  isAppliesTo(configuration: TMConfiguration): boolean {
    return !(this.ruleFor(configuration) == null)
  }
}

export class DTM {
  constructor(public currentConfiguration: TMConfiguration, private acceptStates: number[], private rulebook: DTMRulebook) {
  }

  isAccepting(): boolean {
    for (const state of this.acceptStates) {
      if (state == this.currentConfiguration.state) {
        return true
      }
    }
    return false
  }

  isStuck(): boolean {
    return !this.isAccepting() && !this.rulebook.isAppliesTo(this.currentConfiguration)
  }

  step(): void {
    this.currentConfiguration = this.rulebook.nextConfiguration(this.currentConfiguration)
  }

  run(): void {
    while(1) {
      if (this.isAccepting() || this.isStuck()) {
        break;
      } else {
        this.step()
      }
    }
  }
}
