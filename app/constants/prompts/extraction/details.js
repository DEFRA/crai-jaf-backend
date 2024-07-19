const detailsPrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract details from the [JAF] and return a JSON object with those details, strictly adhering to the JSON schema in [SCHEMA].

  Return only the JSON object. Do not include anything else.
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
          }}
          required: ["job_title", "grade"]
        }}
      }},
      required: ["details"]
    }}
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  detailsPrompt
}
