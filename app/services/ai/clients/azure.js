const { openAi } = require('../../../config/ai').azure
const { DefaultAzureCredential } = require('@azure/identity')
const { AzureChatOpenAI, AzureOpenAIEmbeddings } = require('@langchain/openai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get Azure model: ${error}`)
  }
}

const getConfig = (model) => {
  const config = {
    azureOpenAIApiDeploymentName: model,
    azureOpenAIApiVersion: openAi.apiVersion,
    azureOpenAIApiInstanceName: openAi.instanceName,
    onFailedAttempt,
    verbose: true
  }

  if (openAi.apiKey) {
    console.log('Using Azure OpenAI API key')

    return {
      ...config,
      azureOpenAIApiKey: openAi.apiKey
    }
  }

  console.log('Using managed identity')

  return {
    ...config,
    credentials: new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID })
  }
}

const chat = new AzureChatOpenAI(getConfig(openAi.generationModelName))
const embeddings = new AzureOpenAIEmbeddings(getConfig(openAi.embeddingsModelName))

module.exports = {
  chat,
  embeddings
}
