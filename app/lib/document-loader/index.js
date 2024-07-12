const { DOC, PDF, DOCX, TXT } = require('../../constants/document-types')
const loadDocx = require('./docx')
const loadPdf = require('./pdf')
const loadText = require('./txt')

const loaders = {
  [DOCX]: loadDocx,
  [DOC]: loadDocx,
  [PDF]: loadPdf,
  [TXT]: loadText
}

const readJaf = async (jaf, contentType) => {
  const loader = loaders[contentType]

  if (!loader) {
    throw new Error(`Unsupported document type: ${contentType}`)
  }

  let docs

  try {
    docs = await loader(jaf)
  } catch (err) {
    console.error(`Error loading jaf: ${err}`)

    throw err
  }

  const content = docs.reduce((acc, doc) => {
    return acc + doc.pageContent
  }, '')

  return content
}

module.exports = {
  readJaf
}
