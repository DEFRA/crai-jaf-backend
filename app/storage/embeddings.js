const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')

const { getVectorStore } = require('../lib/vector-store')
const { embeddings } = require('../config/embeddings')
const { getSimilarJafs } = require('../repos/jaf-knowledge')

const splitDocuments = async (doc, jafName) => {
  const loader = new PDFLoader()
  const texts = await loader.parse(doc, { jafName })

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50
  })

  return splitter.splitDocuments(texts)
}

const getJafRankings = async (doc, jafName) => {
  const splitTexts = await splitDocuments(doc, jafName)

  const matchMap = new Map()

  for (const text of splitTexts) {
    const jafEmbeddings = await embeddings.embedQuery(text.pageContent)

    const matched = await getSimilarJafs(jafName, jafEmbeddings, 3)

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

  return rankings.sort((a, b) => b.avg - a.avg)
}

const saveEmbeddings = async (doc, jafName) => {
  const splitTexts = await splitDocuments(doc, jafName)

  const vectorStore = await getVectorStore()
  await vectorStore.addDocuments(splitTexts)
}

module.exports = {
  saveEmbeddings,
  getJafRankings
}
