#!/usr/bin/env bash
# Script to run the Spring Boot Backend

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR/backend" || exit 1

echo "========================================================"
echo " Starting Spring Boot Student Registration Backend...   "
echo "========================================================"

if [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run
elif [ -f "/Applications/IntelliJ IDEA.app/Contents/plugins/maven-plugin/lib/maven3/bin/mvn" ]; then
    "/Applications/IntelliJ IDEA.app/Contents/plugins/maven-plugin/lib/maven3/bin/mvn" spring-boot:run
else
    mvn spring-boot:run
fi
