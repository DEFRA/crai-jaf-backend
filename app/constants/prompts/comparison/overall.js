const overallPrompt = `
  [INST]
  You are an expert at finding similarities and differences between Job Analysis Forms (JAFs).

  You will be provided with:
  1. [JAF]: The base JAF used for comparison.
  2. [COMPJAF]: JAF to compare the base JAF to.

  Instructions:
  1. Compare the 2 JAFs, find key differences and score the similarity between them from 0 to 100 precent.
  2. Create a JSON object following the schema in [SCHEMA].
  3. Provide a comprehensive summary of your reasoning for the similarity score and your findings.

  Output:
  Return a nameless JSON object containing comparison of the JAFs, strictly adhering to the schema in [SCHEMA].
  [/INST]

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
      "key_differences": {{
        "type": "array",
        "items": {{
          "type": "string",
        }},
        "description": "List of key differences."
      }},
      "summary": {{
        "type": "string",
        "description": "Summary of the comparison."
      }}
    }},
    "required": ["similarity_score", "key_differences", "summary"]
  }}
  [/SCHEMA]
`

module.exports = {
  overallPrompt
}
