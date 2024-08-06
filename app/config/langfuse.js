const { CallbackHandler } = require('langfuse-langchain')

const langfuseParams = {
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL
}

const langfuseHandler = process.env.LANGFUSE_ENABLED ? new CallbackHandler(langfuseParams) : null

module.exports = {
  langfuseHandler
}
