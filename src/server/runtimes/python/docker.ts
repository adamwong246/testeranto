import { IBuiltConfig, IRunTime } from "../../../Types";

export const pythonDockerFile = `FROM python:3.11-alpine
ARG CACHE_BUST=1
WORKDIR /workspace

# Install system dependencies needed for building Python packages
RUN apk add --no-cache \
    gcc \
    musl-dev \
    python3-dev \
    libffi-dev \
    openssl-dev \
    cargo \
    git \
    && rm -rf /var/cache/apk/*

# Copy requirements.txt from the example directory
# The build context is the project root, so example/requirements.txt should be available
# First, check if the file exists and print diagnostic info
RUN echo "Checking for requirements.txt..." && \
    find /workspace -name "requirements.txt" -type f 2>/dev/null | head -5 && \
    ls -la /workspace/example/ 2>/dev/null || echo "example directory not found"

COPY example/requirements.txt /tmp/requirements.txt

# Verify the file was copied successfully
RUN if [ ! -f /tmp/requirements.txt ]; then \
        echo "ERROR: requirements.txt not found at /tmp/requirements.txt" && \
        echo "Current directory:" && pwd && \
        echo "Files in /workspace:" && ls -la /workspace && \
        echo "Files in /workspace/example:" && ls -la /workspace/example 2>/dev/null || echo "example directory not found" && \
        exit 1; \
    else \
        echo "requirements.txt found, installing dependencies..." && \
        cat /tmp/requirements.txt; \
    fi

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Verify pylint is installed and available in PATH
RUN python -c "import pylint; print(f'pylint version: {pylint.__version__}')" && \
    echo "Pylint installation verified successfully" && \
    which pylint && \
    pylint --version

RUN echo "Python environment ready with pylint and all dependencies"
`;


export const pythonBDDCommand = (port) => {
  // Python tests might not need JSON argument
  return `cd /workspace && python -m pytest example/ -v`;
}

export const pythonDockerComposeFile = (config: IBuiltConfig) => {
  return {
    build: {
      context: process.cwd(),
      dockerfile: `testeranto/bundles/allTests/python/python.Dockerfile`,
      tags: [`bundles-python-build:latest`],
      args: {
        BUILD_TIMESTAMP: "${BUILD_TIMESTAMP:-${CURRENT_TIMESTAMP}}"
      },
    },
    volumes: [
      `${process.cwd()}:/workspace`,
      // "node_modules:/workspace/node_modules",
    ],
    image: `bundles-python-build:latest`,
    restart: "unless-stopped",
    environment: {
      BUNDLES_DIR: `/workspace/testeranto/bundles/allTests/python`,
      METAFILES_DIR: `/workspace/testeranto/metafiles/python`,
      ESBUILD_SERVE_PORT: "0",
      IN_DOCKER: "true",
    },
    extra_hosts: ["host.docker.internal:host-gateway"],
    command: [
      "sh",
      "-c",
      `echo 'Python service starting...';
       # Verify pylint is available
       python -c "import pylint; print(f'pylint {pylint.__version__} is available')" || {
         echo "ERROR: pylint not available";
         exit 1;
       };
       mkdir -p /workspace/testeranto/metafiles/python;
       echo "Checking if allTests.json exists at /workspace/testeranto/allTests.json:";
       if [ -f /workspace/testeranto/allTests.json ]; then
         echo "Config file found";
       else
         echo "Config file NOT found";
         ls -la /workspace/testeranto/ || true;
       fi
       # Run the pitono.py script with the allTests.json config
       cd /workspace && python src/server/runtimes/python/pitono.py /workspace/testeranto/allTests.json;
       echo "Checking if metafile was generated:";
       ls -la /workspace/testeranto/metafiles/python/ || echo "Python metafiles directory not found";
       echo "Checking if bundles were generated:";
       ls -la /workspace/testeranto/bundles/allTests/python/ || echo "Python bundles directory not found";
       echo "Checking for generated text files:";
       find /workspace/testeranto/bundles/allTests/python/ -name "*.txt" -type f | head -10;
       echo 'Python bundle generation completed';`,
    ],
    healthcheck: {
      test: ["CMD-SHELL", "python -c \"import pylint; import sys; sys.exit(0)\" || exit 1"],
      interval: "10s",
      timeout: "30s",
      retries: 10,
      start_period: "60s",
    },
  };
};
