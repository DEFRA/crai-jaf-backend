const taskPrompt = `
  [INST]
  You are an expert at finding similarities and differences between Job Analysis Forms (JAFs).

  You will be provided with:
  1. [JAF]: The base JAF used for comparison.
  2. [COMPJAF]: JAF to compare the base JAF to.

  Instructions:
  1. Find similarities and differences the base [JAF] and [COMPJAF].
  2. Focus on skills, knowledge, deliverables, and main activities for the comparison.
  3. Create a JSON object following the schema in [SCHEMA].
  4. Provide a comprehensive summary of your reasoning for the similarity score and your findings.

  Output:
  Return a JSON object containing comparison of the JAFs, strictly adhering to the schema in [SCHEMA].
  [/INST]

  [TASK_SCORING]
  Importance Scale - How important is this task to the job?
  * 0 = Not Performed
  * 1 = Not Important
  * 2 = Somewhat Important
  * 3 = Important
  * 4 = Very Important
  * 5 = Extremely Important
  ----
  Frequency - How often is the task performed?
  * 0 = Not Performed
  * 1 = Every few months to yearly
  * 2 = Every few weeks to monthly
  * 3 = Every few days to weekly
  * 4 = Every few hours to daily
  * 5 = Hourly to many times each hour
  [/TASK_SCORING]

  [JAF]
  {baseJaf}
  [/JAF]

  [COMPJAF]
  {comparedJaf}
  [/COMPJAF]

  [SCHEMA]
  {{
    "type": "object",
    "properties": {{
      "similarity_score": {{
        "type": "number",
        "description": "Similarity percentage (0-100) assigned by you."
      }},
      "job_summary": {{
        "type": "object",
        "properties": {{
          "match": {{
            "type": "boolean"
          }},
          "reasoning": {{
            "type": "string"
          }}
        }},
        "required": ["match", "reasoning"],
        "description": "Comparison between job summaries with match status and reasoning behind it."
      }},
      "skills": {{
        "type": "array",
        "items": {{
          "type": "object",
          "properties": {{
            "skill": {{
              "type": "string"
            }},
            "match": {{
              "type": "boolean"
            }}
          }},
          "required": ["skill", "match"]
        }},
        "description": "Comprehensive list of skills with match status."
      }},
      "key_responsibilities": {{
        "type": "array",
        "items": {{
          "type": "object",
          "properties": {{
            "responsibility": {{
              "type": "string"
            }},
            "match": {{
              "type": "boolean"
            }},
            "reasoning": {{
              "type": "string"
            }}
          }},
          "required": ["responsibility", "match", "reasoning"]
        }},
        "description": "Comprehensive list of key responsibilities with match status and reasoning."
      }},
      "main_activities": {{
        "type": "array",
        "items": {{
          "type": "object",
          "properties": {{
            "activity": {{
              "type": "string"
            }},
            "importance_score": {{
              "type": "number"
            }},
            "frequency_score": {{
              "type": "number"
            }},
            "reasoning": {{
              "type": "string"
            }}
          }},
          "required": ["activity", "importance_score", "frequency_score", "reasoning"]
        }},
        "description": "Comprehensive list of activities/tasks, scored using mechanism outlined in [TASK_SCORING]."
      }},
      "summary": {{
        "type": "string",
        "description": "Comprehensive summary of reasoning behind your similarity scoring."
      }}
    }},
    "required": ["similarity_score", "job_summary", "skills", "key_responsibilities", "main_activities", "summary"]
  }}
  [/SCHEMA]
`

module.exports = {
  taskPrompt
}
