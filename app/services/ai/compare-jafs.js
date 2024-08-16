const { RunnableSequence } = require('@langchain/core/runnables')

const chains = require('./chains/compare-chains')
const { getJafById, getJafsByGrade } = require('../../repos/jaf')
const { addJafComparison, getJafComparisons } = require('../../repos/jaf-comparison')
const { langfuse } = require('../../config/langfuse')

const buildJafObject = (jaf) => {
  return {
    jobSummary: jaf.summary.job_summary,
    mainActivities: jaf.summary.main_activities,
    knowledge: jaf.summary.knowledge,
    skills: jaf.summary.skills
  }
}

const compareJafs = async (baseJaf, comparedJaf) => {
  const mapChain = RunnableSequence.from([
    {
      tasks: chains.taskChain,
      competencies: chains.competencyChain,
      summary: chains.overallChain
    },
    {
      linkage: async (input) => chains.linkageChain.invoke({
        tasks: JSON.stringify(input.tasks),
        competencies: JSON.stringify(input.competencies)
      }),
      tasks: (input) => input.tasks,
      competencies: (input) => input.competencies,
      summary: (input) => input.summary
    }
  ])

  const comparison = await mapChain.invoke(
    {
      baseJaf: JSON.stringify(buildJafObject(baseJaf)),
      comparedJaf: JSON.stringify(buildJafObject(comparedJaf))
    },
    {
      callbacks: [].concat(langfuse)
    })

  return comparison
}

const generateJafComparison = async (jafId) => {
  const jaf = await getJafById(jafId)

  const { missing, comparisons } = await getJafComparisons(jafId)

  if (missing.length === 0) {
    return comparisons
  }

  const jafs = await getJafsByGrade(jaf.summary.details.grade)

  const jafsToCompare = jafs.filter(j => missing.includes(j.id))

  for (const comparedJaf of jafsToCompare) {
    const comparison = await compareJafs(jaf, comparedJaf)

    await addJafComparison(jafId, comparedJaf.id, comparison)
  }

  const { comparisons: generated } = await getJafComparisons(jafId)

  return generated
}

module.exports = {
  generateJafComparison
}
