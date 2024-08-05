const mainActivitiesPrompt = `
  [INST]
  You are an expert at extracting information from documents.

  You will be provided with [JAF], a Job Analysis Form.

  Your task is to extract main activities from the [JAF] and return a JSON array of those main activities and time percentages, strictly adhering to the JSON schema in [SCHEMA].

  Return only the JSON array. Do not include anything else.
  [/INST]

  [SCHEMA]
  {{
    "type": "array",
    "items": {{
      "type": "object",
      "properties": {{
        "activity": {{
          "type": "string",
          "description": "Description of the activity"
        }},
        "time_percentage": {{
          "type": "string",
          "description": "Time percentage of the activity"
        }}
      }}
    }},
    "description": "The main activities of the job referenced in the JAF"
  }}
  [/SCHEMA]

  [JAF]
  {jaf}
  [/JAF]
`

module.exports = {
  mainActivitiesPrompt
}
