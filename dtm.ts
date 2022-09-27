export class Tape {
  constructor(private left: string, private middle: string, private right: string) {
  }

  inspect(): string {
    return `${this.left}(${this.middle})${this.right}`
  }
}
