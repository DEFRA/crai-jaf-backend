const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { JsonOutputParser } = require('@langchain/core/output_parsers')

const { chat } = require('../clients/azure')
const prompts = require('../../../constants/prompts/extraction')

const buildChain = (prompt) => {
  const chain = ChatPromptTemplate.fromTemplate(prompt)
    .pipe(chat)
    .pipe(new JsonOutputParser())

  return chain
}

const detailsChain = buildChain(prompts.detailsPrompt)
const jobSummaryChain = buildChain(prompts.jobSummaryPrompt)
const knowledgeChain = buildChain(prompts.knowledgePrompt)
const mainActivitiesChain = buildChain(prompts.mainActivitiesPrompt)
const skillsChain = buildChain(prompts.skillsPrompt)

module.exports = {
  detailsChain,
  jobSummaryChain,
  knowledgeChain,
  mainActivitiesChain,
  skillsChain
}
