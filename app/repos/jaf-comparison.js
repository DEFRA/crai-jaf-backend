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
    const comparisons = await knex('jaf_comparison')
      .leftJoin('jaf', 'jaf_comparison.compared_jaf_id', 'jaf.id')
      .select('*')
      .where('base_jaf_id', baseJafId)
      .orderBy(knex.raw('comparison_response->\'similarity_score\''), 'desc')

    return comparisons
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
