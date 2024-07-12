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
    throw new Error('Error processing query: ', err)
  }
}

const addJaf = async (jaf) => {
  const trx = await knex.transaction()

  try {
    const record = await trx('jaf')
      .returning('id')
      .insert({
        name: jaf.jafName,
        summary: jaf.summary
      })

    const { id } = record[0]

    for (const embedding of jaf.embeddings) {
      for (const chunk of embedding.embeddedChunks) {
        await trx('jaf_vectors').insert({
          jaf_id: id,
          content: chunk.text,
          vector: JSON.stringify(chunk.embedded),
          metadata: {
            section: embedding.prop
          }
        })
      }
    }

    await trx.commit()
  } catch (err) {
    await trx.rollback()

    err.type = 'JAF_EXISTS'

    throw err
  }
}

const getJafs = async (query) => {
  try {
    const jafs = knex('jaf')
      .select('id', 'name', 'summary')
    
    if (query.jafName) {
      jafs.where('name', `${query.jafName}`)
    }

    return jafs
  } catch (err) {
    throw new Error('Error getting JAFs: ', err)
  }
}

const getJafById = async (id) => {
  try {
    const jaf = knex('jaf')
      .select('id', 'name', 'summary')
      .where('id', id)
    
    if (!jaf) {
      const err = new Error(`JAF with id '${id}' not found`)

      err.type = 'NOT_FOUND'

      throw err
    }
    
    return jaf
  } catch (err) {
    throw new Error('Error getting JAF: ', err)
  }
}

module.exports = {
  getSimilarJafs,
  addJaf,
  getJafs,
  getJafById
}
