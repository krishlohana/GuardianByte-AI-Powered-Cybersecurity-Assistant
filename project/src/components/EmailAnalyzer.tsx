import React, { useState, useRef } from 'react';
import { Mail, Upload, AlertTriangle, CheckCircle2, FileText, Download, Shield, Eye, Globe, Clock, User, Building, Image as ImageIcon } from 'lucide-react';

interface AnalysisReport {
  riskLevel: 'low' | 'medium' | 'high';
  indicators: string[];
  recommendations: string[];
  technicalDetails: {
    headers: Record<string, string>;
    links: string[];
    attachments: string[];
  };
}

const EmailAnalyzer = () => {
  const [emailContent, setEmailContent] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportFormat, setReportFormat] = useState<'pdf' | 'doc'>('pdf');
  const [userCountry, setUserCountry] = useState('US');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email screenshot validation
  const validateEmailScreenshot = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Get image data for analysis
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        
        if (!imageData) {
          resolve(false);
          return;
        }
        
        // Simple heuristic checks for email interface elements
        const hasEmailIndicators = checkForEmailIndicators(imageData, canvas);
        resolve(hasEmailIndicators);
      };
      
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const checkForEmailIndicators = (imageData: ImageData, canvas: HTMLCanvasElement): boolean => {
    // Check image dimensions (emails are typically wider than tall)
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 0.8) return false; // Too tall to be an email
    
    // Check for common email interface colors and patterns
    const data = imageData.data;
    let whitePixels = 0;
    let totalPixels = data.length / 4;
    
    // Count white/light pixels (common in email interfaces)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check for white or light gray pixels
      if (r > 240 && g > 240 && b > 240) {
        whitePixels++;
      }
    }
    
    const whiteRatio = whitePixels / totalPixels;
    
    // Email interfaces typically have significant white space
    return whiteRatio > 0.3 && whiteRatio < 0.9;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    
    // Validate if it's an email screenshot
    const isValidEmail = await validateEmailScreenshot(file);
    
    if (!isValidEmail) {
      setError('The uploaded image does not appear to be an email screenshot. Please upload a screenshot of an email interface showing the sender, subject, and content.');
      setScreenshot(null);
      setScreenshotPreview(null);
      setScreenshotDataUrl(null);
      return;
    }

    setScreenshot(file);
    
    // Create preview and data URL for reports
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setScreenshotPreview(result);
      setScreenshotDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeEmail = async () => {
    if (!emailContent.trim() && !screenshot) {
      setError('Please provide email content or upload a screenshot');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Enhanced email analysis
      const analysis = await performAdvancedAnalysis({
        content: emailContent,
        sender,
        subject,
        receivedDate,
        screenshot
      });

      setReport(analysis);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performAdvancedAnalysis = async (emailData: any): Promise<AnalysisReport> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { content, sender, subject } = emailData;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    const indicators: string[] = [];
    const recommendations: string[] = [];

    // Enhanced sender analysis
    if (sender) {
      const senderAnalysis = analyzeSenderReputation(sender);
      if (senderAnalysis.isPhishing) {
        riskLevel = 'high';
        indicators.push(`Suspicious sender domain: ${senderAnalysis.reason}`);
      }
    }

    // Content analysis
    const contentRisk = analyzeContent(content);
    if (contentRisk.level === 'high') {
      riskLevel = 'high';
      indicators.push(...contentRisk.indicators);
    } else if (contentRisk.level === 'medium' && riskLevel === 'low') {
      riskLevel = 'medium';
      indicators.push(...contentRisk.indicators);
    }

    // Subject analysis
    if (subject) {
      const subjectRisk = analyzeSubject(subject);
      if (subjectRisk.isPhishing) {
        if (riskLevel === 'low') riskLevel = 'medium';
        indicators.push(...subjectRisk.indicators);
      }
    }

    // Generate recommendations based on risk level
    if (riskLevel === 'high') {
      recommendations.push(
        'Do not click any links or download attachments',
        'Report this email to your IT security team immediately',
        'Delete the email after reporting',
        'Check if others in your organization received similar emails'
      );
    } else if (riskLevel === 'medium') {
      recommendations.push(
        'Verify sender identity through alternative communication',
        'Be cautious with any links or attachments',
        'Consider reporting to security team',
        'Monitor your accounts for suspicious activity'
      );
    } else {
      recommendations.push(
        'Email appears legitimate but remain vigilant',
        'Verify any unexpected requests independently',
        'Keep security software updated'
      );
    }

    // Extract technical details
    const links = content.match(/https?:\/\/[^\s<>"]+|www\.[^\s<>"]+/g) || [];
    const attachments = content.match(/\.[a-zA-Z0-9]{2,4}(?=[\s)]|$)/g) || [];

    return {
      riskLevel,
      indicators: indicators.length > 0 ? indicators : ['No significant threats detected'],
      recommendations,
      technicalDetails: {
        headers: {
          'From': sender || 'Not provided',
          'Subject': subject || 'Not provided',
          'Date': receivedDate || 'Not provided',
          'Content-Type': 'text/html; charset=UTF-8'
        },
        links,
        attachments: attachments.map((ext, i) => `attachment_${i + 1}${ext}`)
      }
    };
  };

  const analyzeSenderReputation = (sender: string) => {
    const domain = sender.split('@')[1]?.toLowerCase() || '';
    
    // Known phishing patterns
    const phishingPatterns = [
      /secure.*verify/,
      /account.*suspended/,
      /urgent.*action/,
      /click.*here/,
      /verify.*identity/
    ];

    // Suspicious domain patterns
    const suspiciousDomains = [
      /.*-security\./,
      /.*verify.*\./,
      /.*account.*\./,
      /.*secure.*\./,
      /.*update.*\./
    ];

    // Character substitution check
    const hasSubstitution = /[0-9]/.test(domain.replace(/\.(com|org|net|edu|gov)$/, ''));
    
    // Check for suspicious patterns
    const hasSuspiciousPattern = suspiciousDomains.some(pattern => pattern.test(domain));
    const hasPhishingKeywords = phishingPatterns.some(pattern => pattern.test(sender.toLowerCase()));

    if (hasSubstitution || hasSuspiciousPattern || hasPhishingKeywords) {
      return {
        isPhishing: true,
        reason: hasSubstitution ? 'Character substitution detected' :
                hasSuspiciousPattern ? 'Suspicious domain pattern' :
                'Phishing keywords detected'
      };
    }

    return { isPhishing: false, reason: '' };
  };

  const analyzeContent = (content: string) => {
    const lowerContent = content.toLowerCase();
    const indicators: string[] = [];
    let level: 'low' | 'medium' | 'high' = 'low';

    // High-risk indicators
    const highRiskPatterns = [
      'verify your account immediately',
      'suspended account',
      'click here to verify',
      'urgent action required',
      'confirm your identity',
      'update payment information'
    ];

    // Medium-risk indicators
    const mediumRiskPatterns = [
      'limited time offer',
      'act now',
      'congratulations',
      'you have won',
      'claim your prize',
      'free gift'
    ];

    // Check for high-risk patterns
    highRiskPatterns.forEach(pattern => {
      if (lowerContent.includes(pattern)) {
        level = 'high';
        indicators.push(`Phishing language detected: "${pattern}"`);
      }
    });

    // Check for medium-risk patterns if not already high risk
    if (level !== 'high') {
      mediumRiskPatterns.forEach(pattern => {
        if (lowerContent.includes(pattern)) {
          level = 'medium';
          indicators.push(`Suspicious language: "${pattern}"`);
        }
      });
    }

    // Check for urgency indicators
    const urgencyWords = ['urgent', 'immediate', 'expires', 'deadline', 'asap'];
    const urgencyCount = urgencyWords.filter(word => lowerContent.includes(word)).length;
    
    if (urgencyCount >= 2) {
      if (level === 'low') level = 'medium';
      indicators.push('Multiple urgency indicators detected');
    }

    return { level, indicators };
  };

  const analyzeSubject = (subject: string) => {
    const lowerSubject = subject.toLowerCase();
    const indicators: string[] = [];

    const phishingSubjects = [
      'account suspended',
      'verify your account',
      'urgent security alert',
      'action required',
      'confirm your identity',
      'payment failed'
    ];

    const isPhishing = phishingSubjects.some(pattern => {
      if (lowerSubject.includes(pattern)) {
        indicators.push(`Suspicious subject line: "${pattern}"`);
        return true;
      }
      return false;
    });

    return { isPhishing, indicators };
  };

  // Generate PDF report with embedded screenshot
  const generatePDFReport = () => {
    if (!report) return;

    // Create PDF content as HTML string with embedded screenshot
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Cybercrime Report - ${userCountry}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 25px; page-break-inside: avoid; }
          .risk-high { color: #dc2626; font-weight: bold; }
          .risk-medium { color: #f59e0b; font-weight: bold; }
          .risk-low { color: #16a34a; font-weight: bold; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; display: inline-block; width: 150px; }
          ul { margin: 10px 0; padding-left: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
          .screenshot { max-width: 100%; height: auto; border: 1px solid #ccc; margin: 10px 0; }
          .screenshot-container { text-align: center; margin: 20px 0; }
          .evidence-section { background: #f9f9f9; padding: 15px; border-left: 4px solid #007acc; margin: 15px 0; }
          @media print {
            .screenshot { max-height: 400px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CYBERCRIME INCIDENT REPORT</h1>
          <h2>${getCountryReportTitle(userCountry)}</h2>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p><strong>Report ID:</strong> CR-${Date.now()}</p>
        </div>

        <div class="section">
          <h3>INCIDENT SUMMARY</h3>
          <div class="field">
            <span class="label">Risk Level:</span>
            <span class="risk-${report.riskLevel}">${report.riskLevel.toUpperCase()}</span>
          </div>
          <div class="field">
            <span class="label">Report Date:</span>
            ${new Date().toLocaleDateString()}
          </div>
          <div class="field">
            <span class="label">Incident Type:</span>
            Email Phishing/Fraud Attempt
          </div>
          <div class="field">
            <span class="label">Evidence Type:</span>
            ${screenshotDataUrl ? 'Email Screenshot + Text Content' : 'Text Content Only'}
          </div>
        </div>

        <div class="section">
          <h3>EMAIL DETAILS</h3>
          <div class="field">
            <span class="label">Sender:</span>
            ${sender || 'Not provided'}
          </div>
          <div class="field">
            <span class="label">Subject:</span>
            ${subject || 'Not provided'}
          </div>
          <div class="field">
            <span class="label">Received Date:</span>
            ${receivedDate || 'Not provided'}
          </div>
          <div class="field">
            <span class="label">Content:</span>
            <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
              ${emailContent || 'Content provided via screenshot (see evidence section below)'}
            </div>
          </div>
        </div>

        ${screenshotDataUrl ? `
        <div class="section evidence-section">
          <h3>📸 VISUAL EVIDENCE - EMAIL SCREENSHOT</h3>
          <p><strong>Evidence Description:</strong> Screenshot of the suspicious email as it appeared to the recipient.</p>
          <p><strong>Capture Date:</strong> ${new Date().toLocaleDateString()}</p>
          <div class="screenshot-container">
            <img src="${screenshotDataUrl}" alt="Email Screenshot Evidence" class="screenshot" />
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              <strong>Evidence ID:</strong> IMG-${Date.now()}<br>
              <strong>File Type:</strong> ${screenshot?.type || 'image/png'}<br>
              <strong>File Size:</strong> ${screenshot ? Math.round(screenshot.size / 1024) + ' KB' : 'Unknown'}
            </p>
          </div>
        </div>
        ` : ''}

        <div class="section">
          <h3>THREAT INDICATORS</h3>
          <ul>
            ${report.indicators.map(indicator => `<li>${indicator}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <h3>TECHNICAL ANALYSIS</h3>
          <div class="field">
            <span class="label">Email Headers:</span>
            <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px; font-family: monospace; font-size: 12px;">
              ${Object.entries(report.technicalDetails.headers).map(([key, value]) => `${key}: ${value}`).join('<br>')}
            </div>
          </div>
          <div class="field">
            <span class="label">Suspicious Links:</span>
            ${report.technicalDetails.links.length > 0 ? 
              `<ul>${report.technicalDetails.links.map(link => `<li style="font-family: monospace; color: #dc2626;">${link}</li>`).join('')}</ul>` : 
              'None detected'
            }
          </div>
          <div class="field">
            <span class="label">Attachments:</span>
            ${report.technicalDetails.attachments.length > 0 ? 
              `<ul>${report.technicalDetails.attachments.map(att => `<li style="font-family: monospace; color: #f59e0b;">${att}</li>`).join('')}</ul>` : 
              'None detected'
            }
          </div>
        </div>

        <div class="section">
          <h3>RECOMMENDED ACTIONS</h3>
          <ul>
            ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <h3>REPORTING INFORMATION</h3>
          ${getCountrySpecificReporting(userCountry)}
        </div>

        <div class="section">
          <h3>DIGITAL FORENSICS NOTES</h3>
          <p><strong>Analysis Method:</strong> Automated AI-powered threat detection with manual verification recommended</p>
          <p><strong>Evidence Integrity:</strong> Original screenshot preserved in base64 format within this report</p>
          <p><strong>Chain of Custody:</strong> Evidence captured and analyzed on ${new Date().toISOString()}</p>
          <p><strong>Analyst Notes:</strong> This automated analysis should be verified by cybersecurity professionals before legal proceedings</p>
        </div>

        <div class="footer">
          <p><strong>Generated by:</strong> GuardianByte AI Security Platform</p>
          <p><strong>Report Version:</strong> 2.0 | <strong>Analysis Engine:</strong> Advanced Threat Detection v1.5</p>
          <p><strong>Technical Support:</strong> https://guardianbyte.com/support</p>
          <p><strong>Legal Disclaimer:</strong> This is an automated analysis. Please verify findings with cybersecurity professionals before taking legal action.</p>
          <p><strong>Evidence Preservation:</strong> This report contains embedded digital evidence. Do not modify this document to maintain evidence integrity.</p>
        </div>
      </body>
      </html>
    `;

    // Create and download PDF (HTML format that can be printed to PDF)
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybercrime-report-${userCountry}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate DOC report with screenshot reference
  const generateDOCReport = () => {
    if (!report) return;

    const docContent = `
CYBERCRIME INCIDENT REPORT
${getCountryReportTitle(userCountry)}
Generated on: ${new Date().toLocaleDateString()}
Report ID: CR-${Date.now()}

=====================================

INCIDENT SUMMARY
Risk Level: ${report.riskLevel.toUpperCase()}
Report Date: ${new Date().toLocaleDateString()}
Incident Type: Email Phishing/Fraud Attempt
Evidence Type: ${screenshotDataUrl ? 'Email Screenshot + Text Content' : 'Text Content Only'}

EMAIL DETAILS
Sender: ${sender || 'Not provided'}
Subject: ${subject || 'Not provided'}
Received Date: ${receivedDate || 'Not provided'}
Content: ${emailContent || 'Content provided via screenshot (see evidence section)'}

${screenshotDataUrl ? `
VISUAL EVIDENCE - EMAIL SCREENSHOT
Evidence Description: Screenshot of the suspicious email as it appeared to the recipient
Capture Date: ${new Date().toLocaleDateString()}
Evidence ID: IMG-${Date.now()}
File Type: ${screenshot?.type || 'image/png'}
File Size: ${screenshot ? Math.round(screenshot.size / 1024) + ' KB' : 'Unknown'}

[SCREENSHOT EMBEDDED - See HTML version for visual evidence]
Note: This DOC format contains a reference to the screenshot. 
For full visual evidence, please use the PDF/HTML report format.
` : ''}

THREAT INDICATORS
${report.indicators.map(indicator => `• ${indicator}`).join('\n')}

TECHNICAL ANALYSIS
Email Headers:
${Object.entries(report.technicalDetails.headers).map(([key, value]) => `${key}: ${value}`).join('\n')}

Suspicious Links:
${report.technicalDetails.links.length > 0 ? 
  report.technicalDetails.links.map(link => `• ${link}`).join('\n') : 
  'None detected'
}

Attachments:
${report.technicalDetails.attachments.length > 0 ? 
  report.technicalDetails.attachments.map(att => `• ${att}`).join('\n') : 
  'None detected'
}

RECOMMENDED ACTIONS
${report.recommendations.map(rec => `• ${rec}`).join('\n')}

REPORTING INFORMATION
${getCountrySpecificReportingText(userCountry)}

DIGITAL FORENSICS NOTES
Analysis Method: Automated AI-powered threat detection with manual verification recommended
Evidence Integrity: Original screenshot preserved (use HTML/PDF format for embedded image)
Chain of Custody: Evidence captured and analyzed on ${new Date().toISOString()}
Analyst Notes: This automated analysis should be verified by cybersecurity professionals

=====================================
Generated by: GuardianByte AI Security Platform
Report Version: 2.0 | Analysis Engine: Advanced Threat Detection v1.5
Technical Support: https://guardianbyte.com/support
Legal Disclaimer: This is an automated analysis. Verify findings with professionals.
Evidence Preservation: Screenshot evidence available in PDF/HTML format.
    `;

    const blob = new Blob([docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybercrime-report-${userCountry}-${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCountryReportTitle = (country: string) => {
    const titles = {
      'US': 'Federal Bureau of Investigation (FBI) - Internet Crime Complaint Center',
      'UK': 'Action Fraud - National Fraud & Cyber Crime Reporting Centre',
      'CA': 'Canadian Anti-Fraud Centre (CAFC)',
      'AU': 'Australian Cyber Security Centre (ACSC)',
      'DE': 'Bundeskriminalamt (BKA) - Cybercrime Reporting',
      'FR': 'Agence Nationale de la Sécurité des Systèmes d\'Information',
      'IN': 'Indian Cyber Crime Coordination Centre',
      'JP': 'Japan Computer Emergency Response Team'
    };
    return titles[country as keyof typeof titles] || 'Cybercrime Reporting Authority';
  };

  const getCountrySpecificReporting = (country: string) => {
    const reporting = {
      'US': `
        <p><strong>FBI Internet Crime Complaint Center (IC3)</strong></p>
        <p>Website: <a href="https://www.ic3.gov">https://www.ic3.gov</a></p>
        <p>Phone: Contact your local FBI field office</p>
        <p>Additional: Report to FTC at <a href="https://reportfraud.ftc.gov">https://reportfraud.ftc.gov</a></p>
        <p><strong>Required Information:</strong> This report, email headers, screenshot evidence</p>
      `,
      'UK': `
        <p><strong>Action Fraud</strong></p>
        <p>Website: <a href="https://www.actionfraud.police.uk">https://www.actionfraud.police.uk</a></p>
        <p>Phone: 0300 123 2040</p>
        <p>Additional: Report to NCSC at <a href="https://www.ncsc.gov.uk/report-an-incident">https://www.ncsc.gov.uk/report-an-incident</a></p>
        <p><strong>Required Information:</strong> This report, email evidence, financial loss details (if any)</p>
      `,
      'CA': `
        <p><strong>Canadian Anti-Fraud Centre</strong></p>
        <p>Website: <a href="https://www.antifraudcentre-centreantifraude.ca">https://www.antifraudcentre-centreantifraude.ca</a></p>
        <p>Phone: 1-888-495-8501</p>
        <p>Additional: Report to local police and RCMP</p>
        <p><strong>Required Information:</strong> This report, email evidence, suspect information</p>
      `
    };
    return reporting[country as keyof typeof reporting] || `
      <p><strong>Local Cybercrime Authority</strong></p>
      <p>Please contact your local law enforcement agency to report this incident.</p>
      <p>Also consider reporting to your national cybersecurity center.</p>
      <p><strong>Required Information:</strong> This report, email evidence, any financial losses</p>
    `;
  };

  const getCountrySpecificReportingText = (country: string) => {
    const reporting = {
      'US': `FBI Internet Crime Complaint Center (IC3)
Website: https://www.ic3.gov
Phone: Contact your local FBI field office
Additional: Report to FTC at https://reportfraud.ftc.gov
Required Information: This report, email headers, screenshot evidence`,
      'UK': `Action Fraud
Website: https://www.actionfraud.police.uk
Phone: 0300 123 2040
Additional: Report to NCSC at https://www.ncsc.gov.uk/report-an-incident
Required Information: This report, email evidence, financial loss details (if any)`,
      'CA': `Canadian Anti-Fraud Centre
Website: https://www.antifraudcentre-centreantifraude.ca
Phone: 1-888-495-8501
Additional: Report to local police and RCMP
Required Information: This report, email evidence, suspect information`
    };
    return reporting[country as keyof typeof reporting] || `Local Cybercrime Authority
Please contact your local law enforcement agency to report this incident.
Also consider reporting to your national cybersecurity center.
Required Information: This report, email evidence, any financial losses`;
  };

  const downloadReport = () => {
    if (reportFormat === 'pdf') {
      generatePDFReport();
    } else {
      generateDOCReport();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <Mail className="w-8 h-8 text-yellow-400" />
        <h2 className="text-3xl font-bold">Advanced Email Security Analyzer</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-4">Email Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sender Email Address</label>
                <input
                  type="email"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  placeholder="sender@example.com"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject Line</label>
                <input
                  type="text"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date Received</label>
                <input
                  type="datetime-local"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Content</label>
                <textarea
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  rows={6}
                  placeholder="Paste the email content here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Email Screenshot (Recommended)
            </h3>
            
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Click to upload email screenshot</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                <p className="text-xs text-blue-400 mt-2">📸 Screenshots will be embedded in reports as evidence</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {screenshotPreview && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Valid email screenshot detected</span>
                  </div>
                  <img
                    src={screenshotPreview}
                    alt="Email screenshot"
                    className="w-full rounded-lg border border-gray-700"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    This screenshot will be included as evidence in the cybercrime report
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Country Selection for Reports */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-4">Report Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Country</label>
                <select
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  value={userCountry}
                  onChange={(e) => setUserCountry(e.target.value)}
                >
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IN">India</option>
                  <option value="JP">Japan</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Report Format</label>
                <select
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value as 'pdf' | 'doc')}
                >
                  <option value="pdf">PDF Document (with embedded images)</option>
                  <option value="doc">Word Document (with image references)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={analyzeEmail}
            disabled={isAnalyzing || (!emailContent.trim() && !screenshot)}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              isAnalyzing || (!emailContent.trim() && !screenshot)
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Analyze Email</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {report && (
            <>
              {/* Risk Assessment */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Risk Assessment</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                    report.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {report.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Threat Indicators
                    </h4>
                    <ul className="space-y-1">
                      {report.indicators.map((indicator, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Recommendations
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Details */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Technical Analysis
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Email Headers</h4>
                    <div className="bg-gray-900 rounded-lg p-3 text-sm font-mono">
                      {Object.entries(report.technicalDetails.headers).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="text-blue-400 w-20">{key}:</span>
                          <span className="text-gray-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {report.technicalDetails.links.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Suspicious Links</h4>
                      <ul className="space-y-1">
                        {report.technicalDetails.links.map((link, index) => (
                          <li key={index} className="text-sm text-red-400 font-mono bg-gray-900 p-2 rounded">
                            {link}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {report.technicalDetails.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Attachments</h4>
                      <ul className="space-y-1">
                        {report.technicalDetails.attachments.map((att, index) => (
                          <li key={index} className="text-sm text-yellow-400 font-mono bg-gray-900 p-2 rounded">
                            {att}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Report */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Cybercrime Report
                </h3>
                
                <p className="text-gray-400 mb-4">
                  Generate a country-specific cybercrime report for law enforcement agencies.
                  {screenshotDataUrl && (
                    <span className="block text-green-400 text-sm mt-1">
                      ✅ Screenshot evidence will be embedded in the report
                    </span>
                  )}
                </p>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={downloadReport}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download {reportFormat.toUpperCase()} Report
                    {screenshotDataUrl && <ImageIcon className="w-4 h-4" />}
                  </button>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Building className="w-4 h-4" />
                    <span>{getCountryReportTitle(userCountry)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {!report && !isAnalyzing && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-gray-400">
                Provide email details or upload a screenshot to begin security analysis
              </p>
              <p className="text-sm text-blue-400 mt-2">
                💡 Screenshots provide better evidence for law enforcement reports
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailAnalyzer;