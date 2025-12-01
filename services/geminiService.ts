import { GoogleGenAI } from "@google/genai";
import { Invoice, Product, ChatMessage } from "../types";

// Safety check for API key
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateFinancialAdvice = async (
  message: string,
  history: ChatMessage[],
  invoices: Invoice[], 
  products: Product[],
  language: string
): Promise<string> => {
  if (!API_KEY) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    // Create a summarized context of the financial data
    const financialContext = {
      totalRevenue: invoices.reduce((sum, inv) => {
        const sub = inv.items.reduce((s, i) => s + (i.price * i.quantity), 0);
        return sum + (sub + (sub * (inv.taxRate / 100)) - inv.discount);
      }, 0),
      pendingInvoices: invoices.filter(i => i.status === 'pending').length,
      pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, inv) => {
         const sub = inv.items.reduce((s, i) => s + (i.price * i.quantity), 0);
         return sum + (sub + (sub * (inv.taxRate / 100)) - inv.discount);
      }, 0),
      totalInvoices: invoices.length,
      productCount: products.length,
      lowStockProducts: products.filter(p => p.stock < 10).map(p => p.name)
    };

    const systemInstruction = `
      You are an expert CFO and Financial Advisor for a small-to-medium enterprise.
      Your tone is professional, encouraging, and insightful.
      
      Current Financial Context:
      ${JSON.stringify(financialContext)}

      Rules:
      1. Answer the user's questions based on the provided context.
      2. If they ask for an analysis, provide a structured summary using Markdown (bold key figures).
      3. Respond in the language code: "${language}".
      4. Keep answers concise but valuable.
      5. If asked about products, mention low stock items if any.
    `;

    // Format history for the API (last 10 messages to save context window)
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Add current message
    // Note: In a real chat implementation, we would use chat.sendMessage, 
    // but for this stateless service call, we'll combine context into a single prompt 
    // or use the chat model initialization.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: recentHistory
    });

    const response = await chat.sendMessage({ message: message });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I'm having trouble connecting to the AI service right now.";
  }
};