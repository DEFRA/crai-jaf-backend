const { RunnableMap } = require('@langchain/core/runnables')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')

const { embeddings } = require('./clients/azure')
const { readJaf } = require('../../lib/document-loader')
const chains = require('./chains/extract-chains')

const splitText = (text) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 85,
    separators: ['\n\n', '\n', ' ', '']
  })

  return splitter.splitText(text)
}

const getSummary = async (text) => {
  const mapChain = RunnableMap.from({
    details: chains.detailsChain,
    jobSummary: chains.jobSummaryChain,
    mainActivities: chains.mainActivitiesChain,
    keyResponsibilities: chains.keyResponsibilitiesChain,
    deliverables: chains.deliverablesChain,
    knowledge: chains.knowledgeChain,
    skills: chains.skillsChain
  })

  const summary = await mapChain.invoke({
    jaf: text
  })

  const mapSummary = {
    details: summary.details.details,
    jobSummary: summary.jobSummary.job_summary,
    deliverables: summary.deliverables.deliverables,
    mainActivities: summary.mainActivities.main_activities,
    keyResponsibilities: summary.keyResponsibilities.key_responsibilities,
    knowledge: summary.knowledge.knowledge,
    skills: summary.skills.skills.join(', ')
  }

  return mapSummary
}

const extractJaf = async (jaf, contentType, options) => {
  const { embedProps, chunk } = options

  const text = await readJaf(jaf, contentType)

  const summary = await getSummary(text)

  const jafName = `${summary.details.grade} - ${summary.details.job_title}`

  const extracted = {
    jafName,
    summary,
    embeddings: []
  }

  for (const prop of embedProps) {
    let chunks
    if (typeof summary[prop] === 'string') {
      chunks = chunk ? await splitText(summary[prop]) : [summary[prop]]
    } else if (typeof summary[prop] === 'object') {
      chunks = summary[prop]
    }

    const embeddedChunks = []

    for (const text of chunks) {
      const embedded = await embeddings.embedQuery(text)
      embeddedChunks.push({ embedded, text })
    }

    extracted.embeddings.push({
      prop,
      embeddedChunks
    })
  }

  return extracted
}

module.exports = {
  extractJaf
}
