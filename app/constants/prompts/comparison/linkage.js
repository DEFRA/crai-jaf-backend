const linkagePrompt = `
  [INST]
  You are an expert at matching tasks and competencies from Job Analysis Forms (JAFs).

  You will be provided with:
  1. [TASKS]: The list of tasks.
  2. [COMPETENCIES]: The list of competencies.

  Instructions:
  1. Match tasks in [TASKS] to competencies in [COMPETENCIES].
  2. Create a JSON object with arrays of of tasks and competencies.

  Output:
  Return a JSON object containing the tasks and competencies arrays, strictly adhering to the schema in [SCHEMA].
  [/INST]

  [TASKS]
  {tasks}
  [/TASKS]

  [COMPETENCIES]
  {competencies}
  [/COMPETENCIES]

  [SCHEMA]
  {{
  "type": "object",
  "properties": {{
    "competencies": {{
      "type": "array",
      "items": {{
        "type": "object",
        "properties": {{
          "competency": {{
            "type": "string",
            "description": "Name of the competency."
          }},
          "tasks": {{
            "type": "array",
            "items": {{
              "type": "string",
              "description": "Name of the related task."
            }}
          }}
        }},
        "required": ["competency", "tasks"]
      }}
    }},
    "tasks": {{
      "type": "array",
      "items": {{
        "type": "object",
        "properties": {{
          "task": {{
            "type": "string",
            "description": "Name of the task."
          }},
          "competencies": {{
            "type": "array",
            "items": {{
              "type": "string",
              "description": "Name of the related competency."
            }}
          }}
        }},
        "required": ["task", "competencies"]

      }}
    }}
  }},
  "required": ["competencies", "tasks"]
  }}
  [/SCHEMA]
`

module.exports = {
  linkagePrompt
}
