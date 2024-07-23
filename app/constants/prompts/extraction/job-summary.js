const jobSummaryPrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract job summary from the [JAF] and return a JSON object with that job summary, strictly adhering to the JSON schema in [SCHEMA].

  Return only the JSON object. Do not include anything else.
  [/INST]

  [SCHEMA]
  {{
    "type": "object",
    "properties": {{
      "summary": {{
        "type": "string",
        "description": "The job summary from the JAF"
      }},
      required: ["summary"]
    }}
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  jobSummaryPrompt
}
