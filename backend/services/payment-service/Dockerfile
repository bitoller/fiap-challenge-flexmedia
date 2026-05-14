FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/payment-service/pom.xml services/payment-service/pom.xml
RUN mvn -q -f services/payment-service/pom.xml -DskipTests dependency:go-offline

COPY services/payment-service/src services/payment-service/src
RUN mvn -q -f services/payment-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /app/services/payment-service/target/*.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
