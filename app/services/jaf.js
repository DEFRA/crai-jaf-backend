const { ChatPromptTemplate } = require('@langchain/core/prompts')
const { JsonOutputParser } = require('@langchain/core/output_parsers')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')

const { chat, embeddings } = require('./ai/clients/azure')
const { addJaf } = require('../repos/jaf')
const { readJaf } = require('../lib/document-loader')

const prompt = `
[INST]
You are a resourcing manager who is reviewing a Job Analysis Form (JAF) for a role in your organization.

Extract the job summary from the [JAF] and return only a JSON object corresponding to JSON schema in [SCHEMA].
[/INST]

[SCHEMA]
{{
  "type": "object",
  "properties": {{
    "details": {{
      "type": "object",
      "properties": {{
        "job_title": {{
          "type": "string",
          "description": "The title of the job referenced in the JAF"
        }},
        "grade": {{
          "type": "string",
          "enum": ["AO", "EO", "HEO", "SEO", "G7", "G6"],
          "description": "The grade of the job referenced in the JAF"
        }},
        "business_unit": {{
          "type": "string",
          "description": "The business unit of the job referenced in the JAF"
        }},
        required: ["job_title", "grade", "business_unit"]
      }}
    }},
    "summary": {{
      "type": "string",
      "description": "The job summary from the JAF"
    }},
    "key_responsibilities": {{
      "type": "array",
      "items": {{
        "type": "string"
      }},
      "description": "The key responsibilities of the job referenced in the JAF"
    }},
    "deliverables": {{
      "type": "array",
      "items": {{
        "type": "string"
      }},
      "description": "The deliverables of the job referenced in the JAF"
    }},
    "main_activities": {{
      "type": "array",
      "items": {{
        "type": "object",
        "properties": {{
          "activity": {{
            "type": "string"
          }},
          "time_percentage": {{
            "type": "string"
          }}
        }}
      }},
      "description": "The main activities of the job referenced in the JAF"
    }},
    "knowledge": {{
      "qualifications": {{
        "type": "array",
        "items": {{
          "type": "string"
        }},
        "description": "The qualifications required from the qualifications section of the JAF."
      }},
      "skills": {{
        "type": "array",
        "items": {{
          "type": "string"
        }},
        "description": "The skills required for the job referenced in the JAF. This may include DDaT skills."
      }},
      "experience": {{
        "type": "array",
        "items": {{
          "type": "string"
        }},
        "description": "The work / previous project experience required for the job referenced in the JAF."
      }}
      required: ["qualifications", "skills", "experience"]
    }},
    "contacts": {{
      "type": "array",
      "items": {{
        "type": "object",
        "properties": {{
          "level": {{
            "type": "string",
            "description": "The level / job role of the contact"
          }},
          "purpose": {{
            "type": "string",
            "description": "The purpose of working with the contact"
          }},
          "frequency": {{
            "type": "string",
            "description": "How often the profession will work with the contact"
          }},
          "type": {{
            "type": "string",
            "description": "The type of contact",
            "enum": ["organisation", "ogd", "third-party"]
        }},
      }},
      "description": "Contacts which are typically required in order to carry out the responsibilities of the role"
    }}
    required: ["details", "summary", "key_responsibilities", "deliverables", "main_activities", "knowledge", "contacts"]
  }}
}}
[/SCHEMA]

[JAF]
{jaf}
[/JAF]
`

const embedProps = ['summary']

const storeJaf = async (jaf, contentType) => {
  const text = await readJaf(jaf, contentType)

  const chain = ChatPromptTemplate.fromTemplate(prompt)
    .pipe(chat)
    .pipe(new JsonOutputParser())

  const summary = await chain.invoke({
    jaf: text
  })

  const jafName = `${summary.details.grade} - ${summary.details.job_title}`

  const processed = {
    jafName,
    summary,
    embeddings: []
  }

  for (const prop of embedProps) {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 50,
      chunkOverlap: 5
    })

    const splitTexts = await splitter.splitText(summary[prop])

    const embeddedChunks = []

    for (const text of splitTexts) {
      const embedded = await embeddings.embedQuery(text)
      embeddedChunks.push({ embedded, text })
    }

    processed.embeddings.push({
      prop,
      embeddedChunks
    })
  }

  await addJaf(processed)

  return processed
}

module.exports = {
  storeJaf
}
