import React, { useState, useEffect } from "react";
import NavLayout from "../pages/NavLayout";
import axios from "axios";

export default function HomeAIChat({ user: propUser }) {
  // Create local state for user with fallback to localStorage
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // For mobile sidebar toggle

  const API_URL = "https://menya-leaf-ai-api.onrender.com/analyze";
  const HISTORY_URL = "http://localhost:8000/ai/chat"; // Backend endpoint

  // ------------------- Load user from props or localStorage -------------------
  useEffect(() => {
    console.log("HomeAIChat - propUser:", propUser);
    
    // First try to use the prop user
    if (propUser?.id) {
      console.log("Using user from props:", propUser);
      setUser(propUser);
      setIsUserLoaded(true);
      return;
    }
    
    // Fallback to localStorage
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log("Loaded user from localStorage:", parsedUser);
        setUser(parsedUser);
        setIsUserLoaded(true);
      } else {
        console.log("No user found in props or localStorage");
        setIsUserLoaded(true);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      setIsUserLoaded(true);
    }
  }, [propUser]);

  // ------------------- Load chat history -------------------
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;

      try {
        console.log("Fetching history for user:", user.id);
        const res = await axios.get(`${HISTORY_URL}/${user.id}`);
        if (res.data && Array.isArray(res.data)) {
          const formatted = res.data.map(item => ({
            id: item.id,
            title: (item.user_message?.slice(0, 30) || "New Chat"),
            // Format messages properly with sender and text fields
            messages: [
              {
                sender: "user",
                text: item.user_message || "Analyzing plant image...",
                image_url: item.image_url, // This should be a URL that works
                timestamp: item.created_at
              },
              {
                sender: "ai",
                text: item.ai_response || "Analysis complete",
                timestamp: item.created_at
              }
            ],
            created_at: item.created_at
          }));
          setHistory(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    if (isUserLoaded && user?.id) {
      fetchHistory();
    }
  }, [user, isUserLoaded]);

  // ------------------- Load specific chat messages -------------------
  const loadChatMessages = (chat) => {
    console.log("Loading chat messages:", chat.messages);
    setMessages(chat.messages || []);
    setShowHistory(false); // Close sidebar on mobile after selecting chat
  };

  // ------------------- Start New Chat -------------------
  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setImagePreview(null);
    setImageFile(null);
    setShowHistory(false); // Close sidebar on mobile when starting new chat
  };

  // ------------------- Send message -------------------
  const handleSend = async () => {
    // Check if user is loaded
    if (!isUserLoaded) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "🌱 Checking authentication..." },
      ]);
      return;
    }

    // Check if user exists
    if (!user?.id) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "🌱 Please log in to use the analyzer. Click the login button in the header." },
      ]);
      return;
    }

    if (!imageFile) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "🌱 Please upload an image of the plant leaf first." },
      ]);
      return;
    }

    // Store the image preview temporarily
    const currentImagePreview = imagePreview;
    
    const userMessage = {
      sender: "user",
      text: input || "Analyzing plant image...",
      image_url: currentImagePreview, // Use image_url consistently
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // Show a message that it might take time
    setMessages(prev => [...prev, { 
      sender: "ai", 
      text: "⏳ Analyzing your image... This may take up to 60 seconds. Please wait.",
      timestamp: new Date().toISOString()
    }]);

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("file", imageFile);

      console.log("Sending to:", API_URL);
      console.log("User ID:", user.id);
      console.log("File:", imageFile.name);

      // Increase timeout to 60 seconds
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      console.log("Response:", res.data);

      // Remove the "analyzing" message
      setMessages(prev => prev.slice(0, -1));

      let answerText = "🌱 Analysis complete.";

      if (res.data) {
        if (res.data.disease) {
          answerText = `🌱 **Disease detected:** ${res.data.disease}\n\n`;
          if (res.data.confidence) {
            answerText += `**Confidence:** ${res.data.confidence}%\n\n`;
          }
          if (res.data.description) {
            answerText += `**Description:** ${res.data.description}\n\n`;
          }
          if (res.data.treatment || res.data.recommendations) {
            answerText += `**Recommendations:**\n`;
            const treatments = res.data.treatment || res.data.recommendations || [];
            if (Array.isArray(treatments)) {
              answerText += treatments.map(t => `• ${t}`).join("\n");
            } else {
              answerText += `• ${treatments}`;
            }
          }
        } else if (res.data.message) {
          answerText = `🌱 ${res.data.message}`;
        } else {
          answerText = `🌱 Response: ${JSON.stringify(res.data, null, 2)}`;
        }
      }

      const aiMessage = { 
        sender: "ai", 
        text: answerText,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

      // Save chat to your local backend
      try {
        // For saving to history, we need to store the image properly
        // If your backend can store images, you'd upload it here
        // For now, we'll save the image URL (note: blob URLs won't work after page refresh)
        const saveRes = await axios.post(HISTORY_URL, {
          user_id: user.id,
          user_message: input || "Analyzing plant image...",
          ai_response: answerText,
          image_url: currentImagePreview, // Save the image URL
        });

        // Update local history with properly formatted messages
        const newChat = {
          id: saveRes.data.id || Date.now(),
          title: (input || "Analyzing plant image...").slice(0, 30),
          messages: [userMessage, aiMessage],
          created_at: new Date().toISOString()
        };
        
        setHistory(prev => [newChat, ...prev]);
      } catch (saveErr) {
        console.error("Error saving to history:", saveErr);
      }

    } catch (err) {
      console.error("Error:", err);
      console.error("Response:", err.response?.data);
      
      // Remove the "analyzing" message
      setMessages(prev => prev.slice(0, -1));
      
      let errorMessage = "🌱 Sorry, an error occurred while analyzing the image.";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "🌱 The analysis is taking too long. The server might be busy. Please try again with a smaller image or try again later.";
      } else if (err.response?.status === 422) {
        const details = err.response.data.detail;
        if (Array.isArray(details)) {
          const missingFields = details.map(d => d.loc.join('.')).join(', ');
          errorMessage = `🌱 Missing required fields: ${missingFields}`;
        } else {
          errorMessage = `🌱 Validation error: ${JSON.stringify(details)}`;
        }
      } else if (err.response?.data?.message) {
        errorMessage = `🌱 ${err.response.data.message}`;
      }
      
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: errorMessage, timestamp: new Date().toISOString() },
      ]);
    } finally {
      setInput("");
      setImagePreview(null);
      setImageFile(null);
      setLoading(false);
    }
  };

  // ------------------- Image upload -------------------
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Reduce max file size to 5MB to help with timeout
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB for faster processing");
      return;
    }

    setImageFile(file);
    // Create a blob URL for preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Clean up blob URL
    }
    setImageFile(null);
    setImagePreview(null);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ------------------- JSX (Mobile Responsive) -------------------
  return (
    <NavLayout user={user}>
      <div className="flex flex-col md:flex-row p-2 sm:p-4 gap-2 sm:gap-4 min-h-[calc(100vh-64px)]">
        
        {/* Mobile History Toggle Button - Visible only on small screens */}
        <div className="md:hidden flex justify-between items-center mb-2 px-1">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            <span>{showHistory ? 'Hide Chats' : 'Show Chats'}</span>
            <span>{showHistory ? '▲' : '▼'}</span>
          </button>
          <button
            onClick={startNewChat}
            className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg"
          >
            + New Chat
          </button>
        </div>

        {/* ------------------- Sidebar: Chat history ------------------- */}
        <div className={`
          ${showHistory ? 'block' : 'hidden'} 
          md:block 
          w-full md:w-1/3 lg:w-1/4 
          max-h-[50vh] md:max-h-[80vh] 
          overflow-y-auto 
          bg-gray-100 dark:bg-slate-800 
          p-3 rounded-lg shadow
          mb-2 md:mb-0
        `}>
          <div className="hidden md:flex justify-between items-center mb-3">
            <h3 className="font-bold text-green-700 dark:text-green-400">Your Chats</h3>
            <button
              onClick={startNewChat}
              className="text-sm text-green-600 hover:underline"
            >
              + New Chat
            </button>
          </div>

          {!isUserLoaded && <p className="text-sm text-gray-500">Loading...</p>}
          {isUserLoaded && !user?.id && <p className="text-sm text-gray-500">Please log in to see your chats.</p>}
          {isUserLoaded && user?.id && history.length === 0 && <p className="text-sm text-gray-500">No chats yet.</p>}
          
          {user?.id && history.map(chat => (
            <div
              key={chat.id}
              className="mb-2 p-2 border rounded bg-white dark:bg-slate-700 cursor-pointer hover:bg-green-100 dark:hover:bg-slate-600"
              onClick={() => loadChatMessages(chat)}
            >
              <p className="text-sm font-medium text-green-600 truncate">{chat.title}</p>
              <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* ------------------- Main chat panel ------------------- */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow p-3 sm:p-5 flex flex-col min-h-[60vh] md:min-h-[80vh]">
          <h3 className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400 mb-2 sm:mb-3">
            Plant Disease Detector 🌾
          </h3>

          {/* Messages container - flexible height */}
          <div className="flex-1 overflow-y-auto border rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 bg-gray-50 dark:bg-slate-700 min-h-[200px] max-h-[40vh] md:max-h-[60vh]">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-300 py-4 sm:py-8">
                {!isUserLoaded ? (
                  <p>Loading authentication...</p>
                ) : !user?.id ? (
                  <div>
                    <p className="mb-2 text-sm sm:text-base">🔒 Please log in to use the plant disease detector</p>
                    <p className="text-xs">Use the login button in the header to access your account</p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2 text-sm sm:text-base">📸 Upload a photo of a plant leaf to detect diseases</p>
                    <p className="text-xs">The AI will analyze the image and provide diagnosis</p>
                  </div>
                )}
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 sm:mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm max-w-[85%] sm:max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 dark:bg-slate-600 dark:text-white"
                }`}>
                  {/* Safe check for msg.text */}
                  {msg.text && msg.text.split("\n").map((line, idx) => (
                    <div key={idx} className={line?.startsWith('•') ? 'ml-1 sm:ml-2' : ''}>
                      {line || <br />}
                    </div>
                  ))}
                  {/* If msg.text is undefined, show empty string */}
                  {!msg.text && ''}
                </div>
                {/* Show image if it exists - check both image_url and image properties */}
                {(msg.image_url || msg.image) && (
                  <img 
                    src={msg.image_url || msg.image} 
                    alt="uploaded" 
                    className="mt-1 sm:mt-2 max-w-full sm:max-w-xs rounded-lg border mx-auto" 
                    style={{ maxHeight: '150px', width: 'auto' }}
                  />
                )}
              </div>
            ))}
            
            {loading && <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">🔍 Analyzing image...</p>}
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="mb-2 sm:mb-3 text-center relative">
              <img 
                src={imagePreview} 
                alt="preview" 
                className="mx-auto max-h-24 sm:max-h-40 rounded-lg border" 
              />
              <button 
                onClick={removeImage} 
                className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 hover:underline block w-full"
              >
                ❌ Remove image
              </button>
            </div>
          )}

          {/* Input area - stacked on mobile, row on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSend()}
              placeholder="Add notes (optional)..."
              className="w-full sm:flex-1 px-3 py-2 text-sm border rounded-lg dark:bg-slate-700 dark:text-white"
              disabled={loading || !user?.id}
            />
            <button
              onClick={handleSend}
              disabled={loading || !imageFile || !user?.id}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm ${
                loading || !imageFile || !user?.id 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {/* Upload button and login warning */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <label className={`cursor-pointer text-center sm:text-left ${
              loading || !user?.id ? "text-gray-400" : "text-green-600 hover:underline"
            }`}>
              📁 Upload plant image
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={handleImageUpload}
                disabled={loading || !user?.id}
              />
            </label>
            {!user?.id && isUserLoaded && (
              <span className="text-xs text-red-500 text-center sm:text-left">Please log in first</span>
            )}
          </div>
        </div>
      </div>
    </NavLayout>
  );
}