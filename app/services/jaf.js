const { addJaf, getSimilarJafs, getJafById } = require('../repos/jaf')
const { extractJaf } = require('./ai/extract-jaf')

const embedProps = ['summary', 'deliverables', 'key_responsibilities']

const storeJaf = async (jaf, contentType) => {
  const extracted = await extractJaf(jaf, contentType, { embedProps, chunk: true })

  await addJaf(extracted)

  return extracted
}

const findJaf = async (jafId) => {
  const jaf = await getJafById(jafId)

  const similarJafs = await getSimilarJafs(jafId)

  console.log(`Found ${similarJafs.length} similar JAFs`)

  return {
    jaf,
    similarJafs
  }
}

module.exports = {
  storeJaf,
  findJaf
}
