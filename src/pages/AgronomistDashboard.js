import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCheckCircle,
  faClock,
  faUser,
  faCalendar,
  faArrowRight,
  faChartLine,
  faLeaf,
  faSeedling,
  faTractor,
  faSprayCan,
  faWater,
  faTemperatureHigh
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from '../config';

export default function AgronomistDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      assigned: 0,
      pending: 0,
      resolved: 0
    },
    recentComplaints: [],
    complaintsByType: [],
    weeklyActivity: [],
    topFarmers: []
  });

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Farm green colors
  const FARM_GREEN = ['#2E7D32', '#4CAF50', '#81C784', '#66BB6A', '#43A047'];
  //const PENDING_BROWN = '#8D6E63';

  // Get logged-in user immediately
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userStr && token) {
        const user = JSON.parse(userStr);
        setLoggedInUser(user);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      navigate('/login');
    }
  }, [navigate]);

  // Define fetchDashboardData with useCallback
  const fetchDashboardData = useCallback(async () => {
    if (!loggedInUser?.id) return;
    
    try {
      const token = localStorage.getItem('token');
      const agronomistId = loggedInUser.id;
      
      const response = await fetch(
        `${BASE_URL}/agronomists/${agronomistId}/complaints`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const complaints = await response.json();
        
        // Calculate stats
        const assigned = complaints.length;
        const pending = complaints.filter(c => c.status === "Pending").length;
        const resolved = complaints.filter(c => c.status === "Resolved").length;
        
        // Get recent complaints (last 5)
        const recent = complaints.slice(0, 5);
        
        // Calculate complaints by type
        const typeMap = {};
        complaints.forEach(c => {
          typeMap[c.type] = (typeMap[c.type] || 0) + 1;
        });
        
        const complaintsByType = Object.entries(typeMap).map(([name, value]) => ({
          name,
          value
        }));
        
        // Weekly activity
        const today = new Date();
        const weeklyActivity = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          const dayComplaints = complaints.filter(c => {
            const complaintDate = new Date(c.created_at);
            return complaintDate.toDateString() === date.toDateString();
          });
          
          weeklyActivity.push({
            day: dayStr,
            assigned: dayComplaints.length,
            resolved: dayComplaints.filter(c => c.status === "Resolved").length
          });
        }
        
        // Get top farmers
        const farmerMap = {};
        complaints.forEach(c => {
          const farmerName = c.farmer_name || "Unknown";
          farmerMap[farmerName] = (farmerMap[farmerName] || 0) + 1;
        });
        
        const topFarmers = Object.entries(farmerMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        
        setDashboardData({
          stats: { assigned, pending, resolved },
          recentComplaints: recent,
          complaintsByType,
          weeklyActivity,
          topFarmers
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [loggedInUser]);

  // Fetch dashboard data immediately when user is available
  useEffect(() => {
    if (loggedInUser?.id) {
      fetchDashboardData();
    }
  }, [loggedInUser, fetchDashboardData]);

  // Get icon for complaint type
  const getTypeIcon = (type) => {
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("pest")) return faSprayCan;
    if (typeLower.includes("water")) return faWater;
    if (typeLower.includes("soil")) return faSeedling;
    if (typeLower.includes("crop")) return faTractor;
    if (typeLower.includes("weather")) return faTemperatureHigh;
    return faLeaf;
  };

  // Get status badge with farm colors
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Resolved':
        return 'bg-[#2E7D32] text-white';
      case 'Pending':
        return 'bg-[#8D6E63] text-white';
      default:
        return 'bg-[#757575] text-white';
    }
  };

  // Navigate to complaints table with filter
  const navigateToComplaints = (filter) => {
    navigate('/agronomist/complaints', { state: { filter } });
  };

  // Show minimal loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F5E9] dark:bg-[#1B3B1B] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#2E7D32] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-[#1B5E20] dark:text-[#C8E6C9]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F5E9] dark:bg-[#1B3B1B] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Welcome Section - Farm Green */}
        <div className="bg-[#2E7D32] dark:bg-[#1B5E20] rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                Welcome back, {loggedInUser?.name?.split(' ')[0] || 'Agronomist'}!
              </h1>
              <p className="text-[#C8E6C9] dark:text-[#A5D6A7] text-sm">
                Here's your farm complaint summary
              </p>
            </div>
            <div className="hidden md:block">
              <FontAwesomeIcon icon={faLeaf} className="text-5xl opacity-20" />
            </div>
          </div>
        </div>

        {/* Stats Cards - Clickable to navigate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Assigned Card */}
          <div 
            onClick={() => navigateToComplaints('all')}
            className="bg-[#2E7D32] dark:bg-[#1B5E20] rounded-xl p-5 text-white shadow-sm cursor-pointer hover:bg-[#1B5E20] dark:hover:bg-[#0D3D0D] transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#C8E6C9] text-xs mb-1">Total Assigned</p>
                <p className="text-2xl font-bold">{dashboardData.stats.assigned}</p>
              </div>
              <div className="bg-[#4CAF50] p-2.5 rounded-full">
                <FontAwesomeIcon icon={faClipboardList} className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-[#C8E6C9]">
              <FontAwesomeIcon icon={faArrowRight} className="mr-1" size="sm" />
              <span>View all</span>
            </div>
          </div>

          {/* Pending Card - Soil Brown */}
          <div 
            onClick={() => navigateToComplaints('pending')}
            className="bg-[#8D6E63] dark:bg-[#6D4C41] rounded-xl p-5 text-white shadow-sm cursor-pointer hover:bg-[#6D4C41] dark:hover:bg-[#4E342E] transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFCCBC] text-xs mb-1">Pending Response</p>
                <p className="text-2xl font-bold">{dashboardData.stats.pending}</p>
              </div>
              <div className="bg-[#A1887F] p-2.5 rounded-full">
                <FontAwesomeIcon icon={faClock} className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-[#FFCCBC]">
              <FontAwesomeIcon icon={faArrowRight} className="mr-1" size="sm" />
              <span>View pending</span>
            </div>
          </div>

          {/* Resolved Card */}
          <div 
            onClick={() => navigateToComplaints('resolved')}
            className="bg-[#4CAF50] dark:bg-[#2E7D32] rounded-xl p-5 text-white shadow-sm cursor-pointer hover:bg-[#2E7D32] dark:hover:bg-[#1B5E20] transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#C8E6C9] text-xs mb-1">Resolved</p>
                <p className="text-2xl font-bold">{dashboardData.stats.resolved}</p>
              </div>
              <div className="bg-[#81C784] p-2.5 rounded-full">
                <FontAwesomeIcon icon={faCheckCircle} className="text-xl text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-[#C8E6C9]">
              <FontAwesomeIcon icon={faArrowRight} className="mr-1" size="sm" />
              <span>View resolved</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar Chart - Status Overview */}
          <div className="bg-white dark:bg-[#2D4A2D] rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-[#1B5E20] dark:text-[#C8E6C9] mb-3">
              <FontAwesomeIcon icon={faChartLine} className="mr-2 text-[#2E7D32]" />
              Status Overview
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Assigned', count: dashboardData.stats.assigned },
                { name: 'Pending', count: dashboardData.stats.pending },
                { name: 'Resolved', count: dashboardData.stats.resolved }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart - Complaint Types */}
          <div className="bg-white dark:bg-[#2D4A2D] rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-[#1B5E20] dark:text-[#C8E6C9] mb-3">
              <FontAwesomeIcon icon={faLeaf} className="mr-2 text-[#2E7D32]" />
              Complaints by Type
            </h2>
            {dashboardData.complaintsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dashboardData.complaintsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardData.complaintsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={FARM_GREEN[index % FARM_GREEN.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-[#8D6E63] dark:text-[#BCAAA4]">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white dark:bg-[#2D4A2D] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#1B5E20] dark:text-[#C8E6C9]">
              <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-[#2E7D32]" />
              Recent Complaints
            </h2>
            <Link 
              to="/agronomist/complaints" 
              className="text-xs text-[#2E7D32] hover:text-[#1B5E20] dark:text-[#81C784] flex items-center"
            >
              View All <FontAwesomeIcon icon={faArrowRight} className="ml-1" size="sm" />
            </Link>
          </div>
          
          <div className="space-y-2">
            {dashboardData.recentComplaints.length > 0 ? (
              dashboardData.recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  onClick={() => navigate(`/agronomist/complaints`)}
                  className="p-3 rounded-lg bg-[#F1F8E9] dark:bg-[#1A3A1A] hover:bg-[#C8E6C9] dark:hover:bg-[#2D4A2D] transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon 
                          icon={getTypeIcon(complaint.type)} 
                          className="text-[#2E7D32] dark:text-[#81C784] text-sm"
                        />
                        <h3 className="font-medium text-[#1B5E20] dark:text-[#C8E6C9] text-sm">
                          {complaint.title.length > 30 ? complaint.title.substring(0, 30) + '...' : complaint.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-[#4CAF50] dark:text-[#A5D6A7]">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} size="sm" />
                          {complaint.farmer_name?.split(' ')[0] || "Unknown"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendar} size="sm" />
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-[#8D6E63] dark:text-[#BCAAA4]">No recent complaints</p>
            )}
          </div>
        </div>

        {/* Top Farmers */}
        <div className="bg-white dark:bg-[#2D4A2D] rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-[#1B5E20] dark:text-[#C8E6C9] mb-3">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-[#2E7D32]" />
            Top Farmers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {dashboardData.topFarmers.length > 0 ? (
              dashboardData.topFarmers.map((farmer, index) => (
                <div key={index} className="bg-[#F1F8E9] dark:bg-[#1A3A1A] p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2E7D32] dark:bg-[#1B5E20] rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1B5E20] dark:text-[#C8E6C9] text-sm">{farmer.name}</p>
                      <p className="text-xs text-[#4CAF50] dark:text-[#81C784]">
                        {farmer.count} complaints
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center py-4 text-[#8D6E63] dark:text-[#BCAAA4]">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}