const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { JsonOutputParser } = require('@langchain/core/output_parsers')

const { getJafById, getJafsByGrade } = require('../../repos/jaf')
const { chat } = require('./clients/azure')

const prompt = `
  [INST]
  You are an expert at comparing Job Analysis Forms (JAFs).

  You will be provided with:
  1. [JAF]: The base JAF used for comparison.
  2. [JAFS]: A list of JAFs to compare against the base JAF.

  Instructions:
  1. Compare the base [JAF] against each JAF in [JAFS].
  2. Focus on skills and experiences deliverables, and key responsibilities for the comparison. Do not use JAF names in your analysis.
  3. For each comparison, create a JSON object following the schema in [SCHEMA].
  4. Include all skills and experiences in your analysis, even if they don't match.
  5. Provide a comprehensive summary of your reasoning for the similarity score.

  Output:
  Return a JSON array containing comparison objects for all JAFs in [JAFS], strictly adhering to the schema in [SCHEMA].
  [/INST]

  [JAF]
  {jaf}
  [/JAF]

  [JAFS]
  {jafs}
  [/JAFS]

  [SCHEMA]
  {{
    "type": "array",
    "items": {{
      "type": "object",
      "properties": {{
        "name": {{
          "type": "string",
          "description": "The title of the job referenced in the JAF"
        }},
        "similarity_score": {{
          "type": "number",
          "description": "Similarity percentage (0-100) assigned by you"
        }},
        "skills": {{
          "type": "array",
          "items": {{
            "type": "object",
            "properties": {{
              "skill": {{
                "type": "string"
              }},
              "match": {{
                "type": "boolean"
              }},
              "reasoning": {{
                "type": "string"
              }}
            }},
            "required": ["skill", "match", "reasoning"]
          }},
          "description": "Comprehensive list of skills with match status and reasoning"
        }},
        "experience": {{
          "type": "array",
          "items": {{
            "type": "object",
            "properties": {{
              "experience": {{
                "type": "string"
              }},
              "match": {{
                "type": "boolean"
              }},
              "reasoning": {{
                "type": "string"
              }}
            }},
            "required": ["experience", "match", "reasoning"]
          }},
          "description": "Comprehensive list of experiences with match status and reasoning"
        }},
        "deliverables": {{
        "type": "array",
        "items": {{
          "type": "object",
          "properties": {{
            "deliverable": {{
              "type": "string"
            }},
            "match": {{
              "type": "boolean"
            }},
            "reasoning": {{
              "type": "string"
            }}
          }},
          "required": ["deliverable", "match", "reasoning"]
        }},
        "description": "Comprehensive list of deliverables with match status and reasoning"
      }},
      "key_responsibilities": {{
        "type": "array",
        "items": {{
          "type": "object",
          "properties": {{
            "responsibility": {{
              "type": "string"
            }},
            "match": {{
              "type": "boolean"
            }},
            "reasoning": {{
              "type": "string"
            }}
          }},
          "required": ["responsibility", "match", "reasoning"]
        }},
        "description": "Comprehensive list of key responsibilities with match status and reasoning"
      }},
        "summary": {{
          "type": "string",
          "description": "Comprehensive summary of reasoning behind your similarity scoring"
        }}
      }},
      "required": ["name", "similarity_score", "skills", "experience", "deliverables", "key_responsibilities", "summary"]
    }}
  }}
  [/SCHEMA]
`
const buildJafObject = (jaf) => {
  return {
    name: jaf.name,
    skills: jaf.summary.knowledge.skills,
    experience: jaf.summary.knowledge.experience,
    deliverables: jaf.summary.deliverables,
    key_responsibilities: jaf.summary.key_responsibilities
  }
}

const compareJafs = async (jafId1, jafId2) => {
  const jaf1 = await getJafById(jafId1)

  const jaf2 = await getJafById(jafId2)

  const chain = ChatPromptTemplate.fromTemplate(prompt)
    .pipe(chat)
    .pipe(new JsonOutputParser())

  const similarJafs = await chain.invoke({
    jaf: JSON.stringify(buildJafObject(jaf1)),
    jafs: JSON.stringify(buildJafObject(jaf2))
  })

  return similarJafs
}

const compareJaf = async (jafId) => {
  const jaf = await getJafById(jafId)
  const grade = jaf.summary.details.grade
  const jafs = await getJafsByGrade(grade)

  const mappedJafs = jafs.map(buildJafObject)

  const chain = ChatPromptTemplate.fromTemplate(prompt)
    .pipe(chat)
    .pipe(new JsonOutputParser())

  const similarJafs = await chain.invoke({
    jaf: JSON.stringify(buildJafObject(jaf)),
    jafs: JSON.stringify(mappedJafs)
  })

  return similarJafs
}

module.exports = {
  compareJafs,
  compareJaf
}
