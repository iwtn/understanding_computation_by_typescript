const ary = [
  (true && false) || true,
  (3 + 3) * (14 / 2),
  'hello' + ' world',
  'hello world'.slice(6, 7),
]

ary.forEach(function(v) {
  console.log(v)
})

const numbers = ['zero', 'one', 'two']
const ary2 = [
  numbers,
  numbers[1],
]
ary2.forEach(function(v) {
  console.log(v)
})

numbers.push('three', 'four')
console.log(numbers)

numbers.splice(0, 2)
console.log(numbers)

const range = (from: number, to: number) => { return [...Array(to - from + 1)].map((v, k) => k + from) }
console.log(range(10, 20))
