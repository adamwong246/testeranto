FROM golang:1.21-alpine
WORKDIR /workspace
COPY . .
RUN mkdir -p /workspace/testeranto/bundles/allTests/golang
RUN mkdir -p /workspace/testeranto/metafiles/golang
EXPOSE 3456
ENV BUNDLES_DIR=/workspace/testeranto/bundles/allTests/golang
ENV METAFILES_DIR=/workspace/testeranto/metafiles/golang
ENV IN_DOCKER=true
CMD ["sh", "-c", "echo 'Go build container ready'; \
                    mkdir -p /workspace/testeranto/bundles/allTests/golang; \
                    mkdir -p /workspace/testeranto/metafiles/golang; \
                    tail -f /dev/null"]