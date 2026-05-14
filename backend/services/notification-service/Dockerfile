FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/notification-service/pom.xml services/notification-service/pom.xml
RUN mvn -q -f services/notification-service/pom.xml -DskipTests dependency:go-offline

COPY services/notification-service/src services/notification-service/src
RUN mvn -q -f services/notification-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/notification-service/target/*.jar app.jar

EXPOSE 8091
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
