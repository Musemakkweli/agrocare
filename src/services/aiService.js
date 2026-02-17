import OpenAI from 'openai';

// Initialize OpenAI with your key
const openai = new OpenAI({
  apiKey: "sk-ed55d5c6207c421f87a3561a07e69470",
  dangerouslyAllowBrowser: true // Note: In production, you should proxy through your backend
});

export const sendMessageToAI = async (message, imageFile = null) => {
  try {
    let content = message;
    
    // If there's an image, we need to handle it differently
    if (imageFile) {
      // Convert image to base64
      const base64Image = await fileToBase64(imageFile);
      
      // For vision capabilities, you'd use GPT-4 Vision
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: message || "Analyze this plant image for diseases or issues:" },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });
      
      return response.choices[0].message.content;
    } else {
      // Text-only message
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are AgroCare AI, a helpful assistant for farmers. You provide advice on crop diseases, pests, farming techniques, and agricultural best practices. Keep responses concise and practical."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 300,
      });
      
      return response.choices[0].message.content;
    }
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};