import fs from "fs";
import path from "path";

export async function getAllFilesRecursively(directoryPath): Promise<string[]> {
  let fileList: string[] = [];
  const files = await fs.readdirSync(directoryPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath: string = path.join(directoryPath, file.name);
    if (file.isDirectory()) {
      fileList = fileList.concat(await getAllFilesRecursively(fullPath));
    } else if (file.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}
