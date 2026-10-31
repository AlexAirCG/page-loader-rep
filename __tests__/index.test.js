import { test, expect } from 'vitest'
import { greet } from '../src/index.js'

test('greet uses the given name', () => {
  expect(greet('Alex')).toBe('Hello, Alex!')
})

test('greet defaults to world', () => {
  expect(greet()).toBe('Hello, world!')
})
