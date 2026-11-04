import path from 'path'

const createName = (urlString) =>
  urlString
    .replace(/^(https?:\/\/)?/, '')
    .replace(/[^A-Za-z0-9]/g, '-')
    .replace(/-+$/, '')

export const makeFileName = (urlString) => {
  return `${createName(urlString)}.html`
}

export const makeResourceFileName = (urlString) => {
  const extension = path.extname(urlString)
  const withoutExtension = urlString.slice(0, urlString.length - extension.length)
  return `${createName(withoutExtension).slice(-200)}${extension}`
}
