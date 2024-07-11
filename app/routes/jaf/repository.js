const { processPayloadFile } = require('../../lib/process-payload-file')
const { storeJaf } = require('../../services/jaf')

module.exports = [{
  method: 'POST',
  path: '/jaf/repository',
  options: {
    payload: {
      parse: false,
      output: 'stream',
      allow: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      maxBytes: 5 * 1000 * 1000
    }
  },
  handler: async (request, h) => {
    const jaf = await processPayloadFile(request.payload)

    const contentType = request.headers['content-type']

    try {
      const { summary } = await storeJaf(jaf, contentType)

      return h.response({ summary }).code(201)
    } catch (err) {
      console.error(err)

      if (err.type === 'JAF_EXISTS') {
        return h.response({ error: err.message }).code(409)
      }

      throw new Error('Error saving embeddings:', err)
    }
  }
}]
