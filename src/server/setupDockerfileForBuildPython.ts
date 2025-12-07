import { BASE_DOCKERFILE } from "./BASE_DOCKERFILE";
import { COMMON_PACKAGE_INSTALL } from "./COMMON_PACKAGE_INSTALL";

export const setupDockerfileForBuildPython = (config: string): string => {
  return `${BASE_DOCKERFILE}
# Ensure Python is properly installed and available
RUN python3 --version && pip3 --version
${COMMON_PACKAGE_INSTALL}
COPY ${config} .
COPY dist/prebuild/builders/python.mjs ./python.mjs
# Run the build to generate metafiles when container starts
CMD ["sh", "-c", "echo 'Starting build...' && ls -la ./dist/prebuild/builders/ && which node && which npx && npx tsx ./dist/prebuild/builders/python.mjs ${config}"]
`;
};
