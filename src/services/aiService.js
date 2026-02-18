// src/services/aiService.js
import axios from "axios";
import BASE_URL from "../config";

/**
 * Send a message to the AI chat endpoint
 * Handles slow AI responses safely
 */
export const sendMessageToAI = async (message, imageFile = null) => {
  let finalMessage = message?.trim();

  if (imageFile) {
    finalMessage =
      finalMessage ||
      "I uploaded a plant image. Please analyze possible disease, pests, or nutrient deficiency.";
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/ai-chat`,
      { message: finalMessage },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000, // ⬅️ 2 minutes (important)
      }
    );

    return response.data?.reply || "🌱 AI responded without text.";

  } catch (error) {
    console.error("AI Service Error:", error);

    // ⏳ Timeout handling
    if (error.code === "ECONNABORTED") {
      return "⏳ The AI is taking longer than usual. Please try again in a moment.";
    }

    // 🌐 Server errors
    if (error.response) {
      const status = error.response.status;

      if (status === 502) {
        return "⚠️ AI service is warming up. Try again shortly.";
      }

      if (status === 400) {
        return "❌ Invalid request.";
      }

      return `🚨 Server error (${status}).`;
    }

    // 🌍 Network issues
    return "🌐 Network error. Please check your connection.";
  }
};

/**
 * Send message using a specific model
 */
export const sendMessageWithModel = async (message, model) => {
  const response = await axios.post(
    `${BASE_URL}/ai-chat?model=${encodeURIComponent(model)}`,
    { message },
    { timeout: 120000 }
  );

  return response.data?.reply || response.data;
};

/**
 * AI health check
 */
export const checkAIServiceHealth = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/ai-chat`,
      { message: "ping" },
      { timeout: 8000 }
    );
    return response.status === 200;
  } catch {
    return false;
  }
};
