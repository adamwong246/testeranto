FROM python:3.11-alpine
WORKDIR /workspace

# Install system dependencies needed for building Python packages
RUN apk add --no-cache     \
  gcc \
  musl-dev \
  python3-dev \
  libffi-dev  \
  openssl-dev  \ 
  cargo \
  git     && rm -rf /var/cache/apk/*

RUN pip install -r example/requirements.txt
