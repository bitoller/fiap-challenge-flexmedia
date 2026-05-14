FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/pms-adapter-service/pom.xml services/pms-adapter-service/pom.xml
RUN mvn -q -f services/pms-adapter-service/pom.xml -DskipTests dependency:go-offline

COPY services/pms-adapter-service/src services/pms-adapter-service/src
RUN mvn -q -f services/pms-adapter-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/pms-adapter-service/target/*.jar app.jar

EXPOSE 8087

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
