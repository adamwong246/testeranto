# syntax=docker/dockerfile:1
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /workspace

# Install system dependencies needed for building Java projects
RUN apt-get update && apt-get install -y \
    maven \
    gradle \
    git \
    curl \
    wget \
    bash \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install JSON library for Java builder
RUN wget -O /tmp/json.jar https://repo1.maven.org/maven2/org/json/json/20231013/json-20231013.jar \
    && mkdir -p /workspace/lib \
    && mv /tmp/json.jar /workspace/lib/

# Set up Java classpath
ENV CLASSPATH="/workspace/lib/json.jar:."

# Default command: run the Java builder
CMD ["sh", "-c", "cd /workspace && javac -cp \".:lib/*\" src/server/runtimes/java/main.java && java -cp \"src/server/runtimes/java:.\" main"]
