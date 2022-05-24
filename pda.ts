import { Stack } from './stack'

const STUCK_STATE = {}
export class PDAConfiguration<T> {
  constructor(public state: any, public stack: Stack<T>) {
  }

  stuck(): PDAConfiguration<T> {
    return new PDAConfiguration(STUCK_STATE, this.stack)
  }

  isStuck(): boolean {
    return this.state == STUCK_STATE
  }

  isSame(conf: PDAConfiguration<T>): boolean {
    if (this.state != conf.state) {
      return false
    }
    if (!this.stack.isSame(conf.stack)) {
      return false
    }
    return true
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
