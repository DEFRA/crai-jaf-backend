const skillsPrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract skills from the [JAF] and return a JSON array of those skills, strictly adhering to the JSON schema in [SCHEMA].

  Return only the nameless JSON array. Do not include anything else.
  [/INST]

  [SCHEMA]
  {{
    "type": "array",
    "items": {{
      "type": "string"
    }},
    "description": "The skills required for the job referenced in the JAF."
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  skillsPrompt
}
