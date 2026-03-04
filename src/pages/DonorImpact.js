// src/pages/donor/DonorImpact.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faUsers,
  faSeedling,
  faWater,
  faChartLine,
  faDownload,
  faShare,
  faMapMarkerAlt,
  faCheckCircle,
  faArrowUp,
  faArrowRight,
  faAward,
  faHeart,
  faGlobeAfrica
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
//import { Link } from "react-router-dom";

export default function DonorImpact() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("year"); // year, quarter, month
  const [impactData, setImpactData] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchImpactData();
  }, [timeframe]);

  const fetchImpactData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        setImpactData({
          summary: {
            totalDonated: 15000000,
            totalBeneficiaries: 1250,
            programsSupported: 8,
            activePrograms: 5,
            communitiesReached: 12,
            districts: ["Gitarama", "Muhanga", "Ruhango", "Kamonyi", "Bugesera"],
            totalAcres: 450,
            treesPlanted: 2500,
            jobsCreated: 85
          },
          
          keyMetrics: [
            { 
              category: "Food Security", 
              value: 85, 
              change: 12, 
              target: 90,
              icon: faSeedling,
              color: "green"
            },
            { 
              category: "Income Growth", 
              value: 72, 
              change: 18, 
              target: 80,
              icon: faChartLine,
              color: "blue"
            },
            { 
              category: "Sustainable Practices", 
              value: 78, 
              change: 15, 
              target: 85,
              icon: faLeaf,
              color: "emerald"
            },
            { 
              category: "Women Empowerment", 
              value: 64, 
              change: 22, 
              target: 75,
              icon: faUsers,
              color: "purple"
            }
          ],

          yearlyImpact: [
            { year: "2022", beneficiaries: 450, programs: 3, donations: 4500000, yieldIncrease: 25 },
            { year: "2023", beneficiaries: 780, programs: 5, donations: 8200000, yieldIncrease: 42 },
            { year: "2024", beneficiaries: 1020, programs: 7, donations: 12300000, yieldIncrease: 58 },
            { year: "2025", beneficiaries: 1250, programs: 8, donations: 15000000, yieldIncrease: 72 },
            { year: "2026", beneficiaries: 1450, programs: 9, donations: 18500000, yieldIncrease: 85 }
          ],

          programImpact: [
            {
              id: 1,
              name: "Farm Input Subsidy",
              beneficiaries: 450,
              amount: 5000000,
              impactMetrics: {
                yieldIncrease: "85%",
                incomeBoost: "120%",
                adoptionRate: "92%",
                satisfaction: "94%"
              },
              successStories: [
                "Farmers doubled their maize production",
                "Reduced post-harvest losses by 40%",
                "Introduced drought-resistant varieties"
              ]
            },
            {
              id: 2,
              name: "Irrigation Equipment",
              beneficiaries: 120,
              amount: 3000000,
              impactMetrics: {
                waterEfficiency: "40%",
                cropDiversity: "+6 crops",
                drySeasonFarming: "Yes",
                satisfaction: "96%"
              },
              successStories: [
                "Year-round farming now possible",
                "Water usage reduced by 40%",
                "Three harvest cycles per year"
              ]
            },
            {
              id: 3,
              name: "Training Program",
              beneficiaries: 380,
              amount: 1500000,
              impactMetrics: {
                knowledgeGain: "60%",
                practiceAdoption: "78%",
                certification: "320 farmers",
                satisfaction: "98%"
              },
              successStories: [
                "Modern techniques adopted by 78%",
                "Reduced chemical usage by 30%",
                "Improved soil management"
              ]
            }
          ],

          communityImpact: {
            stories: [
              {
                farmer: "Marie Uwimana",
                village: "Gitarama",
                quote: "With the new irrigation system, I now harvest three times a year instead of once. My children can stay in school.",
                image: "/api/placeholder/100/100",
                program: "Irrigation Equipment",
                impact: "Tripled income"
              },
              {
                farmer: "Peter Habimana",
                village: "Muhanga",
                quote: "The training transformed my farming. I now use modern techniques and my yield has doubled.",
                image: "/api/placeholder/100/100",
                program: "Training Program",
                impact: "200% yield increase"
              }
            ],
            testimonials: [
              {
                name: "Jean Nkurunziza",
                role: "Cooperative Leader",
                text: "This support has changed our community. We're now self-sufficient and even supplying to neighboring districts."
              }
            ]
          },

          environmentalImpact: {
            treesPlanted: 2500,
            soilHealthImproved: "65%",
            waterConservation: "40%",
            carbonOffset: "125 tons",
            organicFarms: 85
          },

          sdgContributions: [
            { goal: "No Poverty", contribution: 85, icon: "🚫💰" },
            { goal: "Zero Hunger", contribution: 92, icon: "🍲" },
            { goal: "Gender Equality", contribution: 64, icon: "⚥" },
            { goal: "Clean Water", contribution: 78, icon: "💧" },
            { goal: "Climate Action", contribution: 71, icon: "🌍" }
          ],

          roi: {
            financial: "1:3.5",
            social: "92%",
            environmental: "78%",
            sustainability: "85%"
          }
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching impact data:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  };

  //const COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#66BB6A', '#43A047', '#388E3C'];
  const METRIC_COLORS = {
    green: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Generating your impact report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl text-green-200" />
                <span className="text-green-200 font-medium">Impact Report</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Impact Overview</h1>
              <p className="text-green-100 text-lg">
                See how your contributions are transforming communities
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-white border border-white/30"
              >
                <option value="year" className="text-gray-900">This Year</option>
                <option value="quarter" className="text-gray-900">Last Quarter</option>
                <option value="month" className="text-gray-900">Last Month</option>
                <option value="all" className="text-gray-900">All Time</option>
              </select>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2">
                <FontAwesomeIcon icon={faDownload} />
                Download PDF
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faShare} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {impactData.keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.category}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}%</p>
                </div>
                <div className={`p-3 rounded-full ${METRIC_COLORS[metric.color]}`}>
                  <FontAwesomeIcon icon={metric.icon} className="text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{metric.value}% of {metric.target}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      metric.color === 'green' ? 'bg-green-600' :
                      metric.color === 'blue' ? 'bg-blue-600' :
                      metric.color === 'emerald' ? 'bg-emerald-600' : 'bg-purple-600'
                    }`}
                    style={{ width: `${(metric.value / metric.target) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <FontAwesomeIcon icon={faArrowUp} />
                  <span>{metric.change}% increase from last year</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-600" />
              Impact Growth Timeline
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg">
                Beneficiaries
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                Donations
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={impactData.yearlyImpact}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="year" stroke="#666" />
              <YAxis yAxisId="left" stroke="#666" />
              <YAxis yAxisId="right" orientation="right" stroke="#666" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'donations') return formatCurrency(value);
                  if (name === 'beneficiaries') return value.toLocaleString();
                  return value;
                }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="beneficiaries" 
                stroke="#2E7D32" 
                fill="#4CAF50" 
                fillOpacity={0.3} 
                name="Beneficiaries"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="donations" 
                stroke="#1976D2" 
                fill="#2196F3" 
                fillOpacity={0.3} 
                name="Donations"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Program Impact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Program Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              <FontAwesomeIcon icon={faSeedling} className="mr-2 text-green-600" />
              Program Impact Details
            </h2>
            {impactData.programImpact.map((program) => (
              <div 
                key={program.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedReport(program)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{program.name}</h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Beneficiaries</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{program.beneficiaries} farmers</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Investment</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(program.amount)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(program.impactMetrics).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Click to view full impact report</span>
                </div>
              </div>
            ))}
          </div>

          {/* Environmental Impact */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              <FontAwesomeIcon icon={faLeaf} className="mr-2 text-green-600" />
              Environmental Impact
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <FontAwesomeIcon icon={faTree} className="text-3xl text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.environmentalImpact.treesPlanted}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Trees Planted</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <FontAwesomeIcon icon={faWater} className="text-3xl text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.environmentalImpact.waterConservation}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Water Conservation</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
                  <FontAwesomeIcon icon={faSeedling} className="text-3xl text-emerald-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.environmentalImpact.organicFarms}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Organic Farms</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
                  <FontAwesomeIcon icon={faGlobeAfrica} className="text-3xl text-amber-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{impactData.environmentalImpact.carbonOffset}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Carbon Offset</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Soil Health Improvement</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Organic Matter</span>
                    <span className="font-medium text-gray-900 dark:text-white">65%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SDG Contributions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">UN SDG Contributions</h3>
              <div className="space-y-3">
                {impactData.sdgContributions.map((sdg, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span>{sdg.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300">{sdg.goal}</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{sdg.contribution}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full" 
                        style={{ width: `${sdg.contribution}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            <FontAwesomeIcon icon={faHeart} className="mr-2 text-red-500" />
            Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactData.communityImpact.stories.map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <img 
                    src={story.image} 
                    alt={story.farmer}
                    className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{story.farmer}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                      {story.village} • {story.program}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{story.quote}"</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Impact: {story.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 text-white">
            <FontAwesomeIcon icon={faChartLine} className="text-3xl mb-2 opacity-80" />
            <p className="text-sm opacity-90">Financial ROI</p>
            <p className="text-2xl font-bold">{impactData.roi.financial}</p>
            <p className="text-xs opacity-75 mt-1">Return on investment</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white">
            <FontAwesomeIcon icon={faUsers} className="text-3xl mb-2 opacity-80" />
            <p className="text-sm opacity-90">Social Impact</p>
            <p className="text-2xl font-bold">{impactData.roi.social}</p>
            <p className="text-xs opacity-75 mt-1">Community satisfaction</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5 text-white">
            <FontAwesomeIcon icon={faLeaf} className="text-3xl mb-2 opacity-80" />
            <p className="text-sm opacity-90">Environmental Impact</p>
            <p className="text-2xl font-bold">{impactData.roi.environmental}</p>
            <p className="text-xs opacity-75 mt-1">Sustainability score</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-5 text-white">
            <FontAwesomeIcon icon={faAward} className="text-3xl mb-2 opacity-80" />
            <p className="text-sm opacity-90">Long-term Sustainability</p>
            <p className="text-2xl font-bold">{impactData.roi.sustainability}</p>
            <p className="text-xs opacity-75 mt-1">Program durability</p>
          </div>
        </div>
      </div>

      {/* Program Impact Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReport.name} - Full Impact Report</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Impact Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedReport.impactMetrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Success Stories */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Success Stories</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedReport.successStories.map((story, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{story}</li>
                    ))}
                  </ul>
                </div>

                {/* Download Options */}
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faDownload} />
                    Download Full Report
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share Impact Report</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input 
                  type="email"
                  placeholder="friend@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea 
                  rows="3"
                  placeholder="Add a personal message..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Send Report
                </button>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add missing Tree icon
const faTree = faSeedling; // Using seedling as tree icon