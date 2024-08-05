const knowledgePrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract knowledge from the [JAF] and return a JSON object with a comprehensive summary of that knowledge, strictly adhering to the JSON schema in [SCHEMA].

  Return only the nameless JSON object. Do not include anything else.
  [/INST]

  [SCHEMA]
  {{
    "type": "object",
    "properties": {{
      "knowledge": {{
        "type": "string",
        "description": "Comprehensive summary of knowledge from the JAF"
      }},
      required: ["knowledge"]
    }}
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  knowledgePrompt
}
