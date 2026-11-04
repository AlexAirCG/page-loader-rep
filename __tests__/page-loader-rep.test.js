import { test, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import nock from 'nock'
import * as cheerio from 'cheerio'
import loadPage from '../src/index.js'

const getFixturePath = (filename) => path.join(import.meta.dirname, '__fixtures__', filename)

const baseUrl = 'https://ru.hexlet.io'
const pageUrl = '/courses'
const fullUrl = `${baseUrl}${pageUrl}`

let tmpDir

beforeEach(async () => {
  nock.disableNetConnect()
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'))
})

afterEach(async () => {
  nock.cleanAll()
  nock.enableNetConnect()
  await fs.rm(tmpDir, { recursive: true, force: true })
})

test('loadPage', async () => {
  const expectedContent = '<html><body>Hello Hexlet!</body></html>'

  nock(baseUrl).get(pageUrl).reply(200, expectedContent)

  const resultFilePath = await loadPage(fullUrl, tmpDir)

  const expectedFileName = 'ru-hexlet-io-courses.html'
  const expectedFilePath = path.join(tmpDir, expectedFileName)

  expect(resultFilePath).toBe(expectedFilePath)

  const savedContent = await fs.readFile(resultFilePath, 'utf-8')
  expect(cheerio.load(savedContent).html()).toBe(cheerio.load(expectedContent).html())
})

test('reject on 404', async () => {
  nock(baseUrl).get(pageUrl).reply(404)
  await expect(loadPage(fullUrl, tmpDir)).rejects.toThrow()
})

test('downloads images and replaces links in html', async () => {
  const beforeHtml = await fs.readFile(getFixturePath('before.html'), 'utf-8')
  const afterHtml = await fs.readFile(getFixturePath('after.html'), 'utf-8')
  const imageBuffer = await fs.readFile(getFixturePath('nodejs.png'))

  nock(baseUrl).get(pageUrl).reply(200, beforeHtml)
  nock(baseUrl).get('/assets/professions/nodejs.png').reply(200, imageBuffer)

  const resultFilePath = await loadPage(fullUrl, tmpDir)

  const savedHtml = await fs.readFile(resultFilePath, 'utf-8')
  expect(cheerio.load(savedHtml).html()).toBe(cheerio.load(afterHtml).html())

  const imagePath = path.join(
    tmpDir,
    'ru-hexlet-io-courses_files',
    'ru-hexlet-io-assets-professions-nodejs.png',
  )

  const savedImage = await fs.readFile(imagePath)
  expect(savedImage).toEqual(imageBuffer)
})
