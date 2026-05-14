FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/key-service/pom.xml services/key-service/pom.xml
RUN mvn -q -f services/key-service/pom.xml -DskipTests dependency:go-offline

COPY services/key-service/src services/key-service/src
RUN mvn -q -f services/key-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/key-service/target/*.jar app.jar

EXPOSE 8084
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
