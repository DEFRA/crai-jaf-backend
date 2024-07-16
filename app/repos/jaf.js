const { connection: knex } = require('../config/db')

const getSimilarJafs = async (jaf, jafName) => {
  try {
    const propEmbedding = jaf.embeddings.find(embedding => embedding.prop === 'summary')

    const { embedded } = propEmbedding.embeddedChunks[0]

    const formatted = JSON.stringify(embedded)

    const jafs = await knex('jaf_vectors')
      .innerJoin('jaf', 'jaf.id', 'jaf_vectors.jaf_id')
      .select({
        jafName: 'jaf.name',
        cosine: knex.raw('AVG(1 - ("jaf_vectors"."vector" <=> ?))', [formatted])
      })
      .whereNot('jaf.name', jafName)
      .groupBy('jafName')
      .orderBy('cosine', 'desc')

    return jafs
  } catch (err) {
    throw new Error('Error getting similar JAFs: ', err)
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

const getJafs = async () => {
  try {
    const jafs = knex('jaf')
      .select('id', 'name', 'summary')

    return jafs
  } catch (err) {
    throw new Error('Error getting JAFs: ', err)
  }
}

const getJafById = async (id) => {
  let jaf

  try {
    jaf = await knex('jaf')
      .select('id', 'name', 'summary')
      .where('id', id)
  } catch (err) {
    throw new Error('Error getting JAF: ', err)
  }

  if (jaf.length === 0) {
    const err = new Error(`Error getting JAF: '${id}' not found`)

    err.type = 'NOT_FOUND'

    throw err
  }

  return jaf[0]
}

module.exports = {
  getSimilarJafs,
  addJaf,
  getJafs,
  getJafById
}
