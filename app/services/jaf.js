const { addJaf, getJafById } = require('../repos/jaf')
const { extractJaf } = require('./ai/extract-jaf')

const embedProps = ['job_summary', 'knowledge', 'skills']

const storeJaf = async (jaf, profession, contentType) => {
  const extracted = await extractJaf(jaf, contentType, { embedProps, chunk: true })

  await addJaf(extracted, profession)

  return extracted
}

const findJaf = async (jafId) => {
  const jaf = await getJafById(jafId)

  return jaf
}

module.exports = {
  storeJaf,
  findJaf
}
