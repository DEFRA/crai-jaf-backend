const { addJaf, getSimilarJafs, getJafById } = require('../repos/jaf')
const { extractJaf } = require('./ai/extract-jaf')

const embedProps = ['jobSummary', 'deliverables', 'knowledge', 'skills', 'keyResponsibilities']

const storeJaf = async (jaf, contentType) => {
  const extracted = await extractJaf(jaf, contentType, { embedProps, chunk: true })

  await addJaf(extracted)

  return extracted
}

const findJaf = async (jafId) => {
  const jaf = await getJafById(jafId)

  const similarJafs = await getSimilarJafs(jaf)

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
