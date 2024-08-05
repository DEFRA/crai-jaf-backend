const aiConfig = require('../../../config/ai')
const { DefaultAzureCredential, getBearerTokenProvider } = require('@azure/identity')
const { AzureChatOpenAI, AzureOpenAIEmbeddings } = require('@langchain/openai')

const onFailedAttempt = async (error) => {
  if (error.retriesLeft === 0) {
    throw new Error(`Failed to get Azure model: ${error}`)
  }
}

const tokenProvider = getBearerTokenProvider(
  new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID }),
  'https://cognitiveservices.azure.com/.default'
)

const getConfig = () => {
  const config = {
    azureOpenAIApiVersion: aiConfig.apiVersion,
    azureOpenAIApiInstanceName: aiConfig.instanceName,
    onFailedAttempt,
    verbose: true
  }

  if (aiConfig.apiKey) {
    console.log('Using Azure OpenAI API key')

    return {
      ...config,
      azureOpenAIApiKey: aiConfig.apiKey
    }
  }

  console.log('Using managed identity')

  return {
    ...config,
    azureADTokenProvider: tokenProvider
  }
}

const chat = new AzureChatOpenAI({
  ...getConfig(),
  azureOpenAIApiDeploymentName: aiConfig.generationModelName
})
const embeddings = new AzureOpenAIEmbeddings({
  ...getConfig(),
  azureOpenAIApiDeploymentName: aiConfig.embeddingsModelName
})

module.exports = {
  chat,
  embeddings
}
