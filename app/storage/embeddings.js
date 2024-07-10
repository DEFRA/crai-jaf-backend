const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')

const { getVectorStore } = require('../lib/vector-store')
const { embeddings } = require('../config/embeddings')
const { getSimilarJafs } = require('../repos/jaf-knowledge')

const splitDocuments = async (doc, jafName) => {
  const loader = new PDFLoader()
  const texts = await loader.parse(doc, { jafName })

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 10000,
    chunkOverlap: 100,
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

const getJafRankings = async (doc, jafName) => {
  const splitTexts = await splitDocuments(doc, jafName)

  const matchMap = new Map()

  for (const text of splitTexts) {
    const jafEmbeddings = await embeddings.embedQuery(text.pageContent)

    const formattedEmbeddings = JSON.stringify(jafEmbeddings)

    const matched = await getSimilarJafs(jafName, formattedEmbeddings, 3)
    
    for (const match of matched) {
      const docName = match.jafName
      const ratings = matchMap.get(docName) ?? []

      ratings.push(match.similarity)
      
      matchMap.set(docName, ratings)
    }
  }

  const rankings = []

  for (const [docName, scores] of matchMap.entries()) {
    rankings.push({
      jafName: docName,
      scores,
      avg: scores.reduce((acc, curr) => acc + curr, 0) / scores.length,
      total: scores.length
    })
  }

  return rankings
}

const saveEmbeddings = async (doc, jafName) => {
  const splitTexts = await splitDocuments(doc, jafName)

  const vectorStore = await getVectorStore()
  await vectorStore.addDocuments(splitTexts)
}

module.exports = {
  saveEmbeddings,
  getJafRankings,
  getAllSimilarDocuments
}
