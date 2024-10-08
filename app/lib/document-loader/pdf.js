const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf')

const load = async (document) => {
  const loader = new PDFLoader()

  return loader.parse(document)
}

module.exports = load
