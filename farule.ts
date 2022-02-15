import * as Immutable from 'immutable';

export class FARule {
  constructor(private state: any, private character: string, private nextState: any) {
  }

  appliesTo(state: any, character: string): boolean {
    if (typeof(state) == 'object' && typeof(this.state) == 'object') {
      return (this.state.equals(state) && this.character == character)
    } else {
      return (this.state == state && this.character == character)
    }
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

