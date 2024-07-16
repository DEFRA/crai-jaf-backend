const { compareJafs, compareJafById } = require('../../services/ai/compare-jafs')

module.exports = [
  {
    method: 'GET',
    path: '/jaf/compare/{id}',
    handler: async (request, h) => {
      console.log('first:', request.params.id)
      const response = await compareJafById(request.params.id)

      return h.response({ response }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/jaf/compare/{id1}/{id2}',
    handler: async (request, h) => {
      console.log('second:', request.params.id1, request.params.id2)
      const response = await compareJafs(request.params.id1, request.params.id2)

      return h.response({ response }).code(200)
    }
  }
]
