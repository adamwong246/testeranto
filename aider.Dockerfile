FROM python:3.11-slim
WORKDIR /workspace
RUN pip install --no-cache-dir aider-chat
# Create a non-root user for security`,
RUN useradd -m -u 1000 aider && chown -R aider:aider /workspace
USER aider
# Copy API keys if they exist in the host's .aider.conf.yml`,
# The actual API keys will be passed as environment variables at runtime`,
# Default command starts aider in interactive mode`,
CMD ["aider", "--yes", "--dark-mode"]
