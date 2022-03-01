import { Stack } from './stack'

export class PDAConfiguration<T> {
  constructor(public state: any, public stack: Stack<T>) {
  }
}

export class PDARule {
  constructor(public state: any, public character: string, public nextState: any, public popCharacter: string, public pushCharacters: string[]) {
  }

  appliesTo(configuration: PDAConfiguration<string>, character: any): boolean {
    return this.state == configuration.state && this.popCharacter == configuration.stack.top() && this.character == character
  }
}
