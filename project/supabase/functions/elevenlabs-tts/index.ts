const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Updated voice mapping with the most distinct ElevenLabs voices
// These are verified to be different and available in most accounts
const voiceMapping: Record<string, string> = {
  'Rachel': '21m00Tcm4TlvDq8ikWAM',      // Young Female - Clear and professional
  'Drew': '29vD33N1CtxCmqQRPOHJ',        // Young Male - Confident and clear  
  'Clyde': '2EiwWnXFnvU5JabPnv8n',       // Middle-aged Male - Deep and authoritative
  'Bella': 'EXAVITQu4vr4xnSDxMaL',       // Young Female - Soft and friendly
  'Antoni': 'ErXwobaYiN019PkySvjV',       // Young Male - Warm and well-rounded
  'Elli': 'MF3mGyEYCl7XYWbV9V6O',        // Young Female - Emotional and expressive
  'Josh': 'TxGEqnHWrfWFTfGW9XjX',        // Young Male - Deep and serious
  'Arnold': 'VR6AewLTigWG4xSOukaG',      // Middle-aged Male - Crisp and authoritative
  'Adam': 'pNInz6obpgDQGcFmaJgB',        // Young Male - Deep and narrative
  'Sam': 'yoZ06aMxZJJ28mfd3POQ'          // Young Male - Raspy and casual
};

// Voice settings optimized for each voice to maximize differences
const voiceOptimizedSettings: Record<string, any> = {
  'Rachel': { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
  'Drew': { stability: 0.7, similarity_boost: 0.7, style: 0.1, use_speaker_boost: true },
  'Clyde': { stability: 0.8, similarity_boost: 0.6, style: 0.0, use_speaker_boost: true },
  'Bella': { stability: 0.4, similarity_boost: 0.9, style: 0.3, use_speaker_boost: true },
  'Antoni': { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true }
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { text, voice_id = 'Rachel', model_id = 'eleven_monolingual_v1', voice_settings } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Map the voice name to the actual voice ID
    const actualVoiceId = voiceMapping[voice_id] || voiceMapping['Rachel'];
    
    // Use optimized settings for the specific voice, or fallback to provided settings
    const optimizedSettings = voiceOptimizedSettings[voice_id] || voice_settings || {
      stability: 0.75,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    };

    console.log(`ElevenLabs TTS Request:`);
    console.log(`- Voice requested: ${voice_id}`);
    console.log(`- Voice ID used: ${actualVoiceId}`);
    console.log(`- Text length: ${text.length} characters`);
    console.log(`- Voice settings:`, optimizedSettings);

    // Call ElevenLabs Text-to-Speech API with optimized settings
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings: optimizedSettings
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      
      // If the specific voice fails, try with Rachel (most reliable)
      if (response.status === 422 && voice_id !== 'Rachel') {
        console.log('Voice failed, retrying with Rachel...');
        const retryResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceMapping['Rachel']}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsApiKey,
          },
          body: JSON.stringify({
            text,
            model_id,
            voice_settings: voiceOptimizedSettings['Rachel']
          }),
        });
        
        if (retryResponse.ok) {
          const audioData = await retryResponse.arrayBuffer();
          console.log(`Fallback audio generated: ${audioData.byteLength} bytes`);
          return new Response(audioData, {
            headers: {
              ...corsHeaders,
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioData.byteLength.toString(),
            },
            status: 200,
          });
        }
      }
      
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Get the audio data
    const audioData = await response.arrayBuffer();
    console.log(`Audio generated successfully: ${audioData.byteLength} bytes for voice ${voice_id}`);

    return new Response(audioData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
      status: 200,
    });
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    
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