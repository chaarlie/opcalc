FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /opcalc

COPY /target/opcalc.jar .

ENTRYPOINT ["java","-jar","/opcalc/opcalc.jar"]