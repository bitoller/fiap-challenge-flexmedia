FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/admin-service/pom.xml services/admin-service/pom.xml
RUN mvn -q -f services/admin-service/pom.xml -DskipTests dependency:go-offline

COPY services/admin-service/src services/admin-service/src
RUN mvn -q -f services/admin-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/admin-service/target/*.jar app.jar

EXPOSE 8085
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
