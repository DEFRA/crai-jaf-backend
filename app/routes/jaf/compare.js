const { compareJafs } = require('../../services/ai/compare-jafs')

module.exports = [
  {
    method: 'GET',
    path: '/jaf/compare/{id}',
    handler: async (request, h) => {
      const response = await compareJafs(request.params.id)

      return h.response({ response }).code(200)
    }
  }
]
