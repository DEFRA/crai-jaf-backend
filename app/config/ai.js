const Joi = require('joi')

const schema = Joi.object({
  instanceName: Joi.string().required(),
  apiKey: Joi.string().optional(),
  embeddingsModelName: Joi.string().required(),
  generationModelName: Joi.string().required(),
  apiVersion: Joi.string().required()
})

const config = {
  instanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
  apiKey: process.env.AZURE_OPENAI_KEY,
  embeddingsModelName: process.env.EMBEDDING_MODEL_NAME,
  generationModelName: process.env.GENERATION_MODEL_NAME,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The AI config is invalid. ${error.message}`)
}

module.exports = value
