FROM eclipse-temurin:21-jre

WORKDIR /app

ARG JAR_FILE=target/pms-adapter-service-0.1.0.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8087

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
