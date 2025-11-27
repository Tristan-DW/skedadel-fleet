import { GoogleGenAI } from "@google/genai";
import { Order, Driver, Store } from '../types';

// FIX: Initialize the GoogleGenAI client according to guidelines.
// Safely access process.env to avoid ReferenceError in browser environments.
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : "";
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.5-flash';

export const getOperationalInsights = async (
  orders: Order[],
  drivers: Driver[],
  stores: Store[],
): Promise<string> => {
  try {
    const prompt = `
      Analyze the following fleet data and provide operational insights. 
      Focus on identifying potential issues, inefficiencies, and areas for improvement.
      Format the output as a bulleted list.
      - Total Orders: ${orders.length}
      - Successful Orders: ${orders.filter(o => o.status === 'Successful').length}
      - Failed Orders: ${orders.filter(o => o.status === 'Failed').length}
      - Drivers available: ${drivers.filter(d => d.status === 'Available').length}/${drivers.length}
      - Stores online: ${stores.filter(s => s.status === 'ONLINE').length}/${stores.length}

      Recent Failed Orders sample:
      ${orders.filter(o => o.status === 'Failed').slice(0, 3).map(o => `- Order ${o.title} to ${o.destination.address}`).join('\n')}

      Driver status breakdown:
      ${JSON.stringify(drivers.reduce((acc, d) => ({...acc, [d.status]: (acc[d.status] || 0) + 1}), {} as Record<string, number>))}

      Provide a brief, actionable analysis.
    `;

    // FIX: Use the correct method to generate content.
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // FIX: Access the text property directly from the response.
    return response.text;
  } catch (error) {
    console.error("Error getting operational insights:", error);
    return "Error: Could not generate insights from Gemini API.";
  }
};

export const generateOrderSummary = async (orders: Order[]): Promise<string> => {
    try {
        const prompt = `
            Summarize the following list of recent orders into a brief, human-readable paragraph. 
            Mention the total number of orders, the number of successful vs. failed, and highlight any orders with URGENT priority.

            Order Data:
            ${JSON.stringify(orders.slice(0, 10).map(o => ({
                title: o.title,
                status: o.status,
                priority: o.priority,
                type: o.orderType
            })))}
        `;

        // FIX: Use the correct method to generate content.
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        // FIX: Access the text property directly from the response.
        return response.text;
    } catch (error) {
        console.error("Error generating order summary:", error);
        return "Error: Could not generate summary from Gemini API.";
    }
}

// Add a dedicated function for route optimization suggestions
export const getRouteOptimizationSuggestions = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting route optimization suggestions:", error);
    return "Error: Could not get optimization suggestions from Gemini API.";
  }
};
