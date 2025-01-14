"use server"

import { Category } from "./dataschemas";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function suggestBudgets(categories: Category[], scope: string, duration: string) {
  const PROMPT: string = `
I will give you an IT project scope, a duration and a set of cost categories. You will try to infere a budget for such categories in euros.
Provide a structured response with the following information expressed in JSON:
[
{
  category_name: string;
  budget: number;
}
]

I expect to get a list of categories with their budget. Use only categories from the given subset, if you find there's anything missing group the rest of the costs under the category Other.
Provide only the structured output in as a JSON array with the exact format as the example. Do not add any contextual information.

Categories: ${categories.map(cat => cat.category_name).join(", ")}
Scope: ${scope}
Duration: ${duration}
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: PROMPT }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    console.log("AI response:", JSON.stringify(completion, null, 2));
    const response = completion.choices[0].message.content;
    if (!response) return [];

    let suggestions = JSON.parse(response);
    if (suggestions.budget) // Sometimes ignores the instruction
        suggestions = suggestions.budget;
    console.log("AI suggested budgets:", suggestions);
    return suggestions.map((suggestion: any) => ({
      category_name: suggestion.category_name,
      budget: suggestion.budget
    }));
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return [];
  }
}