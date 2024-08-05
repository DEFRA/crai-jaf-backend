const competencyPrompt = `
  [INST]
  You are an expert at finding similarities and differences between Job Analysis Forms (JAFs).

  You will be provided with:
  1. [JAF]: The base JAF used for comparison.
  2. [COMPJAF]: JAF to compare the base JAF to.

  Instructions:
  1. Find similarities and differences between competencies in the base [JAF] and [COMPJAF].
  2. Focus your comparison on knowledge & skills, which in some roles will include communication, problem solving, decision making, autonomy and management of resources.
  3. Create a nameless JSON array following the schema in [SCHEMA].
  4. Provide a comprehensive summary of your reasoning for your findings.

  Output:
  Return a nameless JSON array containing comparison of the JAFs, strictly adhering to the schema in [SCHEMA].
  [/INST]

  [COMPETENCY_SCORING]
  Importance Scale - How important is this competency for effective job performance?
  * 1 = Not Important
  * 2 = Somewhat Important
  * 3 = Important
  * 4 = Very Important
  * 5 = Extremely Important
  ----
  Need At Entry Scale - When is this competency needed for effective job performance?
  * 1 = Needed the first day
  * 2 = Must be acquired within the first 3 months
  * 3 = Must be acquired within the first 4-6 months
  * 4 = Must be acquired after the first 6 months
  * 5 = Not needed
  ----
  Distinguishing Value Scale - How valuable is this competency for distinguishing superior from barely acceptable employees?
  * 1 = Not Valuable
  * 2 = Somewhat Valuable
  * 3 = Valuable
  * 4 = Very Valuable
  * 5 = Extremely Valuable
  [/COMPETENCY_SCORING]

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
    "competency": {{
      "type": "string",
      "description": "Name of the competency."
    }},
    "importance_score": {{
      "type": "number",
      "description": "Score of the competency, scored using the Importance Scale in [TASK_SCORING]."
    }},
    "need_score": {{
      "type": "number",
      "description": "Score of the competency, scored using the Need At Entry Scale in [TASK_SCORING]."
    }},
    "value_score": {{
      "type": "number",
      "description": "Score of the competency, scored using the Distinguishing Value Scale in [TASK_SCORING]."
    }},
    "summary": {{
      "type": "string",
      "description": "Comprehensive summary of reasoning behind task scorings."
    }}
  }},
  "required": ["competency", "importance_score", "need_score", "value_score", "summary"]
  }}
  [/SCHEMA]
`

module.exports = {
  competencyPrompt
}
