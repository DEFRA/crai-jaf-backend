const { connection: knex } = require('../config/db')

const getSimilarJafs = async (jafId) => {
  try {
    const jafs = await knex('jaf').select({
      jafName: 'jaf.name',
      summaryCosine: knex.raw(`
        CAST(AVG(CASE 
          WHEN jv1.metadata->>'section' = 'summary' AND jv2.metadata->>'section' = 'summary' 
          THEN 1 - (jv1.vector <=> jv2.vector) 
        END) AS NUMERIC(10,5))`),
      deliverablesCosine: knex.raw(`
        CAST(AVG(CASE 
          WHEN jv1.metadata->>'section' = 'deliverables' AND jv2.metadata->>'section' = 'deliverables' 
          THEN 1 - (jv1.vector <=> jv2.vector) 
        END) AS NUMERIC(10,5))`),
      responsibilitiesCosine: knex.raw(`
        CAST(AVG(CASE 
          WHEN jv1.metadata->>'section' = 'key_responsibilities' AND jv2.metadata->>'section' = 'key_responsibilities' 
          THEN 1 - (jv1.vector <=> jv2.vector) 
        END) AS NUMERIC(10,5))`),
      overallCosine: knex.raw('CAST(AVG(1 - (jv1.vector <=> jv2.vector)) AS NUMERIC(10,5))')
    })
      .innerJoin('jaf_vectors as jv1', 'jaf.id', 'jv1.jaf_id')
      .innerJoin('jaf_vectors as jv2', function () {
        this.on('jv1.jaf_id', '!=', 'jv2.jaf_id')
          .andOn(knex.raw('jv1.metadata->>\'section\' = jv2.metadata->>\'section\''))
      })
      .where('jv2.jaf_id', jafId)
      .whereNot('jaf.id', jafId)
      .groupBy('jaf.id', 'jaf.name')
      .orderBy('overallCosine', 'desc')
      .limit(5)

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

const getJafsByGrade = async (grade) => {
  try {
    const jafs = knex('jaf')
      .select('id', 'name', 'summary')
      .whereRaw(knex.raw('summary->\'details\'->>\'grade\' = ?', [grade]))

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
  getJafsByGrade,
  getJafById
}
