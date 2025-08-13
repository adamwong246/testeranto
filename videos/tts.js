import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI();
const VOICE = 'alloy'; // Consistent voice across all samples
const OUTPUT_DIR = './src/revideo/audio';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Scene scripts mapped to filenames
const SCENE_SCRIPTS = {
  'problem': "AI has changed the game forever. It's never been easier to generate code, but it's also never been harder to know if your code is as robust as ChatGpt would lead you to believe. Sure, you can scaffold out a react app from scratch with 1 prompt... but can you vibe your way around a real-world codebase?",
  'solution': "Introducing Testeranto - the AI-powered BDD testing framework for typescript projects.",
  'context': "Precision context optimization - only what's needed for each fix",
  'runtimes': "Write once, test anywhere - Node, Browser, and Pure JavaScript",
  'type-safety': "Type-safe across all runtimes with built-in validation",
  'cta': "Get started today with npm install testeranto at beta"
};

async function generateSceneAudio(sceneName, text) {
  const outputPath = path.join(OUTPUT_DIR, `${sceneName}.mp3`);

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd', // Higher quality for video
      voice: VOICE,
      input: text,
      speed: 1.0, // Normal speed,
      response_format: "mp3"
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(outputPath, buffer);
    console.log(`Generated audio for ${sceneName}: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`Error generating audio for ${sceneName}:`, error);
    throw error;
  }
}

import { getAudioDurationInSeconds } from 'get-audio-duration';

async function generateAllAudio() {
  const results = {};

  for (const [sceneName, text] of Object.entries(SCENE_SCRIPTS)) {
    const audioPath = await generateSceneAudio(sceneName, text);
    const duration = await getAudioDurationInSeconds(audioPath);
    results[sceneName] = {
      path: audioPath,
      duration: duration
    };
  }

  // Write durations to a JSON file for the video project
  const durations = {};
  Object.entries(results).forEach(([scene, data]) => {
    durations[scene] = data.duration;
  });
  await fs.promises.writeFile(
    path.join(OUTPUT_DIR, 'durations.ts'),
    `export default ${JSON.stringify(durations, null, 2)};`
  );

  return results;
}

// Generate all audio files when script runs
generateAllAudio().then(() => {
  console.log('All audio files generated successfully');
}).catch(console.error);
