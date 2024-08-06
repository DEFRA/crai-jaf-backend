const Joi = require('joi')
const { CallbackHandler } = require('langfuse-langchain')

const schema = Joi.object({
  publicKey: Joi.string().required(),
  secretKey: Joi.string().required(),
  baseUrl: Joi.string().required()
})

const config = {
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error('Invalid LangFuse Config: ', error.message)
}

const langfuseHandler = process.env.LANGFUSE_ENABLED ? new CallbackHandler(config) : null

module.exports = {
  langfuseHandler
}
