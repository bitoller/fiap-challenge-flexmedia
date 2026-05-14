FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/api-gateway/pom.xml services/api-gateway/pom.xml
RUN mvn -q -f services/api-gateway/pom.xml -DskipTests dependency:go-offline

COPY services/api-gateway/src services/api-gateway/src
RUN mvn -q -f services/api-gateway/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/api-gateway/target/*.jar app.jar

EXPOSE 8088
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
