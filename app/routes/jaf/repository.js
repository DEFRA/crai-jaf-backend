const Joi = require('joi')
const { processPayloadFile } = require('../../lib/process-payload-file')
const { getJafs } = require('../../repos/jaf')
const { storeJaf, findJaf } = require('../../services/jaf')
const professions = require('../../constants/professions')

module.exports = [
  {
    method: 'GET',
    path: '/jaf/repository',
    options: {
      validate: {
        query: Joi.object({
          profession: Joi.string().optional().valid(...Object.values(professions))
        }),
        failAction: (request, h, err) => {
          console.log(request.query.profession)
          console.log('Error getting JAFs: ', err)
          return h.response().code(500)
        }
      }
    },
    handler: async (request, h) => {
      const jafs = await getJafs(request.query)

      if (!jafs.length) {
        return h.response().code(204)
      }

      return h.response(jafs).code(200)
    }
  },
  {
    method: 'GET',
    path: '/jaf/repository/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params

        const jaf = await findJaf(id)

        return h.response(jaf).code(200)
      } catch (err) {
        if (err.type === 'NOT_FOUND') {
          return h.response().code(404)
        }

        throw err
      }
    }
  },
  {
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
      },
      validate: {
        headers: Joi.object({
          'x-profession': Joi.string().required().valid(...Object.values(professions))
        }).unknown(),
      }
    },
    handler: async (request, h) => {
      const jaf = await processPayloadFile(request.payload)

      const contentType = request.headers['content-type']
      const profession = request.headers['x-profession']

      try {
        const { summary } = await storeJaf(jaf, profession, contentType)

        return h.response({ summary }).code(201)
      } catch (err) {
        if (err.type === 'JAF_EXISTS') {
          return h.response({ error: err.message }).code(409)
        }

        throw err
      }
    }
  }
]
