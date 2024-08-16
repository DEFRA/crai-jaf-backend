const Joi = require('joi')
const { CallbackHandler } = require('langfuse-langchain')

const schema = Joi.object({
  enabled: Joi.boolean().optional(),
  publicKey: Joi.string().when('enabled', { is: true, then: Joi.required() }),
  secretKey: Joi.string().when('enabled', { is: true, then: Joi.required() }),
  baseUrl: Joi.string().when('enabled', { is: true, then: Joi.required() })
})

const config = {
  enabled: process.env.LANGFUSE_ENABLED,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL
}

const { err, value } = schema.validate(config, { abortEarly: false })

if (err) {
  throw new Error('Invalid LangFuse Config: ', err.message)
}

const handler = new CallbackHandler(value)

module.exports = {
  langfuse: value.enabled ? [handler] : []
}
