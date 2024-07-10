const { connection: knex } = require('../config/db')

const getSimilarJafs = async (jafName, embeddings, maxJafs) => {
  const formatted = JSON.stringify(embeddings)

  try {
    const jafs = await knex('jaf_knowledge_vectors')
      .select({
        jafName: knex.raw('metadata->>\'jafName\''),
        similarity: knex.raw('1 - (vector <=> ?)', [formatted])
      })
      .whereRaw(knex.raw('metadata->>\'jafName\' != ?', [jafName]))
      .orderBy(knex.raw('1 - (vector <=> ?)', [formatted]), 'desc')
      .limit(maxJafs)

    return jafs
  } catch (err) {
    console.error(err)
    throw new Error('Error processing query: ', err)
  }
}

module.exports = {
  getSimilarJafs
}
