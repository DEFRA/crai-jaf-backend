const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { JsonOutputParser } = require('@langchain/core/output_parsers')

const { getJafById, getJafsByGrade } = require('../../repos/jaf')
const { chat } = require('./clients/azure')
const { addJafComparison, getJafComparisons } = require('../../repos/jaf-comparison')
const { comparisonPrompt } = require('../../constants/prompts/comparison')

const buildJafObject = (jaf) => {
  return {
    jobSummary: jaf.summary.job_summary,
    skills: jaf.summary.skills,
    keyResponsibilities: jaf.summary.key_responsibilities,
    mainActivities: jaf.summary.main_activities
  }
}

const compareJafs = async (baseJaf, comparedJaf) => {
  const chain = ChatPromptTemplate.fromTemplate(comparisonPrompt)
    .pipe(chat)
    .pipe(new JsonOutputParser())

  const comparison = await chain.invoke({
    baseJaf: JSON.stringify(buildJafObject(baseJaf)),
    comparedJaf: JSON.stringify(buildJafObject(comparedJaf))
  })

  return comparison
}

const compareJaf = async (jafId) => {
  const jaf = await getJafById(jafId)

  const jafComparisons = await getJafComparisons(jafId)

  if (jafComparisons.length !== 0) {
    return jafComparisons
  }

  const jafs = await getJafsByGrade(jaf.summary.details.grade)

  for (const comparedJaf of jafs) {
    const comparison = await compareJafs(jaf, comparedJaf)

    await addJafComparison(jafId, comparedJaf.id, comparison)
  }

  return getJafComparisons(jafId)
}

module.exports = {
  compareJaf
}
