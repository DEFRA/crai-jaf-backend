const { addJaf, getSimilarJafs, getJafById } = require('../repos/jaf')
const { extractJaf } = require('./ai/extract-jaf')
const { embeddings } = require('./ai/clients/azure')

const embedProps = ['summary']

const storeJaf = async (jaf, contentType) => {
  const extracted = await extractJaf(jaf, contentType, { embedProps, chunk: true })

  await addJaf(extracted)

  return extracted
}

const findJaf = async (jafId) => {
  const jaf = await getJafById(jafId)
  console.log(jaf)

  const jafWithEmbeddings = {
    ...jaf,
    embeddings: [{
      prop: 'summary',
      embeddedChunks: [{
        embedded: await embeddings.embedQuery(jaf.summary.summary)
      }]
    }]
  }

  const similarJafs = await getSimilarJafs(jafWithEmbeddings, jaf.name)

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
