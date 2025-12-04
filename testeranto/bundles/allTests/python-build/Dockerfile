FROM python:3.11-alpine
WORKDIR /workspace
RUN apk update && apk add --no-cache \
    build-base \
    libffi-dev \
    openssl-dev \
    cargo \
    nodejs \
    npm \
    && rm -rf /var/cache/apk/*
RUN npm install -g tsx
# requirements.txt not found
# Skipping pip install
COPY ./src ./src/
COPY allTests.ts .
# Copy builders source code
COPY ./src/builders ./src/builders/
RUN mkdir -p /workspace/testeranto
RUN mkdir -p /workspace/testeranto/bundles
RUN mkdir -p /workspace/testeranto/bundles/python
RUN mkdir -p /workspace/testeranto/bundles/python/allTests
RUN mkdir -p /workspace/testeranto/metafiles
RUN mkdir -p /workspace/testeranto/metafiles/python
ENV BUNDLES_DIR=/workspace/testeranto/bundles/python/allTests
ENV METAFILES_DIR=/workspace/testeranto/metafiles/python
ENV TESTERANTO_RUNTIME=python
# Run the python builder using tsx
CMD ["tsx", "src/builders/python.ts", "allTests.ts"]
