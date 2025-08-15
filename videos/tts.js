import fs from 'fs';
import path from 'path';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

// AWS Polly configuration with credential fallbacks
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    sessionToken: process.env.AWS_SESSION_TOKEN || undefined
  }
});

// Verify AWS credentials are configured
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('AWS credentials not found. Please set:');
  console.error('AWS_ACCESS_KEY_ID');
  console.error('AWS_SECRET_ACCESS_KEY');
  console.error('Optionally set AWS_REGION and AWS_SESSION_TOKEN');
  console.error('WTF');
  console.error(JSON.stringify(process.env));
  process.exit(1);
}

const VOICE_ID = 'Joanna'; // AWS Polly voice
const OUTPUT_FORMAT = 'mp3';
const ENGINE = 'neural'; // Use neural engine for best quality

// Get paths from command line
const SSML_FILE = process.argv[2];
const AUDIO_DIR = process.argv[3];


// HOLY SHIT DEEPSEEK I HAVE ASKED YOU 10 MILLION TIMES NOT TO DO CUSTOM VALIDATION.
// IF YOU DO IT AGAIN, I AM SWITCHING TO CHATGPT
async function processSsml(ssmlPath) {
  const ssmlContent = fs.readFileSync(ssmlPath, 'utf-8');
  return {
    ssml: ssmlContent,
    audioFile: 'narration.mp3'
  };
}

// Create output directory if needed
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Generate audio from SMIL/SSML
async function generateNarrationAudio() {
  try {
    console.log(`Processing SMIL file: ${SSML_FILE}`);
    const { ssml, audioFile } = await processSsml(SSML_FILE);
    console.log('Extracted SSML content:\n', ssml);
    const audioPath = path.join(AUDIO_DIR, audioFile);


    console.log('Generating high-quality audio from SSML using AWS Polly...');

    const params = {
      OutputFormat: OUTPUT_FORMAT,
      Text: ssml,
      TextType: 'ssml',
      VoiceId: VOICE_ID,
      Engine: ENGINE
    };

    const command = new SynthesizeSpeechCommand(params);
    const response = await pollyClient.send(command);

    // Convert the audio stream to a buffer
    const buffer = await new Promise((resolve, reject) => {
      const chunks = [];
      response.AudioStream.on('data', (chunk) => chunks.push(chunk));
      response.AudioStream.on('end', () => resolve(Buffer.concat(chunks)));
      response.AudioStream.on('error', reject);
    });
    await fs.promises.writeFile(audioPath, buffer);

    const duration = await getAudioDurationInSeconds(audioPath);

    // Write metadata
    const metadata = {
      duration: duration,
      file: './narration.mp3',
      generatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(AUDIO_DIR, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log(`Successfully generated:
      Audio: ${audioPath}
      Duration: ${duration.toFixed(2)}s
      Metadata: ${AUDIO_DIR}/metadata.json`);

    return { audioPath, duration };
  } catch (error) {
    console.error('Failed to generate narration:', error);
    process.exit(1);
  }
}

// Run the generation
generateNarrationAudio();
