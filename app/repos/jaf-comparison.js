const { connection: knex } = require('../config/db')

const addJafComparison = async (baseJafId, comparedJafId, comparison) => {
  const trx = await knex.transaction()

  try {
    await trx('jaf_comparison')
      .insert({
        base_jaf_id: baseJafId,
        compared_jaf_id: comparedJafId,
        comparison_response: comparison
      })
  } catch (err) {
    await trx.rollback()

    console.log('Error caching jaf comparison: ', err)
    throw err
  }
  await trx.commit()
}

const getJafComparison = async (baseJafId, comparedJafId) => {
  try {
    const comparison = await knex('jaf_comparison')
      .leftJoin('jaf', 'jaf_comparison.compared_jaf_id', 'jaf.id')
      .select('*')
      .where('base_jaf_id', baseJafId)
      .andWhere('compared_jaf_id', comparedJafId)

    return comparison[0]
  } catch (err) {
    console.log('Error fetching jaf comparison: ', err)
    throw err
  }
}

const getJafComparisons = async (baseJafId) => {
  try {
    const missing = await knex('jaf')
      .select({
        id: 'id',
        grade: knex.raw('summary->\'details\'->>\'grade\'')
      })
      .whereNotIn('id', knex('jaf_comparison').select('compared_jaf_id').where('base_jaf_id', baseJafId))
      .whereRaw(knex.raw('summary->\'details\'->>\'grade\' = (SELECT summary->\'details\'->>\'grade\' FROM jaf WHERE id = ?)', [baseJafId]))
      .pluck('id')
    
    console.log(missing)

    const comparisons = await knex('jaf_comparison')
      .leftJoin('jaf', 'jaf_comparison.compared_jaf_id', 'jaf.id')
      .select('*')
      .where('base_jaf_id', baseJafId)
      .orderBy(knex.raw('comparison_response->\'similarity_score\''), 'desc')

    return { missing, comparisons }
  } catch (err) {
    console.log('Error fetching jaf comparisons: ', err)
    throw err
  }
}

module.exports = {
  addJafComparison,
  getJafComparison,
  getJafComparisons
}
