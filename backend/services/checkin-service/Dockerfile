FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/checkin-service/pom.xml services/checkin-service/pom.xml
RUN mvn -q -f services/checkin-service/pom.xml -DskipTests dependency:go-offline

COPY services/checkin-service/src services/checkin-service/src
RUN mvn -q -f services/checkin-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/checkin-service/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
