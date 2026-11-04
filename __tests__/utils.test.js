import { test, expect } from 'vitest'
import { makeFileName, makeResourceFileName } from '../src/utils.js'

test.each([
  ['https://ru.hexlet.io/courses', 'ru-hexlet-io-courses.html'],
  ['https://ru.hexlet.io/courses/', 'ru-hexlet-io-courses.html'],
  ['https://example.com/page?id=1', 'example-com-page-id-1.html'],
  ['https://example.com:8080/a', 'example-com-8080-a.html'],
  ['https://www.example.com', 'www-example-com.html'],
])('makeFileName(%s)', (url, expected) => {
  expect(makeFileName(url)).toBe(expected)
})

test('makeResourceFileName keeps the extension', () => {
  expect(makeResourceFileName('https://ru.hexlet.io/assets/professions/nodejs.png')).toBe(
    'ru-hexlet-io-assets-professions-nodejs.png',
  )
})

test('makeResourceFileName limits the name length', () => {
  const longUrl = `https://example.com/${'a'.repeat(500)}.png`
  const name = makeResourceFileName(longUrl)

  expect(name.length).toBeLessThanOrEqual(255)
  expect(name.endsWith('.png')).toBe(true)
})
