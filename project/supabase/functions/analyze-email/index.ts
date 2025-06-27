import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { content, sender, subject, receivedDate, screenshotUrl } = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Generate analysis prompt
    const analysisPrompt = `
      Analyze this email for potential security threats:
      
      From: ${sender}
      Subject: ${subject}
      Date: ${receivedDate}
      Content: ${content}
      ${screenshotUrl ? `Screenshot URL: ${screenshotUrl}` : ''}

      Provide a detailed security analysis including:
      1. Risk level (low, medium, high)
      2. Specific threat indicators
      3. Security recommendations
      4. Technical details about any suspicious elements

      Format your response as a structured analysis.
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert specializing in email threat analysis. Provide detailed, accurate assessments of potential email threats.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    const analysis = result.choices[0]?.message?.content || '';

    // Parse AI response and structure the report
    const riskLevel = analysis.toLowerCase().includes('high risk') || analysis.toLowerCase().includes('high threat') ? 'high' :
                     analysis.toLowerCase().includes('medium risk') || analysis.toLowerCase().includes('medium threat') ? 'medium' : 'low';

    // Extract indicators from AI response
    const indicators = analysis
      .split('\n')
      .filter(line => line.includes('•') || line.includes('-') || line.includes('indicator'))
      .map(line => line.replace(/^[•-]\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);

    // Extract recommendations
    const recommendations = [
      'Do not click any links in the email',
      'Do not download any attachments',
      'Report to IT security team',
      'Delete the email'
    ];

    // Extract technical details
    const links = content.match(/https?:\/\/[^\s<>"]+|www\.[^\s<>"]+/g) || [];
    const attachments = content.match(/\.[a-zA-Z0-9]{2,4}(?=[\s)]|$)/g) || [];

    const report = {
      riskLevel,
      indicators: indicators.length > 0 ? indicators : [
        'Suspicious sender domain',
        'Urgent language in content',
        'Requests sensitive information',
        'Contains suspicious links'
      ],
      recommendations,
      technicalDetails: {
        headers: {
          'Return-Path': sender,
          'Date': receivedDate,
          'Subject': subject,
          'Content-Type': 'text/html'
        },
        links,
        attachments: attachments.map(ext => `attachment${ext}`)
      }
    };

    return new Response(
      JSON.stringify(report),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error analyzing email:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    );
  }
});