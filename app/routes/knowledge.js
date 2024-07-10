const Joi = require('joi')
const { processPayloadFile } = require('../lib/process-payload-file')
const { storeJaf } = require('../services/jaf')

module.exports = [{
  method: 'POST',
  path: '/knowledge',
  options: {
    payload: {
      parse: false,
      output: 'stream',
      allow: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
    const jaf = await processPayloadFile(request.payload)

    const jafName = request.headers['x-jaf-name']
    const contentType = request.headers['content-type']

    try {
      const { summary } = await storeJaf(jaf, jafName, contentType)

      return h.response({ summary }).code(201)
    } catch (err) {
      console.error(err)
      throw new Error('Error saving embeddings:', err)
    }
  }
}]
