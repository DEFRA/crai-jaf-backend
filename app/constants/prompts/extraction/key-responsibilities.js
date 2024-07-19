const keyResponsibilitiesPrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract key responsibilities from the [JAF] and return a JSON object with an array of those key responsibilities, strictly adhering to the JSON schema in [SCHEMA].

  Return only the JSON object. Do not include anything else.
  [/INST]

  [SCHEMA]
  {{
    "type": "object",
    "properties": {{
      "key_responsibilities": {{
        "type": "array",
        "items": {{
          "type": "string"
        }},
        "description": "The key responsibilities of the job referenced in the JAF"
      }},
      required: ["key_responsibilities"]
    }}
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  keyResponsibilitiesPrompt
}
