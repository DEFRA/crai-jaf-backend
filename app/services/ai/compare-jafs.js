const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { JsonOutputParser } = require('@langchain/core/output_parsers')

const { getJafById, getJafsByGrade } = require('../../repos/jaf')
const { chat } = require('./clients/azure')
const { addJafComparison } = require('../../repos/jaf-comparison')

const prompt = `
  [INST]
  You are an expert at finding similarities and differences between Job Analysis Forms (JAFs).

  You will be provided with:
  1. [JAF]: The base JAF used for comparison.
  2. [COMPJAF]: JAF to compare the base JAF to.

  Instructions:
  1. Find similarities and differences the base [JAF] and [COMPJAF].
  2. Focus on skills, knowledge, deliverables, and main activities for the comparison. Do not use JAF names in your analysis.
  3. Create a JSON object following the schema in [SCHEMA].
  5. Provide a comprehensive summary of your reasoning for the similarity score and your findings.

  Output:
  Return a JSON object containing comparison of the JAFs, strictly adhering to the schema in [SCHEMA].
  [/INST]

  [JAF]
  {baseJaf}
  [/JAF]

  [COMPJAF]
  {comparedJaf}
  [/COMPJAF]

  [SCHEMA]
  {{
    "type": "object",
    "properties": {{
      "name": {{
        "type": "string",
        "description": "The title of the job referenced in the JAF."
      }},
      "similarity_score": {{
        "type": "number",
        "description": "Similarity percentage (0-100) assigned by you."
      }},
      "job_summary": {{
        "type": "object",
        "properties": {{
          "match": {{
            "type": "boolean"
          }},
          "reasoning": {{
            "type": "string"
          }}
        }},
        "required": ["match", "reasoning"],
        "description": "Comparison between job summaries with match status and reasoning behind it."
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
            }}
          }},
          "required": ["skill", "match"]
        }},
        "description": "Comprehensive list of skills with match status."
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
        "description": "Comprehensive list of deliverables with match status and reasoning."
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
        "description": "Comprehensive list of key responsibilities with match status and reasoning."
      }},
      "summary": {{
        "type": "string",
        "description": "Comprehensive summary of reasoning behind your similarity scoring."
      }}
    }},
    "required": ["name", "similarity_score", "job_summary", "skills", "deliverables", "key_responsibilities", "summary"]
  }}
  [/SCHEMA]
`
const buildJafObject = (jaf) => {
  return {
    id: jaf.id,
    name: jaf.name,
    skills: jaf.summary.skills,
    jobSummary: jaf.summary.jobSummary,
    knowledge: jaf.summary.knowledge,
    deliverables: jaf.summary.deliverables,
    keyResponsibilities: jaf.summary.keyResponsibilities,
    mainActivities: jaf.summary.mainActivities
  }
}

const compareJafs = async (baseJaf, comparedJaf) => {
  const chain = ChatPromptTemplate.fromTemplate(prompt)
    .pipe(chat)
    .pipe(new JsonOutputParser())

  const comparison = await chain.invoke({
    baseJaf: JSON.stringify(buildJafObject(baseJaf)),
    comparedJaf: JSON.stringify(buildJafObject(comparedJaf))
  })

  return comparison
}

const compareJaf = async (jafId) => {
  const jaf = await getJafById(jafId)
  const jafs = await getJafsByGrade(jaf.summary.details.grade)

  for (const comparedJaf of jafs) {
    const comparison = await compareJafs(jaf, comparedJaf)
    await addJafComparison(jafId, comparedJaf.id, comparison)
  }
}

module.exports = {
  compareJaf
}
