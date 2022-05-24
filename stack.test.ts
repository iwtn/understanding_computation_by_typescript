import { Stack } from './stack';

test('Stack', () => {
  const stack = new Stack<string>(['a', 'b', 'c', 'd', 'e'])
  expect(stack.top()).toBe('a');
  expect(stack.pop().pop().top()).toBe('c');
  expect(stack.push('x').push('y').top()).toBe('y');
  expect(stack.push('x').push('y').pop().top()).toBe('x');
})

test('Stack isSame', () => {
  const stack1 = new Stack<string>(['a', 'b', 'c', 'd', 'e'])
  const stack2 = new Stack<string>(['a', 'b', 'c', 'd'])
  const stack3 = new Stack<string>(['a', 'b', 'e', 'd', 'c'])
  const stack4 = new Stack<string>(['a', 'b', 'c', 'd', 'e'])

  expect(stack1.isSame(stack2)).toBe(false);
  expect(stack1.isSame(stack3)).toBe(false);
  expect(stack1.isSame(stack4)).toBe(true);
})
