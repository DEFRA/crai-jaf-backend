const Joi = require('joi')
const { processPayloadFile } = require('../lib/process-payload-file')
const { saveEmbeddings } = require('../storage/embeddings')

module.exports = [{
  method: 'POST',
  path: '/knowledge',
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

    try {
      await saveEmbeddings(document, jafName)

      return h.response('Uploaded successfully').code(201)
    } catch (err) {
      console.error(err)
      throw new Error('Error saving embeddings:', err)
    }
  }
}]
