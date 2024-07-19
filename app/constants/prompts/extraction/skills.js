const skillsPrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract skills from the [JAF] and return a JSON object with an array of those skills, strictly adhering to the JSON schema in [SCHEMA].

  Return only the JSON object. Do not include anything else.
  [/INST]

  [SCHEMA]
  {{
    "type": "object",
    "properties": {{
      "skills": {{
        "type": "array",
        "items": {{
          "type": "string"
        }},
        "description": "The skills required for the job referenced in the JAF."
      }},
      required: ["skills"]
    }}
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  skillsPrompt
}
