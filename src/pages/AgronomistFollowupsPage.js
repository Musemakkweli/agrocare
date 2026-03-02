import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faComment, 
  faImage, 
  faCheckCircle, 
  faClock,
  faUser,
  faLeaf,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";

export default function AgronomistFollowupsPage() {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);
    
    if (!user || user.role !== "agronomist") {
      console.log("No user found, redirecting to login");
      navigate("/login");
      return;
    }

    fetchFollowups(user.id);
  }, [navigate]);

  const fetchFollowups = async (userId) => {
    try {
      console.log("Fetching followups for user:", userId);
      const response = await fetch(`${BASE_URL}/followup/agronomist/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Followups data received:", data);
      
      // Check if data is an array, if not, make it an array
      if (Array.isArray(data)) {
        setFollowups(data);
      } else if (data && typeof data === 'object') {
        // If it's an object, maybe it has a data property or wrap it
        console.log("Data is an object, checking structure:", data);
        if (data.data && Array.isArray(data.data)) {
          setFollowups(data.data);
        } else {
          // If it's a single object, wrap it in an array
          setFollowups([data]);
        }
      } else {
        setFollowups([]);
      }
      
    } catch (error) {
      console.error("Error fetching followups:", error);
      setError(error.message);
      setFollowups([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/followup/${id}/read`, {
        method: "PUT",
      });
      
      if (response.ok) {
        const user = JSON.parse(localStorage.getItem("user"));
        fetchFollowups(user.id);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  // Ensure followups is an array before trying to map
  const followupsArray = Array.isArray(followups) ? followups : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-400">
        Farmer Follow-ups
      </h2>

      {followupsArray.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
          <FontAwesomeIcon icon={faComment} className="text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No follow-ups from farmers yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {followupsArray.map(f => (
            <div
              key={f.id || Math.random()}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border ${
                f?.status === 'pending' 
                  ? 'border-l-4 border-l-yellow-500' 
                  : 'border-gray-200 dark:border-gray-700'
              } p-4`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FontAwesomeIcon icon={faUser} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {f?.farmer_name || 'Unknown Farmer'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        <FontAwesomeIcon icon={faLeaf} className="mr-1" />
                        Complaint: {f?.complaint_title || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {f?.message && (
                    <p className="text-gray-700 dark:text-gray-300 mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {f.message}
                    </p>
                  )}

                  {f?.image_url && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">
                        <FontAwesomeIcon icon={faImage} className="mr-1" /> Attached Image:
                      </p>
                      <img
                        src={f.image_url}
                        alt="Farmer follow-up"
                        className="max-h-64 rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {formatDate(f?.created_at)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    f?.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {f?.status === 'pending' ? 'New' : 'Read'}
                  </span>

                  {f?.status === 'pending' && (
                    <button
                      onClick={() => markAsRead(f.id)}
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}