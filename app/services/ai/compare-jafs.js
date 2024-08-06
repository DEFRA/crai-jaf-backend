const { RunnableSequence } = require('@langchain/core/runnables')

const { getJafById, getJafsByGrade } = require('../../repos/jaf')
const { addJafComparison, getJafComparisons } = require('../../repos/jaf-comparison')
const chains = require('./chains/compare-chains')
const { langfuseHandler } = require('../../config/langfuse')

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
      callbacks: [langfuseHandler]
    })

  return comparison
}

const generateJafComparison = async (jafId) => {
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
  generateJafComparison
}
