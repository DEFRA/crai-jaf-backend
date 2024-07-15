const { processPayloadFile } = require('../../lib/process-payload-file')
const { findSimilarJaf } = require('../../services/jaf')

module.exports = [
  {
    method: 'POST',
    path: '/jaf/compare',
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

      const jafs = await findSimilarJaf(jaf, contentType)

      console.log(jafs)

      return h.response(jafs).code(200)
    }
  }
]
