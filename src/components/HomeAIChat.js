import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import NavLayout from "../pages/NavLayout"; // ✅ correct relative path
import axios from "axios";

export default function HomeAIChat({ user }) {
  const navigate = useNavigate();
  const MAX_FREE_QUESTIONS = 3;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://menya-leaf-ai-api.onrender.com/predict"; // replace with actual endpoint

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = async () => {
    if (!input.trim() && !imagePreview) return;

    if (questionCount >= MAX_FREE_QUESTIONS) {
      navigate("/login");
      return;
    }

    // Show user message immediately
    const userMessage = { sender: "user", text: input, image: imagePreview };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", input);
      if (imagePreview) {
        const file = await fetch(imagePreview).then(r => r.blob());
        formData.append("image", file, "upload.jpg");
      }

      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Append AI response
      setMessages(prev => [
        ...prev,
        userMessage,
        { sender: "ai", text: res.data.answer || "🌱 Sorry, no response received." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "🌱 Sorry, an error occurred while processing your request." },
      ]);
    }

    setQuestionCount(prev => prev + 1);
    setInput("");
    setImagePreview(null);
    setLoading(false);
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <NavLayout user={user}>
      <div className="flex justify-center items-start p-4">
        {/* AI CHAT CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-5 w-full max-w-xl">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
              Ask AgroCare AI 🌾
            </h3>
          </div>

          {/* CHAT */}
          <div className="h-72 overflow-y-auto border rounded-lg p-3 mb-3 bg-gray-50 dark:bg-slate-700">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Ask about crop diseases, pests, or farming tips…
              </p>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 dark:bg-slate-600 dark:text-white"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.image && (
                  <img
                    src={msg.image}
                    alt="uploaded"
                    className="mt-2 max-w-xs rounded-lg border"
                  />
                )}
              </div>
            ))}

            {loading && (
              <p className="text-sm text-gray-500 dark:text-gray-300">🌱 AI is thinking...</p>
            )}
          </div>

          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <div className="mb-3 text-center">
              <img
                src={imagePreview}
                alt="preview"
                className="mx-auto max-h-40 rounded-lg border"
              />
              <button
                onClick={removeImage}
                className="mt-2 text-sm text-red-600 hover:underline"
              >
                ❌ Remove image
              </button>
            </div>
          )}

          {/* INPUT */}
          {questionCount >= MAX_FREE_QUESTIONS ? (
            <div className="text-center">
              <p className="text-red-600 text-sm mb-2">Free limit reached</p>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Login to continue
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your question…"
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Send
                </button>
              </div>

              <div className="flex gap-4 text-sm">
                <label className="cursor-pointer text-green-600 hover:underline">
                  📁 Upload image
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                </label>
              </div>
            </>
          )}

          <p className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">
            Free questions remaining: {MAX_FREE_QUESTIONS - questionCount}
          </p>
        </div>
      </div>
    </NavLayout>
  );
}
