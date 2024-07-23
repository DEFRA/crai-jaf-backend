const { getJafComparison } = require('../../repos/jaf-comparison')
const { compareJaf } = require('../../services/ai/compare-jafs')

module.exports = [
  {
    method: 'GET',
    path: '/jaf/compare/{id}',
    handler: async (request, h) => {
      const jafId = request.params.id
      const comparedJafs = await compareJaf(jafId)

      return h.response(comparedJafs).code(200)
    }
  },
  {
    method: 'GET',
    path: '/jaf/compare/{baseId}/{comparedId}',
    handler: async (request, h) => {
      const { baseId, comparedId } = request.params
      const comparedJafs = await getJafComparison(baseId, comparedId)

      return h.response(comparedJafs).code(200)
    }
  }
]
