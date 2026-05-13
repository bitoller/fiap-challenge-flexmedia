FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/biometry-service-0.1.0.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java","-jar","/app/app.jar"]
