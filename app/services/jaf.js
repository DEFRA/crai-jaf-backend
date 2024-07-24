const { addJaf, getJafById } = require('../repos/jaf')
const { extractJaf } = require('./ai/extract-jaf')

const embedProps = ['job_summary', 'deliverables', 'knowledge', 'skills', 'key_responsibilities']

const storeJaf = async (jaf, contentType) => {
  const extracted = await extractJaf(jaf, contentType, { embedProps, chunk: true })

  await addJaf(extracted)

  return extracted
}

const findJaf = async (jafId) => {
  const jaf = await getJafById(jafId)

  console.log(`Found ${jaf.similarJafs.length} similar JAFs`)

  return jaf
}

module.exports = {
  storeJaf,
  findJaf
}
