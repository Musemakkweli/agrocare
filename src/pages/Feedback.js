// src/pages/Feedback.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faStar,
  faStarHalfAlt,
  faReply,
  faPaperPlane,
  faArchive,
  faSearch,
  faSpinner,
  faEllipsisV,
  faEye,
  faBookmark as faBookmarkSolid,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";

// Import regular icons from the regular package
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";

import { motion, AnimatePresence } from "framer-motion";
import NavLayout from "./NavLayout";

export default function FarmerFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, starred, archived
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, rating

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockFeedback = [
          {
            id: 1,
            from: "Dr. Mugisha Jean",
            role: "Senior Agronomist",
            avatar: null,
            message: "Your maize crop shows signs of nitrogen deficiency. The leaves are turning yellow from the tips inward. I recommend applying a nitrogen-rich fertilizer like urea at a rate of 50kg per hectare. Also, consider planting legumes as cover crops to naturally fix nitrogen in the soil.",
            date: "2024-03-15T10:30:00",
            read: false,
            starred: true,
            archived: false,
            rating: 5,
            replies: [
              {
                id: 101,
                from: "You",
                message: "Thank you doctor. How soon should I apply the fertilizer?",
                date: "2024-03-15T14:20:00"
              },
              {
                id: 102,
                from: "Dr. Mugisha Jean",
                message: "Apply within the next 3 days for best results. Make sure to water the plants after application.",
                date: "2024-03-15T15:45:00"
              }
            ],
            category: "crop-health",
            attachments: [
              { name: "nitrogen-deficiency-guide.pdf", size: "2.3 MB" }
            ]
          },
          {
            id: 2,
            from: "Claude Uwimana",
            role: "Agronomist",
            avatar: null,
            message: "The pest control measures you applied for the fall armyworms seem effective. I've inspected your field and found minimal new damage. Continue monitoring and reapply if you see new infestation. Consider introducing natural predators like parasitic wasps for long-term control.",
            date: "2024-03-14T09:15:00",
            read: true,
            starred: false,
            archived: false,
            rating: 4,
            replies: [],
            category: "pest-control",
            attachments: []
          },
          {
            id: 3,
            from: "Marie Louise",
            role: "Irrigation Specialist",
            avatar: null,
            message: "Your irrigation schedule needs adjustment for the dry season. Currently, you're watering too frequently which can lead to root rot. I recommend switching to deeper, less frequent watering - 2 times per week for 45 minutes each session. This will encourage deeper root growth.",
            date: "2024-03-13T16:45:00",
            read: false,
            starred: true,
            archived: false,
            rating: 5,
            replies: [
              {
                id: 103,
                from: "You",
                message: "Should I adjust for all crops or just maize?",
                date: "2024-03-13T18:30:00"
              }
            ],
            category: "irrigation",
            attachments: [
              { name: "dry-season-schedule.pdf", size: "1.1 MB" },
              { name: "irrigation-tips.jpg", size: "0.8 MB" }
            ]
          },
          {
            id: 4,
            from: "Peter Nkusi",
            role: "Soil Scientist",
            avatar: null,
            message: "Soil test results are back. Your fields show low potassium levels, which is affecting fruit development in your tomatoes. I've attached the full report. Consider applying potassium sulfate at 100kg per hectare before the next planting.",
            date: "2024-03-12T11:20:00",
            read: true,
            starred: false,
            archived: true,
            rating: 5,
            replies: [],
            category: "soil-health",
            attachments: [
              { name: "soil-test-report.pdf", size: "3.5 MB" }
            ]
          },
          {
            id: 5,
            from: "Diane Mukamana",
            role: "Crop Specialist",
            avatar: null,
            message: "Your beans are showing signs of anthracnose. The dark lesions on the pods are characteristic. Remove infected plants immediately to prevent spread. I recommend spraying with a copper-based fungicide and practicing crop rotation for the next season.",
            date: "2024-03-11T13:50:00",
            read: false,
            starred: false,
            archived: false,
            rating: 4,
            replies: [],
            category: "disease",
            attachments: []
          }
        ];
        
        setFeedback(mockFeedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Filter feedback based on selected filter and search term
  const filteredFeedback = feedback
    .filter(item => {
      // Filter by type
      if (filter === "unread") return !item.read;
      if (filter === "starred") return item.starred;
      if (filter === "archived") return item.archived;
      return !item.archived; // "all" shows non-archived
    })
    .filter(item => {
      // Search filter
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        item.from.toLowerCase().includes(searchLower) ||
        item.message.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const markAsRead = (id) => {
    setFeedback(prev =>
      prev.map(item =>
        item.id === id ? { ...item, read: true } : item
      )
    );
    setActiveDropdown(null);
  };

  const toggleStarred = (id) => {
    setFeedback(prev =>
      prev.map(item =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
    setActiveDropdown(null);
  };

  const toggleArchive = (id) => {
    setFeedback(prev =>
      prev.map(item =>
        item.id === id ? { ...item, archived: !item.archived } : item
      )
    );
    setActiveDropdown(null);
  };

  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setShowReplyModal(true);
    setActiveDropdown(null);
  };

  const submitReply = () => {
    if (!replyText.trim() || !selectedFeedback) return;

    const newReply = {
      id: Date.now(),
      from: "You",
      message: replyText,
      date: new Date().toISOString()
    };

    setFeedback(prev =>
      prev.map(item =>
        item.id === selectedFeedback.id
          ? { ...item, replies: [...item.replies, newReply] }
          : item
      )
    );

    setReplyText("");
    setShowReplyModal(false);
    setSelectedFeedback(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "crop-health": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "pest-control": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      "irrigation": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "soil-health": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      "disease": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
    };
    return colors[category] || colors.default;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 text-xs" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 dark:text-gray-600 text-xs" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <NavLayout>
        <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your feedback...</p>
          </div>
        </div>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
            Agronomist Feedback
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            View and manage feedback from agricultural experts
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search feedback by expert or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition relative ${
                  filter === "unread"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Unread
                {feedback.filter(f => !f.read && !f.archived).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {feedback.filter(f => !f.read && !f.archived).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter("starred")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "starred"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-400" />
                Starred
              </button>
              <button
                onClick={() => setFilter("archived")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === "archived"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <FontAwesomeIcon icon={faArchive} className="mr-1" />
                Archived
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        {filteredFeedback.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faComment} className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Feedback Found</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? "No results match your search criteria" 
                : "You don't have any feedback from agronomists yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 ${
                  !item.read ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                        {item.avatar ? (
                          <img src={item.avatar} alt={item.from} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          item.from.split(" ").map(n => n[0]).join("").substring(0, 2)
                        )}
                      </div>
                      
                      {/* Expert Info */}
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-base sm:text-lg">
                            {item.from}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.role}
                          </span>
                          {!item.read && (
                            <span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            {formatDate(item.date)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                            {item.category?.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <div className="flex items-center gap-1">
                        {renderStars(item.rating)}
                      </div>
                      
                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="text-gray-500 dark:text-gray-400" />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 z-10"
                            >
                              {!item.read && (
                                <button
                                  onClick={() => markAsRead(item.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-xl flex items-center gap-2"
                                >
                                  <FontAwesomeIcon icon={faEye} className="text-blue-500" />
                                  Mark as Read
                                </button>
                              )}
                              <button
                                onClick={() => toggleStarred(item.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                              >
                                <FontAwesomeIcon 
                                  icon={item.starred ? faBookmarkSolid : faBookmarkRegular} 
                                  className={item.starred ? "text-yellow-500" : "text-gray-500"} 
                                />
                                {item.starred ? "Remove Star" : "Add Star"}
                              </button>
                              <button
                                onClick={() => toggleArchive(item.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                              >
                                <FontAwesomeIcon icon={faArchive} className="text-purple-500" />
                                {item.archived ? "Unarchive" : "Archive"}
                              </button>
                              <button
                                onClick={() => handleReply(item)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 last:rounded-b-xl flex items-center gap-2"
                              >
                                <FontAwesomeIcon icon={faReply} className="text-green-500" />
                                Reply
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="ml-12 sm:ml-16 mb-3">
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {item.message}
                    </p>
                    
                    {/* Attachments */}
                    {item.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.attachments.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                          >
                            <span>📎</span>
                            <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">({file.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {item.replies.length > 0 && (
                    <div className="ml-12 sm:ml-16 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      {item.replies.map((reply) => (
                        <div key={reply.id} className="mb-3 last:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-800 dark:text-white">
                              {reply.from}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(reply.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Button */}
                  <div className="ml-12 sm:ml-16 mt-3">
                    <button
                      onClick={() => handleReply(item)}
                      className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition"
                    >
                      <FontAwesomeIcon icon={faReply} />
                      Reply to this feedback
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reply Modal */}
        <AnimatePresence>
          {showReplyModal && selectedFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowReplyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faReply} />
                    Reply to {selectedFeedback.from}
                  </h2>
                </div>

                {/* Original Message Preview */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original message:</p>
                  <p className="text-sm text-gray-800 dark:text-white italic">
                    "{selectedFeedback.message.substring(0, 100)}..."
                  </p>
                </div>

                {/* Reply Form */}
                <div className="p-6">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    autoFocus
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setShowReplyModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitReply}
                      disabled={!replyText.trim()}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                      Send Reply
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NavLayout>
  );
}
