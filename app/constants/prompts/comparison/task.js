const taskPrompt = `
  [INST]
  You are an expert at finding similarities and differences between Job Analysis Forms (JAFs).

  You will be provided with:
  1. [JAF]: The base JAF used for comparison.
  2. [COMPJAF]: JAF to compare the base JAF to.

  Instructions:
  1. Find similarities and differences between tasks in the base [JAF] and [COMPJAF].
  2. Focus on job summary and main activities for the comparison.
  3. Create a JSON array with a comprehensive list of tasks, scored using mechanism outlined in [TASK_SCORING].
  4. Provide a comprehensive summary of your reasoning for your findings.

  Output:
  Return a nameless JSON array containing the tasks, strictly adhering to the schema in [SCHEMA].
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
  Frequency Scale - How often is the task performed?
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
    "type": "array",
    "properties": {{
      "task": {{
        "type": "string",
        "description": "Name of the task."
      }},
      "importance_score": {{
        "type": "number",
        "description": "Score of the task, scored using the Importance Scale in [TASK_SCORING]."
      }},
      "frequency_score": {{
        "type": "number",
        "description": "Score of the task, scored using the Frequency Scale in [TASK_SCORING]."
      }},
      "summary": {{
        "type": "string",
        "description": "Comprehensive summary of reasoning behind task scorings."
      }}
    }},
    "required": ["task", "importance_score", "frequency_score", "summary"]
  }}
  [/SCHEMA]
`

module.exports = {
  taskPrompt
}
