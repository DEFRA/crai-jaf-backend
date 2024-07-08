const Joi = require('joi')

const { processPayloadFile } = require('../lib/process-payload-file')
const { getSimilarDocuments } = require('../storage/embeddings')

module.exports = [{
  method: 'POST',
  path: '/document',
  options: {
    payload: {
      parse: false,
      output: 'stream',
      allow: [
        'application/pdf'
      ],
      maxBytes: 5 * 1000 * 1000
    },
    validate: {
      headers: Joi.object({
        'x-jaf-name': Joi.string().required()
      }).unknown()
    }
  },
  handler: async (request, h) => {
    const document = await processPayloadFile(request.payload)

    const jafName = request.headers['x-jaf-name']

    const chunks = await getSimilarDocuments(document, jafName)

    return h.response({ chunks }).code(200)
  }
}]
