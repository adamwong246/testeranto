import fs from "fs";
import { message, promptContent } from "./promptTemplates";

export const generatePromptFiles = (reportDest: string, src: string) => {
  try {
    if (!fs.existsSync(reportDest)) {
      fs.mkdirSync(reportDest, { recursive: true });
    }
    const messagePath = `${reportDest}/message.txt`;
    const messageContent = message();
    fs.writeFileSync(messagePath, messageContent);
    const promptPath = `${reportDest}/prompt.txt`;
    fs.writeFileSync(promptPath, promptContent(reportDest));
  } catch (error) {
    console.error(`Failed to generate prompt files for ${src}:`, error);
  }
};
