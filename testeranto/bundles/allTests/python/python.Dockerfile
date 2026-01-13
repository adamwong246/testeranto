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


# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

RUN echo "Python environment ready with pylint and all dependencies"
