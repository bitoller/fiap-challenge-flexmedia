FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/reservation-service/pom.xml services/reservation-service/pom.xml
RUN mvn -q -f services/reservation-service/pom.xml -DskipTests dependency:go-offline

COPY services/reservation-service/src services/reservation-service/src
RUN mvn -q -f services/reservation-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/reservation-service/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
