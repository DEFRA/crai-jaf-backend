const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { JsonOutputParser } = require('@langchain/core/output_parsers')

const { chat } = require('../clients/azure')
const prompts = require('../../../constants/prompts/comparison')

const buildChain = (prompt) => {
  const chain = ChatPromptTemplate.fromTemplate(prompt)
    .pipe(chat)
    .pipe(new JsonOutputParser())

  return chain
}

const competencyChain = buildChain(prompts.competencyPrompt)
const taskChain = buildChain(prompts.taskPrompt)
const linkageChain = buildChain(prompts.linkagePrompt)

module.exports = {
  competencyChain,
  linkageChain,
  taskChain
}
