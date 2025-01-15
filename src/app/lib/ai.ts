"use server"

/**
 * AI module for budget suggestions using OpenAI's API
 * @module ai
 */

import { Category } from "./dataschemas";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Suggests budgets for project categories using AI
 * 
 * @param {Category[]} categories - Array of available cost categories
 * @param {string} scope - Project scope description
 * @param {string} duration - Project duration in days (e.g. "30 days")
 * @returns {Promise<Array<{category_name: string, budget: number}>>} Array of budget suggestions
 */
export async function suggestBudgets(categories: Category[], scope: string, duration: string) {
  const PROMPT: string = `
I will give you an IT project scope, a duration and a set of cost categories. You will try to infere a budget 
for such categories in euros.
Provide a structured response with the following information expressed in JSON:
[
{
  category_name: string;
  budget: number;
}
]

I expect to get a list of categories with their budget. Use only categories from the given subset, 
if you find there's anything missing group the rest of the costs under the category Other.
Provide only the structured output in as a JSON array with the exact format as the example. 
Do not add any contextual information.

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
    // Handle case where AI returns object with budget array instead of direct array
    if (suggestions.budget) {
      suggestions = suggestions.budget;
    }
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