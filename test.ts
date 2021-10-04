export function assert(ans: any, result: any) {
  if (ans == result) {
    console.log("answer: " + ans + " is ok")
  } else {
    console.log("answer: " + ans + ", result: " + result + " is bad")
  }
}

export function part(text: string) {
  console.log("\n### " + text + " ###")
}
