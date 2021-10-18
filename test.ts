export function assert(ans: any, result: any) {
  console.log("\n# start #")
  if (ans == result) {
    console.log("answer: " + ans + " is ok")
  } else {
    console.log("answer: " + ans + ", result: " + result + " is bad")
    console.log("answer: " + ans)
    console.log("result: " + result)
  }
}

export function part(text: string) {
  console.log("\n### " + text + " ###")
}
