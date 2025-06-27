import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User, Bot, AlertTriangle, Shield, Lock, Wifi, Database, Eye, Globe } from 'lucide-react';

interface Message {
  content: string;
  isAi: boolean;
}

const ThreatAdvisor = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI Security Advisor. I specialize in cybersecurity and can help you with:\n\n• Threat analysis and prevention\n• Security best practices\n• Incident response guidance\n• Technical security explanations\n• Real-time security recommendations\n\nHow can I assist you with your cybersecurity needs today?",
      isAi: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Comprehensive cybersecurity knowledge base
  const cybersecurityKnowledge = {
    phishing: {
      keywords: ['phishing', 'email', 'scam', 'fake', 'suspicious', 'link', 'attachment'],
      response: `**Phishing Protection Guide:**

🎣 **What is Phishing?**
Phishing is a cyber attack where criminals impersonate legitimate organizations to steal sensitive information like passwords, credit card numbers, or personal data.

🚨 **Common Signs:**
• Urgent or threatening language
• Generic greetings ("Dear Customer")
• Suspicious sender addresses
• Unexpected attachments or links
• Requests for sensitive information
• Poor grammar or spelling

🛡️ **Protection Strategies:**
• Always verify sender identity through independent channels
• Hover over links to check destinations before clicking
• Use email filters and anti-phishing tools
• Enable two-factor authentication
• Keep software updated
• Report suspicious emails to your IT team

💡 **Best Practice:** When in doubt, don't click! Contact the organization directly using official contact information.`
    },
    
    passwords: {
      keywords: ['password', 'authentication', 'login', 'credential', '2fa', 'mfa'],
      response: `**Password Security Best Practices:**

🔐 **Strong Password Creation:**
• Use at least 12-16 characters
• Mix uppercase, lowercase, numbers, and symbols
• Avoid personal information (names, dates, addresses)
• Use unique passwords for each account
• Consider passphrases (e.g., "Coffee!Sunrise#Beach2024")

🔑 **Password Management:**
• Use a reputable password manager (Bitwarden, 1Password, LastPass)
• Enable two-factor authentication (2FA) everywhere possible
• Use authenticator apps instead of SMS when possible
• Regularly update passwords for critical accounts

⚠️ **What to Avoid:**
• Reusing passwords across multiple sites
• Storing passwords in browsers on shared computers
• Using common passwords (123456, password, qwerty)
• Sharing passwords via email or text

🛡️ **Advanced Security:**
• Use hardware security keys for critical accounts
• Enable account monitoring and alerts
• Regularly audit your accounts and permissions`
    },

    malware: {
      keywords: ['malware', 'virus', 'trojan', 'ransomware', 'spyware', 'adware', 'worm'],
      response: `**Malware Protection & Response:**

🦠 **Types of Malware:**
• **Viruses:** Self-replicating programs that attach to files
• **Trojans:** Disguised malicious software
• **Ransomware:** Encrypts files and demands payment
• **Spyware:** Secretly monitors user activity
• **Adware:** Displays unwanted advertisements
• **Rootkits:** Hide deep in system files

🛡️ **Prevention Strategies:**
• Keep operating system and software updated
• Use reputable antivirus with real-time protection
• Avoid downloading from untrusted sources
• Be cautious with email attachments
• Use ad blockers and script blockers
• Regular system backups (3-2-1 rule)

🚨 **If Infected:**
1. Disconnect from internet immediately
2. Boot from antivirus rescue disk
3. Run full system scan
4. Restore from clean backups if necessary
5. Change all passwords after cleaning
6. Monitor accounts for suspicious activity

💡 **Pro Tip:** Prevention is always better than cure. Invest in good security habits and tools.`
    },

    network: {
      keywords: ['network', 'wifi', 'router', 'firewall', 'vpn', 'public wifi'],
      response: `**Network Security Essentials:**

🌐 **Home Network Security:**
• Change default router passwords and usernames
• Use WPA3 encryption (or WPA2 if WPA3 unavailable)
• Disable WPS (WiFi Protected Setup)
• Enable router firewall
• Regularly update router firmware
• Use strong WiFi passwords (20+ characters)

🔒 **Public WiFi Safety:**
• Always use a VPN on public networks
• Avoid accessing sensitive accounts
• Turn off auto-connect features
• Use your phone's hotspot instead when possible
• Verify network names with staff
• Keep sharing settings disabled

🛡️ **Advanced Protection:**
• Set up a guest network for visitors
• Use network segmentation for IoT devices
• Monitor connected devices regularly
• Consider mesh networks for better coverage
• Implement network access control (NAC)

⚠️ **Red Flags:**
• Networks without passwords
• Duplicate network names
• Unexpected connection requests
• Slow or suspicious network behavior`
    },

    data: {
      keywords: ['data', 'backup', 'privacy', 'breach', 'leak', 'gdpr', 'encryption'],
      response: `**Data Protection & Privacy:**

💾 **Backup Strategy (3-2-1 Rule):**
• 3 copies of important data
• 2 different storage media types
• 1 offsite backup location
• Test backups regularly
• Automate backup processes

🔐 **Data Encryption:**
• Use full disk encryption (BitLocker, FileVault)
• Encrypt sensitive files and folders
• Use encrypted messaging apps
• Secure cloud storage with encryption
• Encrypt external drives and USB devices

🛡️ **Privacy Protection:**
• Review and adjust privacy settings regularly
• Limit data sharing with third parties
• Use privacy-focused browsers and search engines
• Be cautious about social media oversharing
• Read privacy policies for important services

🚨 **Data Breach Response:**
1. Identify what data was compromised
2. Change passwords for affected accounts
3. Monitor credit reports and bank statements
4. Enable fraud alerts with credit bureaus
5. Consider identity theft protection services
6. Report to relevant authorities if necessary

💡 **Remember:** Your data is valuable - treat it like the asset it is!`
    },

    social: {
      keywords: ['social', 'engineering', 'manipulation', 'pretexting', 'baiting', 'tailgating'],
      response: `**Social Engineering Defense:**

🎭 **Common Tactics:**
• **Pretexting:** Creating fake scenarios to gain trust
• **Baiting:** Offering something enticing to trigger actions
• **Tailgating:** Following authorized personnel into secure areas
• **Quid Pro Quo:** Offering services in exchange for information
• **Authority Impersonation:** Pretending to be someone in power

🧠 **Psychological Triggers:**
• Urgency and time pressure
• Authority and intimidation
• Trust and rapport building
• Fear and anxiety
• Curiosity and greed
• Helpfulness and reciprocity

🛡️ **Defense Strategies:**
• Verify identity through independent channels
• Be skeptical of unsolicited contact
• Don't provide information over the phone
• Follow proper verification procedures
• Trust your instincts - if something feels off, it probably is
• Implement security awareness training

📞 **Phone Security:**
• Never give personal info to unsolicited callers
• Hang up and call back using official numbers
• Be wary of caller ID spoofing
• Don't confirm personal details

💡 **Golden Rule:** When someone asks for sensitive information, always verify their identity first!`
    },

    incident: {
      keywords: ['incident', 'response', 'breach', 'attack', 'compromise', 'emergency'],
      response: `**Incident Response Plan:**

🚨 **Immediate Actions (First 30 minutes):**
1. **Contain:** Isolate affected systems
2. **Assess:** Determine scope and severity
3. **Notify:** Alert security team and management
4. **Document:** Record all actions taken
5. **Preserve:** Maintain evidence integrity

📋 **Response Phases:**

**Phase 1: Preparation**
• Develop incident response plan
• Train response team
• Set up monitoring tools
• Establish communication channels

**Phase 2: Detection & Analysis**
• Monitor for security events
• Analyze alerts and logs
• Determine if incident occurred
• Classify incident severity

**Phase 3: Containment & Eradication**
• Short-term containment
• System backup and forensics
• Long-term containment
• Remove threat from environment

**Phase 4: Recovery**
• Restore systems from clean backups
• Monitor for recurring activity
• Implement additional safeguards
• Return to normal operations

**Phase 5: Lessons Learned**
• Document what happened
• Analyze response effectiveness
• Update procedures and tools
• Conduct training updates

🔧 **Essential Tools:**
• Network monitoring systems
• Forensic analysis tools
• Secure communication channels
• Backup and recovery systems`
    },

    general: {
      keywords: ['security', 'cybersecurity', 'protection', 'safety', 'best practices'],
      response: `**Cybersecurity Fundamentals:**

🛡️ **Core Security Principles:**
• **Confidentiality:** Protect information from unauthorized access
• **Integrity:** Ensure data accuracy and completeness
• **Availability:** Maintain system accessibility when needed
• **Authentication:** Verify user identities
• **Authorization:** Control access to resources
• **Non-repudiation:** Prevent denial of actions

🔒 **Essential Security Practices:**
• Keep all software updated and patched
• Use strong, unique passwords with 2FA
• Regular security awareness training
• Implement least privilege access
• Monitor and log security events
• Regular security assessments and audits

📊 **Risk Management:**
• Identify and catalog assets
• Assess threats and vulnerabilities
• Calculate risk levels
• Implement appropriate controls
• Monitor and review regularly
• Update based on new threats

🌟 **Security Culture:**
• Make security everyone's responsibility
• Encourage reporting of suspicious activity
• Provide regular training and updates
• Lead by example from management
• Reward good security practices
• Learn from incidents and mistakes

💡 **Remember:** Security is a journey, not a destination. Stay vigilant and keep learning!`
    }
  };

  // Free AI API fallback using Hugging Face Inference API
  const tryHuggingFaceAPI = async (userMessage: string): Promise<string | null> => {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Cybersecurity Expert: ${userMessage}`,
          parameters: {
            max_length: 500,
            temperature: 0.7,
            do_sample: true
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.generated_text || result[0]?.generated_text || null;
      }
    } catch (error) {
      console.log('Hugging Face API not available:', error);
    }
    return null;
  };

  // Intelligent response matching
  const getIntelligentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find the best matching category
    for (const [category, data] of Object.entries(cybersecurityKnowledge)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }

    // If no specific match, provide general cybersecurity guidance
    if (lowerMessage.includes('help') || lowerMessage.includes('what') || lowerMessage.includes('how')) {
      return cybersecurityKnowledge.general.response;
    }

    // Default response with helpful suggestions
    return `**I'm here to help with cybersecurity!**

I can provide detailed guidance on:

🎣 **Phishing & Email Security**
🔐 **Password & Authentication**
🦠 **Malware Protection**
🌐 **Network Security**
💾 **Data Protection & Privacy**
🎭 **Social Engineering Defense**
🚨 **Incident Response**

Try asking me about any of these topics, such as:
• "How do I protect against phishing?"
• "What makes a strong password?"
• "How do I secure my home network?"
• "What should I do if I think I've been hacked?"

What specific cybersecurity topic would you like to learn about?`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessages(prev => [...prev, { content: userMessage, isAi: false }]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Try free AI API first
      const aiResponse = await tryHuggingFaceAPI(userMessage);
      
      if (aiResponse && aiResponse.length > 50) {
        // Use AI response if it's substantial
        setMessages(prev => [...prev, { content: aiResponse, isAi: true }]);
      } else {
        // Fall back to intelligent knowledge base
        const knowledgeResponse = getIntelligentResponse(userMessage);
        setMessages(prev => [...prev, { content: knowledgeResponse, isAi: true }]);
      }
    } catch (err) {
      console.error('AI Response Error:', err);
      
      // Always fall back to knowledge base
      const fallbackResponse = getIntelligentResponse(userMessage);
      setMessages(prev => [...prev, { content: fallbackResponse, isAi: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <MessageSquare className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold">AI Security Advisor</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
          <Shield className="w-4 h-4" />
          <span>Always Available</span>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4 ai-chat-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.isAi ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  msg.isAi ? 'bg-blue-500/20' : 'bg-gray-700'
                }`}>
                  {msg.isAi ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className={`rounded-lg p-4 max-w-[80%] ${
                  msg.isAi ? 'bg-gray-900' : 'bg-blue-500/20'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce delay-100">●</div>
                <div className="animate-bounce delay-200">●</div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {[
                { icon: <Shield className="w-4 h-4" />, text: "Phishing Protection", query: "How do I protect against phishing attacks?" },
                { icon: <Lock className="w-4 h-4" />, text: "Password Security", query: "What makes a strong password?" },
                { icon: <Wifi className="w-4 h-4" />, text: "Network Safety", query: "How do I secure my home network?" },
                { icon: <Database className="w-4 h-4" />, text: "Data Protection", query: "How do I protect my personal data?" }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMessage(action.query);
                    setTimeout(() => {
                      const event = new Event('submit');
                      document.querySelector('form')?.dispatchEvent(event);
                    }, 100);
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white"
                placeholder="Ask me anything about cybersecurity..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-6 py-4 rounded-lg font-semibold transition flex items-center gap-2 ${
                  isLoading 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={isLoading}
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ThreatAdvisor;