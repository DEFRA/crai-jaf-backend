const util = require('util')

const { addJaf, getSimilarJafs } = require('../repos/jaf')
const { extractJaf } = require('./ai/extract-jaf')

const embedProps = ['summary']

const storeJaf = async (jaf, contentType) => {
  const extracted = await extractJaf(jaf, contentType, { embedProps, chunk: true })

  await addJaf(extracted)

  return extracted
}

const findSimilarJaf = async (jaf, contentType) => {
  const extracted = await extractJaf(jaf, contentType, { embedProps })

  console.log(util.inspect(extracted, { depth: null }))

  const similarJafs = await getSimilarJafs(extracted)

  console.log(`Found ${similarJafs.length} similar JAFs`)

  return similarJafs
}

module.exports = {
  storeJaf,
  findSimilarJaf
}
