import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, Shield, Eye, Clock, MapPin, Users, TrendingUp } from 'lucide-react';

interface ThreatReport {
  id: string;
  ip: string;
  location: {
    country: string;
    city: string;
    lat: number;
    lng: number;
  };
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  victimCount: number;
  attackVector: string;
  status: 'active' | 'contained' | 'resolved';
}

const ThreatMap = () => {
  const [threats, setThreats] = useState<ThreatReport[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatReport | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isLive, setIsLive] = useState(true);

  // Dummy threat data with realistic locations and scenarios
  const dummyThreats: ThreatReport[] = [
    {
      id: '1',
      ip: '185.220.101.42',
      location: { country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6176 },
      threatType: 'Ransomware',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      description: 'Large-scale ransomware campaign targeting healthcare institutions',
      victimCount: 47,
      attackVector: 'Email Phishing',
      status: 'active'
    },
    {
      id: '2',
      ip: '103.224.182.251',
      location: { country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074 },
      threatType: 'APT Campaign',
      severity: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      description: 'Advanced persistent threat targeting government infrastructure',
      victimCount: 12,
      attackVector: 'Supply Chain',
      status: 'active'
    },
    {
      id: '3',
      ip: '91.240.118.172',
      location: { country: 'Romania', city: 'Bucharest', lat: 44.4268, lng: 26.1025 },
      threatType: 'Banking Trojan',
      severity: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      description: 'Financial malware targeting European banking customers',
      victimCount: 234,
      attackVector: 'Malicious Downloads',
      status: 'contained'
    },
    {
      id: '4',
      ip: '198.51.100.42',
      location: { country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060 },
      threatType: 'DDoS Attack',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      description: 'Distributed denial of service attack on financial services',
      victimCount: 8,
      attackVector: 'Botnet',
      status: 'resolved'
    },
    {
      id: '5',
      ip: '200.160.2.3',
      location: { country: 'Brazil', city: 'São Paulo', lat: -23.5505, lng: -46.6333 },
      threatType: 'Cryptojacking',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      description: 'Cryptocurrency mining malware spreading through social media',
      victimCount: 156,
      attackVector: 'Social Engineering',
      status: 'active'
    },
    {
      id: '6',
      ip: '41.203.72.219',
      location: { country: 'Nigeria', city: 'Lagos', lat: 6.5244, lng: 3.3792 },
      threatType: 'Business Email Compromise',
      severity: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      description: 'CEO fraud targeting multinational corporations',
      victimCount: 23,
      attackVector: 'Email Spoofing',
      status: 'active'
    },
    {
      id: '7',
      ip: '202.131.229.140',
      location: { country: 'India', city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      threatType: 'Data Breach',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      description: 'Personal data exposure affecting e-commerce platform',
      victimCount: 2847,
      attackVector: 'SQL Injection',
      status: 'active'
    },
    {
      id: '8',
      ip: '80.67.172.162',
      location: { country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050 },
      threatType: 'IoT Botnet',
      severity: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      description: 'Compromised smart devices forming botnet network',
      victimCount: 1205,
      attackVector: 'Default Credentials',
      status: 'contained'
    }
  ];

  useEffect(() => {
    setThreats(dummyThreats);
    
    // Simulate live updates
    if (isLive) {
      const interval = setInterval(() => {
        const newThreat: ThreatReport = {
          id: Date.now().toString(),
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          location: {
            country: ['Japan', 'Australia', 'Canada', 'France', 'UK'][Math.floor(Math.random() * 5)],
            city: ['Tokyo', 'Sydney', 'Toronto', 'Paris', 'London'][Math.floor(Math.random() * 5)],
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180
          },
          threatType: ['Phishing', 'Malware', 'Scam', 'Identity Theft'][Math.floor(Math.random() * 4)],
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          timestamp: new Date().toISOString(),
          description: 'New threat detected by community reporting',
          victimCount: Math.floor(Math.random() * 50) + 1,
          attackVector: ['Email', 'Web', 'Social Media', 'SMS'][Math.floor(Math.random() * 4)],
          status: 'active' as const
        };
        
        setThreats(prev => [newThreat, ...prev.slice(0, 19)]);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const filteredThreats = filter === 'all' 
    ? threats 
    : threats.filter(threat => threat.severity === filter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 border-red-400';
      case 'high': return 'bg-orange-500 border-orange-400';
      case 'medium': return 'bg-yellow-500 border-yellow-400';
      case 'low': return 'bg-green-500 border-green-400';
      default: return 'bg-gray-500 border-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-400';
      case 'contained': return 'text-yellow-400';
      case 'resolved': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              isLive ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live Updates' : 'Paused'}
          </button>
          <div className="text-sm text-gray-400">
            {threats.length} active threats detected
          </div>
        </div>
        
        <div className="flex gap-2">
          {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
            <button
              key={severity}
              onClick={() => setFilter(severity)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                filter === severity
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* World Map Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Globe className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold">Global Threat Distribution</h3>
            </div>
            
            {/* Simplified world map with threat markers */}
            <div className="relative bg-gray-900 rounded-lg h-96 overflow-hidden">
              {/* World map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
              
              {/* Threat markers */}
              {filteredThreats.map((threat) => {
                // Convert lat/lng to percentage positions (simplified projection)
                const x = ((threat.location.lng + 180) / 360) * 100;
                const y = ((90 - threat.location.lat) / 180) * 100;
                
                return (
                  <button
                    key={threat.id}
                    onClick={() => setSelectedThreat(threat)}
                    className={`absolute w-4 h-4 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-150 ${getSeverityColor(threat.severity)} ${
                      threat.status === 'active' ? 'animate-pulse' : ''
                    }`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={`${threat.location.city}, ${threat.location.country} - ${threat.threatType}`}
                  />
                );
              })}
              
              {/* Grid lines for reference */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 bottom-0 w-px bg-gray-600"
                    style={{ left: `${(i + 1) * 10}%` }}
                  />
                ))}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 right-0 h-px bg-gray-600"
                    style={{ top: `${(i + 1) * 16.67}%` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              {[
                { severity: 'critical', label: 'Critical' },
                { severity: 'high', label: 'High' },
                { severity: 'medium', label: 'Medium' },
                { severity: 'low', label: 'Low' }
              ].map(({ severity, label }) => (
                <div key={severity} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border ${getSeverityColor(severity)}`} />
                  <span className="text-sm text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Threat Details Panel */}
        <div className="space-y-6">
          {/* Selected Threat Details */}
          {selectedThreat && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Threat Details</h3>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">
                    {selectedThreat.location.city}, {selectedThreat.location.country}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    selectedThreat.severity === 'critical' ? 'text-red-400' :
                    selectedThreat.severity === 'high' ? 'text-orange-400' :
                    selectedThreat.severity === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`} />
                  <span className="text-sm font-medium">{selectedThreat.threatType}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(selectedThreat.severity)}`}>
                    {selectedThreat.severity.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-sm">{selectedThreat.victimCount} victims affected</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{formatTimeAgo(selectedThreat.timestamp)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${getStatusColor(selectedThreat.status)}`} />
                  <span className={`text-sm ${getStatusColor(selectedThreat.status)}`}>
                    {selectedThreat.status.charAt(0).toUpperCase() + selectedThreat.status.slice(1)}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Description:</p>
                  <p className="text-sm">{selectedThreat.description}</p>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Attack Vector:</p>
                  <p className="text-sm">{selectedThreat.attackVector}</p>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Source IP:</p>
                  <p className="text-sm font-mono">{selectedThreat.ip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Threats List */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-4 mb-6">
              <TrendingUp className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold">Recent Threats</h3>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto threat-map-container">
              {filteredThreats.slice(0, 10).map((threat) => (
                <button
                  key={threat.id}
                  onClick={() => setSelectedThreat(threat)}
                  className="w-full text-left p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">{threat.threatType}</span>
                    <span className="text-xs text-gray-400">{formatTimeAgo(threat.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{threat.location.city}, {threat.location.country}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{threat.victimCount} victims</div>
                </button>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Threat Statistics</h3>
            <div className="space-y-3">
              {Object.entries(
                threats.reduce((acc, threat) => {
                  acc[threat.severity] = (acc[threat.severity] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{severity}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${getSeverityColor(severity).split(' ')[0]}`}
                        style={{ width: `${(count / threats.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatMap;