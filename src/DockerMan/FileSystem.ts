import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

export class FileSystem {
  public async writeFile(
    filePath: string,
    content: string | Buffer,
    encoding: string = "utf8"
  ): Promise<void> {
    const dir = path.dirname(filePath);
    await mkdirAsync(dir, { recursive: true });

    if (typeof content === "string") {
      await writeFileAsync(filePath, content, encoding);
    } else {
      await writeFileAsync(filePath, content);
    }
  }

  public async mkdir(dirPath: string, options: any = {}): Promise<void> {
    await mkdirAsync(dirPath, { recursive: true, ...options });
  }

  public async readFile(filePath: string, encoding: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, encoding, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  public existsSync(checkPath: string): boolean {
    return fs.existsSync(checkPath);
  }

  public unlinkSync(unlinkPath: string): void {
    fs.unlinkSync(unlinkPath);
  }

  public rmdirSync(rmdirPath: string, options?: any): void {
    fs.rmdirSync(rmdirPath, options);
  }

  public statSync(statPath: string): object {
    const stats = fs.statSync(statPath);
    return {
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      size: stats.size,
      mtime: stats.mtime,
    };
  }
}
