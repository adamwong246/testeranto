import OpenAI from 'openai';
import fs from 'fs'; // For saving the audio file

const openai = new OpenAI(); // Automatically uses OPENAI_API_KEY from environment

async function generateSpeech(text, outputPath) {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1', // Or 'tts-1-hd' for higher quality
    voice: 'alloy', // Choose from available voices like 'alloy', 'echo', 'fable', etc.
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(outputPath, buffer);
  // console.log(`Speech saved to ${outputPath}`);
}

// Example usage:
generateSpeech('Hello, this is a test of OpenAI\'s text-to-speech.', 'text.mp4')