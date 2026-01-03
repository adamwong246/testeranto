import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import baseCompose from "./baseCompose";

export async function writeComposeFile(
  services: Record<string, any>,
  testsName: string,
  composeDir: string,
  error: (...args: any[]) => void
) {
  const composeFilePath = path.join(
    composeDir,
    `${testsName}-docker-compose.yml`
  );

  try {
    fs.writeFileSync(
      composeFilePath,
      yaml.dump(baseCompose(services), {
        lineWidth: -1,
        noRefs: true,
      })
    );
  } catch (err) {
    error(`Error writing compose file:`, err);
    throw err;
  }
}
