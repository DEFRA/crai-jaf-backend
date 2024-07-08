const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')

const { getVectorStore } = require('../lib/vector-store')
const { embeddings } = require('../config/embeddings')
const { connection: knex } = require('../config/db')

const splitDocuments = async (doc, jafName) => {
  const loader = new PDFLoader()
  const texts = await loader.parse(doc, { jafName })

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 120,
    separators: ['\n\n', '\n', ' ', '']
  })

  return splitter.splitDocuments(texts)
}

const getAllSimilarDocuments = async (doc, jafName) => {
  const splitTexts = await splitDocuments(doc, jafName)
  const vectorStore = await getVectorStore()

  const chunks = []

  for (const text of splitTexts) {
    try {
      const embedDoc = await embeddings.embedQuery(text.pageContent)
      const docs = await vectorStore.similaritySearchVectorWithScore(embedDoc, 2)

      for (const [doc] of docs) {
        console.log(doc.metadata.jafName)
      }

      chunks.push({
        text,
        docs
      })
    } catch (err) {
      console.error(err)
      throw new Error('Error processing query: ', err)
    }
  }

  return chunks
}

const getSimilarDocuments = async (doc, jafName) => {
  const splitTexts = await splitDocuments(doc, jafName)

  const chunks = []

  for (const text of splitTexts) {
    try {
      const embedDoc = await embeddings.embedQuery(text.pageContent)

      const formattedEmbedDoc = JSON.stringify(embedDoc)

      const docs = await knex('jaf_knowledge_vectors')
        .select('id', 'content', 'metadata')
        .whereRaw(knex.raw('metadata->>\'jafName\' != ?', [jafName]))
        .orderBy(knex.raw('?? <=> ?', ['vector', formattedEmbedDoc]))
        .limit(5)

      chunks.push({
        text,
        docs
      })
    } catch (err) {
      console.error(err)
      throw new Error('Error processing query: ', err)
    }
  }

  return chunks
}

const saveEmbeddings = async (doc, jafName) => {
  const splitTexts = await splitDocuments(doc, jafName)

  const vectorStore = await getVectorStore()
  await vectorStore.addDocuments(splitTexts)
}

module.exports = {
  saveEmbeddings,
  getSimilarDocuments,
  getAllSimilarDocuments
}
