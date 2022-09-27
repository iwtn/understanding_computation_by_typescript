export class Tape {
  constructor(private left: string, private middle: string, private right: string, private blank: string) {
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
    return new Tape(this.left + this.middle, newMiddle, this.right.substr(1, this.left.length - 1), this.blank)
  }
}
