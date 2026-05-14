FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/device-service/pom.xml services/device-service/pom.xml
RUN mvn -q -f services/device-service/pom.xml -DskipTests dependency:go-offline

COPY services/device-service/src services/device-service/src
RUN mvn -q -f services/device-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/device-service/target/*.jar app.jar

EXPOSE 8089
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
