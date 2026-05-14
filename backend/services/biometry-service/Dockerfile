FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY services/biometry-service/pom.xml services/biometry-service/pom.xml
RUN mvn -q -f services/biometry-service/pom.xml -DskipTests dependency:go-offline

COPY services/biometry-service/src services/biometry-service/src
RUN mvn -q -f services/biometry-service/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/services/biometry-service/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java","-jar","/app/app.jar"]
