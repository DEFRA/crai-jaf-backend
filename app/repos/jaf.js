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

    console.error('Error adding JAF: ', err)

    throw err
  }
}

const getJaf = async (jafName) => {
  try {
    const jaf = await knex('jaf')
      .select('*')
      .leftJoin('jaf_vectors', 'jaf.id', 'jaf_vectors.jaf_id')
      .where('name', jafName)

    return jaf[0]
  } catch (err) {
    console.error(err)
    throw new Error('Error getting JAF: ', err)
  }
}

module.exports = {
  getSimilarJafs,
  addJaf,
  getJaf
}
