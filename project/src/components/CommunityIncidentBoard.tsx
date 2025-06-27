import React, { useState } from 'react';
import { Users, Shield, AlertTriangle, Send, Filter } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  region: string;
  severity: 'low' | 'medium' | 'high';
}

const CommunityIncidentBoard = () => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'LinkedIn Job Offer Impersonation',
      description: 'Received a message from someone claiming to be a recruiter with an urgent job offer. The profile was created recently and used a stolen photo.',
      category: 'Social Engineering',
      timestamp: '2024-03-15T10:30:00Z',
      region: 'North America',
      severity: 'medium'
    },
    {
      id: '2',
      title: 'Fake Banking SMS Alert',
      description: 'Got an SMS claiming my account was locked. The link led to a convincing clone of my bank\'s website asking for login credentials.',
      category: 'Phishing',
      timestamp: '2024-03-14T15:45:00Z',
      region: 'Europe',
      severity: 'high'
    },
    {
      id: '3',
      title: 'Crypto Investment Scam',
      description: 'Instagram account impersonating a celebrity promoting a "limited time" cryptocurrency investment opportunity.',
      category: 'Investment Fraud',
      timestamp: '2024-03-13T09:15:00Z',
      region: 'Asia',
      severity: 'medium'
    }
  ]);

  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    region: 'North America'
  });

  const [filter, setFilter] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple AI categorization based on keywords
    const keywords = {
      'Phishing': ['bank', 'login', 'account', 'password', 'verify'],
      'Social Engineering': ['linkedin', 'job', 'recruiter', 'profile', 'connection'],
      'Investment Fraud': ['crypto', 'investment', 'bitcoin', 'trading', 'profit'],
      'Malware': ['download', 'attachment', 'exe', 'install', 'update'],
      'Identity Theft': ['ssn', 'identity', 'credit card', 'personal information']
    };

    let category = 'Other';
    let severity: 'low' | 'medium' | 'high' = 'medium';
    
    const content = (newIncident.title + ' ' + newIncident.description).toLowerCase();
    
    for (const [cat, words] of Object.entries(keywords)) {
      if (words.some(word => content.includes(word))) {
        category = cat;
        // Determine severity based on risk factors
        if (content.includes('password') || content.includes('bank') || content.includes('credit card')) {
          severity = 'high';
        }
        break;
      }
    }

    const incident: Incident = {
      id: Date.now().toString(),
      title: newIncident.title,
      description: newIncident.description,
      category,
      timestamp: new Date().toISOString(),
      region: newIncident.region,
      severity
    };

    setIncidents(prev => [incident, ...prev]);
    setNewIncident({ title: '', description: '', region: 'North America' });
  };

  const filteredIncidents = filter === 'all' 
    ? incidents 
    : incidents.filter(incident => incident.category === filter);

  const categories = ['all', ...new Set(incidents.map(i => i.category))];

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <Users className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold">Community Incident Board</h2>
      </div>

      {/* Submit Form */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Report an Incident</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Incident Title</label>
              <input
                type="text"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                placeholder="Brief description of the incident"
                value={newIncident.title}
                onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Details</label>
              <textarea
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                rows={4}
                placeholder="Describe what happened (no personal information)"
                value={newIncident.description}
                onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <select
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                value={newIncident.region}
                onChange={(e) => setNewIncident(prev => ({ ...prev, region: e.target.value }))}
              >
                <option>North America</option>
                <option>Europe</option>
                <option>Asia</option>
                <option>South America</option>
                <option>Africa</option>
                <option>Oceania</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Report
            </button>
          </div>
        </form>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map(incident => (
          <div
            key={incident.id}
            className="bg-gray-800 rounded-xl border border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${
                  incident.severity === 'high' ? 'bg-red-500/20' :
                  incident.severity === 'medium' ? 'bg-yellow-500/20' :
                  'bg-green-500/20'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    incident.severity === 'high' ? 'text-red-400' :
                    incident.severity === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{incident.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{new Date(incident.timestamp).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{incident.region}</span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-400">
                {incident.category}
              </span>
            </div>
            <p className="text-gray-400">{incident.description}</p>
          </div>
        ))}
      </div>

      {/* Pattern Analysis */}
      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold">Attack Pattern Analysis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(
            incidents.reduce((acc, incident) => {
              acc[incident.category] = (acc[incident.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([category, count]) => (
            <div key={category} className="bg-gray-900 rounded-lg p-4">
              <h4 className="font-medium mb-2">{category}</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{count}</span>
                <span className="text-sm text-gray-400">
                  {Math.round((count / incidents.length) * 100)}% of reports
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityIncidentBoard;