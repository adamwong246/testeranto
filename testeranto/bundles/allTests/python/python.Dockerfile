FROM python:3.11-alpine
WORKDIR /workspace
COPY . .
RUN pip install --no-cache-dir pytest
RUN mkdir -p /workspace/testeranto/bundles/allTests/python
RUN mkdir -p /workspace/testeranto/metafiles/python
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/python
ENV METAFILES_DIR=/workspace/testeranto/metafiles/python
ENV IN_DOCKER=true
CMD ["sh", "-c", "echo 'Python build container ready'; \
                    mkdir -p /workspace/testeranto/bundles/allTests/python; \
                    mkdir -p /workspace/testeranto/metafiles/python; \
                    tail -f /dev/null"]