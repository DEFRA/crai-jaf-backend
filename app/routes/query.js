const { embeddings } = require('../services/ai/clients/azure')

module.exports = [{
  method: 'POST',
  path: '/query',
  handler: async (request, h) => {
    // const embedQuery = await embeddings.embedQuery(request.payload)

    // const vectorStore = await getVectorStore()

    // try {
    //   const docs = await vectorStore.similaritySearchVectorWithScore(embedQuery, 2)

    //   return h.response({ docs }).code(200)
    // } catch (err) {
    //   console.error(err)
    //   throw new Error('Error processing query: ', err)
    // }
  }
}]
