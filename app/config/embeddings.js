const { OpenAIEmbeddings } = require('@langchain/openai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get embeddings: ${error}`)
  }
}

const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_KEY,
  azureOpenAIApiDeploymentName: process.env.EMBEDDING_MODEL_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  onFailedAttempt
})

module.exports = {
  embeddings
}
