test('anonymous function type', () => {
  expect( ((x, y) => x + y)(3, 4) ).toBe(7)

  expect( ((x => y => x + y)(3))(4) ).toBe(7)

  expect( ((x: number, y: number): number => x + y)(3, 4) ).toBe(7)

  expect( ( ((x: number): any => (y: number): number => x + y)(3))(4) ).toBe(7)

  expect( ( ((x: number): ((y:number) => number) => (y: number): number => x + y)(3))(4) ).toBe(7)
})

test('anonymous function type', () => {
  const p = (n: number) => n * 2
  expect(p(5)).toBe(10)

  const q = (x: number) => p(x)
  expect(q(5)).toBe(10)

  expect(p(5) == q(5)).toBe(true)
})

import { zero, one, two, three, five, fifteen, hundred, toInteger } from './lambda';

test('NUMBER', () => {
  expect(toInteger( zero)).toBe(0)
  expect(toInteger(  one)).toBe(1)
  expect(toInteger(  two)).toBe(2)
  expect(toInteger(three)).toBe(3)

  expect(toInteger(five)).toBe(5)
  expect(toInteger(fifteen)).toBe(15)
  expect(toInteger(hundred)).toBe(100)
})

import { TRUE, FALSE, toBoolean} from './lambda';

test('BOOLEAN', () => {
  expect(toBoolean(TRUE)).toBe(true)
  expect(toBoolean(FALSE)).toBe(false)
})

import { IF } from './lambda';

test('IF', () => {
  expect(IF(TRUE)('happy')('sad')).toBe('happy')
  expect(IF(FALSE)('happy')('sad')).toBe('sad')
})
