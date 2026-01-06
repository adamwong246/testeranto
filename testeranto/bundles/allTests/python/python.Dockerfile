FROM python:3.11-alpine
ARG CACHE_BUST=1
WORKDIR /workspace

# Install system dependencies needed for building Python packages
RUN apk add --no-cache     gcc     musl-dev     python3-dev     libffi-dev     openssl-dev     cargo     git     && rm -rf /var/cache/apk/*

# Copy requirements.txt from the example directory
# The build context is the project root, so example/requirements.txt should be available
# First, check if the file exists and print diagnostic info
RUN echo "Checking for requirements.txt..." &&     find /workspace -name "requirements.txt" -type f 2>/dev/null | head -5 &&     ls -la /workspace/example/ 2>/dev/null || echo "example directory not found"

COPY example/requirements.txt /tmp/requirements.txt

# Verify the file was copied successfully
RUN if [ ! -f /tmp/requirements.txt ]; then         echo "ERROR: requirements.txt not found at /tmp/requirements.txt" &&         echo "Current directory:" && pwd &&         echo "Files in /workspace:" && ls -la /workspace &&         echo "Files in /workspace/example:" && ls -la /workspace/example 2>/dev/null || echo "example directory not found" &&         exit 1;     else         echo "requirements.txt found, installing dependencies..." &&         cat /tmp/requirements.txt;     fi

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Verify pylint is installed and available in PATH
RUN python -c "import pylint; print(f'pylint version: {pylint.__version__}')" &&     echo "Pylint installation verified successfully" &&     which pylint &&     pylint --version

RUN echo "Python environment ready with pylint and all dependencies"
