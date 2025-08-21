import { makeProject } from "@motion-canvas/core";
import combinedAudio from "./audio/combined.mp3"; // Single combined audio file
import scene1 from "./scenes/scene1";
import scene2 from "./scenes/scene2";
import scene3 from './scenes/scene3?scene';
export default makeProject({
    scenes: [scene1, scene2, scene3],
    audio: combinedAudio,
    experimentalFeatures: true
});
