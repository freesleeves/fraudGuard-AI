import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { FraudInput, FraudAnalysisOutput } from "../types";

const analyzeFraud = async (inputData: FraudInput): Promise<FraudAnalysisOutput> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Analyze the following SME transaction data for fraud, AML risks, and financial distress.

Input Data:
${JSON.stringify(inputData, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const parsedResponse = JSON.parse(text) as FraudAnalysisOutput;
    return parsedResponse;

  } catch (error) {
    console.error("Error analyzing fraud data:", error);
    throw error;
  }
};

export { analyzeFraud };
