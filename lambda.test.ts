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

import { ZERO, ONE, TWO, THREE, FIVE, FIFTEEN, HUNDRED, toInteger } from './lambda';

test('NUMBER', () => {
  expect(toInteger( ZERO)).toBe(0)
  expect(toInteger(  ONE)).toBe(1)
  expect(toInteger(  TWO)).toBe(2)
  expect(toInteger(THREE)).toBe(3)

  expect(toInteger(FIVE)).toBe(5)
  expect(toInteger(FIFTEEN)).toBe(15)
  expect(toInteger(HUNDRED)).toBe(100)
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

import { IS_ZERO } from './lambda';

test('IS_ZERO', () => {
  expect(toBoolean(IS_ZERO(ZERO))).toBe(true)
  expect(toBoolean(IS_ZERO(THREE))).toBe(false)
})

import { PAIR, LEFT, RIGHT } from './lambda'

test('PAIR, LEFT, RIGHT', () => {
  const myPair = PAIR(THREE)(FIVE)
  expect(toInteger(LEFT(myPair))).toBe(3)
  expect(toInteger(RIGHT(myPair))).toBe(5)
})

import { SLIDE, DECREMENT } from './lambda'

test('SLIDE, DECREMENT', () => {
  expect(toInteger(DECREMENT(FIVE))).toBe(4)
  expect(toInteger(DECREMENT(FIFTEEN))).toBe(14)
  expect(toInteger(DECREMENT(HUNDRED))).toBe(99)
  expect(toInteger(DECREMENT(ZERO))).toBe(0)
})
