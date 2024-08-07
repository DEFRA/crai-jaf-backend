const professions = require('../../constants/professions')

module.exports = [
  {
    method: 'GET',
    path: '/jaf/profession',
    handler: async (request, h) => {
      const types = Object.values(professions)

      return h.response({ professions: types }).code(200)
    }
  }
]
