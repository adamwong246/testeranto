const fs = await import('fs/promises');
const yaml = await import('yaml');
import path from "path";
import { Server } from "./server/serverClasees/Server";
import { IConfig, IRunTime } from "./Types";

const mode = process.argv[3] as "once" | "dev";
if (mode !== "once" && mode !== "dev") {
  console.error(`The 3rd argument should be 'dev' or 'once', not '${mode}'.`);
  process.exit(-1);
}

const main = async () => {
  const yamlPath = path.join(process.cwd(), 'testeranto/testeranto.yml');
  const yamlContent = await fs.readFile(yamlPath, 'utf-8');
  const parsed = yaml.parse(yamlContent);

  const config: IConfig = new Map();
  for (const [key, value] of Object.entries(parsed)) {
    if (Array.isArray(value) && value.length >= 4) {
      // The first three elements are runtime, dockerfile, script
      const runtime = String(value[0]) as IRunTime;
      const dockerfile = String(value[1]);
      const script = String(value[2]);
      
      // The fourth element should be an object with tests
      let testsObj = { tests: [] as string[] };
      const fourth = value[3];
      if (fourth && typeof fourth === 'object' && fourth !== null) {
        const testsData = fourth as any;
        if (testsData.tests && Array.isArray(testsData.tests)) {
          testsObj.tests = testsData.tests.map((t: any) => String(t));
        }
      }
      
      config.set(key, [runtime, dockerfile, script, testsObj]);
    } else {
      console.warn(`Skipping entry ${key}: expected array with at least 4 elements, got`, value);
    }
  }

  console.log('Parsed config:', Array.from(config.entries()));
  await new Server(config, mode).start();
}

main()
