const { DocxLoader } = require('langchain/document_loaders/fs/docx')

const load = async (document) => {
  const loader = new DocxLoader()

  return loader.parse(document)
}

module.exports = load
