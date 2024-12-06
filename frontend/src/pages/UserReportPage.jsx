import React, { useState } from "react";
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

// Sample data
const votingData = [
  { district: "District A", votes: 12500, turnout: 75 },
  { district: "District B", votes: 15000, turnout: 82 },
  { district: "District C", votes: 9800, turnout: 68 },
  { district: "District D", votes: 11200, turnout: 71 }
];

const demographicData = [
  { category: "Age 18-25", value: 2500 },
  { category: "Age 26-40", value: 4500 },
  { category: "Age 41-60", value: 3800 },
  { category: "Age 60+", value: 2200 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const UserReportPage = () => {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Election Reports & Analytics</h1>
  
          {/* Election Overview Section */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">Election Overview</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={votingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="district" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Bar dataKey="votes" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographicData}
                        dataKey="value"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {demographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
  
          {/* Download Reports Section */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">Download Reports</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center justify-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download Excel Report
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center justify-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download Raw Data
                  </button>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg mb-2">Available Reports</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Voter Turnout Analysis</li>
                    <li>Demographic Distribution Report</li>
                    <li>District-wise Participation Stats</li>
                    <li>Voting Pattern Analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default UserReportPage;
  