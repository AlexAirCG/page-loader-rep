import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { makeFileName, makeResourceFileName } from './utils.js'

const loadPage = (urlString, outputDir = process.cwd()) => {
  const fileName = makeFileName(urlString)
  const fullPath = path.join(outputDir, fileName)
  const resourcesDirName = fileName.replace(/\.html$/, '_files')
  const resourcesDirPath = path.join(outputDir, resourcesDirName)
  const images = []
  let $

  return axios(urlString)
    .then((response) => {
      $ = cheerio.load(response.data)
      $('img').each((_, element) => {
        const src = $(element).attr('src')
        const imageUrl = new URL(src, urlString).toString()
        const resourceFileName = makeResourceFileName(imageUrl)
        $(element).attr('src', `${resourcesDirName}/${resourceFileName}`)
        images.push({ imageUrl, resourceFileName })
      })
    })
    .then(() => fs.mkdir(resourcesDirPath, { recursive: true }))
    .then(() => {
      return Promise.all(
        images.map(({ imageUrl, resourceFileName }) => {
          return axios
            .get(imageUrl, { responseType: 'arraybuffer' })
            .then((response) =>
              fs.writeFile(path.join(resourcesDirPath, resourceFileName), response.data),
            )
        }),
      )
    })
    .then(() => fs.writeFile(fullPath, $.html()))
    .then(() => fullPath)
}

export default loadPage

// 1. проверить адрес и папку назначения
// 2. скачать страницу
// 3. найти свои ресурсы и заменить ссылки (список resources)
// 4. создать папку для ресурсов
// 5. скачать все ресурсы и записать в папку
// 6. записать страницу и вернуть путь к ней
