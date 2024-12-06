import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AlertTriangle, Camera, Shield, Activity, User, Users } from 'lucide-react';

// Sample data for surveillance and voting
const surveillanceData = [
  { id: 1, location: "Station A", status: "Active", threats: 0, people: 145 },
  { id: 2, location: "Station B", status: "Alert", threats: 1, people: 89 },
  { id: 3, location: "Station C", status: "Active", threats: 0, people: 167 },
  { id: 4, location: "Station D", status: "Warning", threats: 2, people: 234 }
];

const recentIncidents = [
  { time: "10:45 AM", station: "Station B", type: "Crowd Surge", status: "Resolved" },
  { time: "10:30 AM", station: "Station D", type: "Suspicious Activity", status: "Under Review" },
  { time: "10:15 AM", station: "Station D", type: "Unauthorized Access", status: "Active" }
];

const votingTrends = [
  { time: '09:00', voterCount: 150, incidents: 0 },
  { time: '10:00', voterCount: 280, incidents: 1 },
  { time: '11:00', voterCount: 420, incidents: 2 },
  { time: '12:00', voterCount: 390, incidents: 0 },
];

const SecurityDashboard = () => {
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [activeStations, setActiveStations] = useState(156);
  const [totalVoters, setTotalVoters] = useState(1240);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Security Monitoring Dashboard</h1>
          <div className="flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-2 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
            <span>{activeAlerts} Active Alerts</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg">Active Cameras</h3>
            </div>
            <p className="text-2xl font-bold">{activeStations}/160</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="text-lg">System Status</h3>
            </div>
            <p className="text-2xl font-bold text-green-400">Operational</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg">Threat Level</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-400">Moderate</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg">Current Voters</h3>
            </div>
            <p className="text-2xl font-bold">{totalVoters}</p>
          </div>
        </div>

        {/* Surveillance Feed Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Station Monitoring</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {surveillanceData.map((station) => (
                  <div key={station.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <div>
                      <h3 className="font-medium">{station.location}</h3>
                      <p className="text-sm text-gray-300">People Count: {station.people}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${
                      station.status === 'Active' ? 'bg-green-500/20 text-green-500' :
                      station.status === 'Alert' ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {station.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Incident Log */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Recent Incidents</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {recentIncidents.map((incident, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{incident.type}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        incident.status === 'Active' ? 'bg-red-500/20 text-red-500' :
                        incident.status === 'Resolved' ? 'bg-green-500/20 text-green-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {incident.time} - {incident.station}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Voter Flow & Incident Correlation</h2>
          </div>
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={votingTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="voterCount" 
                    stroke="#60A5FA" 
                    name="Voter Count"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="incidents" 
                    stroke="#EF4444" 
                    name="Incidents"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;