const deliverablesPrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract deliverables from the [JAF] and return a JSON array of those deliverables, strictly adhering to the JSON schema in [SCHEMA].

  Return only the JSON array. Do not include anything else.
  [/INST]

  [SCHEMA]
  {{
    "type": "array",
    "items": {{
      "type": "string"
    }},
    "description": "The deliverables of the job referenced in the JAF"
    }}
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  deliverablesPrompt
}
