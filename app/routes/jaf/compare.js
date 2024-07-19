const { getJafComparison, getJafComparisons } = require('../../repos/jaf-comparison')
const { compareJaf } = require('../../services/ai/compare-jafs')

module.exports = [
  {
    method: 'GET',
    path: '/jaf/compare/{id}',
    handler: async (request, h) => {
      const jafId = request.params.id
      await compareJaf(jafId)

      const response = await getJafComparisons(jafId)
      return h.response({ response }).code(200)
    }
  },
  {
    method: 'GET',
    path: '/jaf/compare/{baseId}/{comparedId}',
    handler: async (request, h) => {
      const { baseId, comparedId } = request.params
      const response = await getJafComparison(baseId, comparedId)

      return h.response({ response }).code(200)
    }
  }
]
