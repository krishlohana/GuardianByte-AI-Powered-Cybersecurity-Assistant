import React from 'react';
import { AlertOctagon } from 'lucide-react';

const EmergencyGuide = () => {
  const steps = [
    {
      title: "Isolate the System",
      description: "Immediately disconnect the affected device from all networks"
    },
    {
      title: "Document Everything",
      description: "Take screenshots and notes of any suspicious activity"
    },
    {
      title: "Change Credentials",
      description: "Update passwords from a different, secure device"
    },
    {
      title: "Contact Support",
      description: "Reach out to our security team for assistance"
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <AlertOctagon className="w-8 h-8 text-red-400" />
        <h2 className="text-3xl font-bold">Emergency Response Guide</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-2xl font-bold text-blue-400 mb-4">Step {index + 1}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyGuide;