const { compareJafs, compareJaf } = require('../../services/ai/compare-jafs')

module.exports = [
  {
    method: 'GET',
    path: '/jaf/compare/{id}',
    handler: async (request, h) => {
      const response = await compareJaf(request.params.id)

      return h.response({ response }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/jaf/compare/{baseId}/{compareId}',
    handler: async (request, h) => {
      const { baseId, compareId } = request.params
      const response = await compareJafs(baseId, compareId)

      return h.response({ response }).code(200)
    }
  }
]
