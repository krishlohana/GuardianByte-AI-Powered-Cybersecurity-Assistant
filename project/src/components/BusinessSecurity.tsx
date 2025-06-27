import React, { useState } from 'react';
import { Building2, Shield, Users, Eye, FileCheck, BookOpen, ArrowRight, Sparkles, X } from 'lucide-react';

const BusinessSecurity = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const guides = [
    {
      title: "Employee Security Training",
      icon: <Users className="w-6 h-6 text-blue-400" />,
      description: "Comprehensive guide for training employees on cybersecurity best practices, including phishing awareness, password management, and data handling.",
      resources: [
        "Security awareness training materials",
        "Phishing simulation templates",
        "Security policy templates",
        "Training assessment tools"
      ]
    },
    {
      title: "Insider Threat Detection",
      icon: <Eye className="w-6 h-6 text-purple-400" />,
      description: "Tools and strategies to identify and prevent insider threats while maintaining employee privacy and trust.",
      resources: [
        "Behavior analysis guidelines",
        "Access control templates",
        "Incident response procedures",
        "Employee monitoring ethics"
      ]
    },
    {
      title: "Security Infrastructure Setup",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      description: "Step-by-step guide for implementing basic security infrastructure, from firewalls to endpoint protection.",
      resources: [
        "Network security checklist",
        "Software recommendations",
        "Configuration guides",
        "Backup strategies"
      ]
    },
    {
      title: "Compliance & Regulations",
      icon: <FileCheck className="w-6 h-6 text-yellow-400" />,
      description: "Navigate security compliance requirements for small businesses, including GDPR, CCPA, and industry-specific regulations.",
      resources: [
        "Compliance checklists",
        "Documentation templates",
        "Audit preparation guides",
        "Privacy policy templates"
      ]
    }
  ];

  const enterpriseFeatures = [
    {
      title: "Custom Security Assessment",
      description: "Tailored evaluation of your organization's security posture with actionable recommendations.",
      price: "Contact Sales"
    },
    {
      title: "24/7 Security Monitoring",
      description: "Real-time threat detection and response for your business infrastructure.",
      price: "Contact Sales"
    },
    {
      title: "Employee Training Program",
      description: "Structured cybersecurity training program with progress tracking and certifications.",
      price: "Contact Sales"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    });
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <Building2 className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold">Business Security Solutions</h2>
      </div>

      {/* Security Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {guides.map((guide, index) => (
          <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-900 rounded-lg">
                {guide.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">{guide.title}</h3>
                <p className="text-gray-400 mb-4">{guide.description}</p>
                <div className="space-y-2">
                  {guide.resources.map((resource, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                      <span>{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Features */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border border-gray-700 p-8 mb-16">
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <h3 className="text-2xl font-semibold">Enterprise Solutions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {enterpriseFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <div className="text-blue-400 font-semibold">{feature.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative z-10">
          <h3 className="text-2xl font-semibold mb-4">Ready to secure your business?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Our team of security experts is ready to help you build a comprehensive security strategy tailored to your business needs.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-semibold transition"
            >
              Schedule a Consultation
            </button>
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer: Free Security Assessment for New Clients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Schedule a Consultation</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSecurity;