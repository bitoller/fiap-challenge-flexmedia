FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/identity-service/pom.xml services/identity-service/pom.xml
RUN mvn -q -f services/identity-service/pom.xml -DskipTests dependency:go-offline

COPY services/identity-service/src services/identity-service/src
RUN mvn -q -f services/identity-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/identity-service/target/*.jar app.jar

EXPOSE 8090
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
