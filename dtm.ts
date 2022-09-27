export class Tape {
  constructor(private left: string, private middle: string, private right: string) {
  }

  inspect(): string {
    return `${this.left}(${this.middle})${this.right}`
  }

  write(character: string): Tape {
    return new Tape(this.left, character, this.right)
  }
}
