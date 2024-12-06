import React, { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, FileSpreadsheet, FileText, Filter, Settings } from 'lucide-react';
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Sample data
const votingData = [
  { district: "District A", votes: 12500, turnout: 75 },
  { district: "District B", votes: 15000, turnout: 82 },
  { district: "District C", votes: 9800, turnout: 68 },
  { district: "District D", votes: 11200, turnout: 71 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];


// Admin Reporting Page
export const AdminReportPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [election, setElection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const electionData = location.state?.election;
    if(electionData){
      setElection(electionData);
    }else{
      console.error('No election data found');
      alert('Unable to get election data. Please select the election again!');
      navigate('/admin');
    }
  })

  // Calculate total votes and percentages
  const totalVotes = election?.candidates?.reduce((sum, candidate) => sum + candidate.voteCount, 0) || 0;
  const candidateData = election?.candidates?.map((candidate) => ({
    ...candidate,
    percentage: ((candidate.voteCount /totalVotes) * 100).toFixed(2), // Add percentage to each candidate
  })) || [];

  console.log(candidateData);
  console.log(totalVotes);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Election Reports</h1>
        </div>

        {/* Candidate Vote Percentages Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Real-Time Voting Statistics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ gridTemplateColumns: '5fr 4fr' }}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                    data={candidateData.filter(candidate => candidate.voteCount > 0)}  // Filter out zero-vote candidates
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="voteCount"
                    nameKey="candidateId"
                    label={({ candidateId, percentage }) => `${candidateId}: ${percentage}%`}
                  >
                    {candidateData
                      .filter(candidate => candidate.voteCount > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Pie>
                    <Tooltip 
                      formatter={(value, candidateId, props) => {
                        const percentage = props.payload.percentage;
                        return [`${value} votes (${percentage}%)`, candidateId];
                      }}
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: 'white' }}
                    />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                {candidateData.map((candidate, index) => (
                  <div key={candidate.candidateId} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold">{candidate.candidateId}</span>
                      <span className="text-xl font-bold" style={{color: COLORS[index]}}>{candidate.voteCount}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{
                          width: `${candidate.percentage}%`, 
                          backgroundColor: COLORS[index]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the existing code remains the same */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">Predictive Analytics Dashboard</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg mb-4">Model Performance</h3>
                <div className="space-y-4">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg">
                    Update Prediction Models
                  </button>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">
                    Generate Forecast Report
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-4">Custom Reports</h3>
                <div className="space-y-4">
                  <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export Analytics Data
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Configure Custom Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportPage;