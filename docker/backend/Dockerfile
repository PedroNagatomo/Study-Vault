# docker/backend/Dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar pom.xml primeiro para cache de dependências
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY backend/src ./src

# Build com skip tests
RUN mvn clean package spring-boot:repackage -DskipTests

# Verificar o JAR gerado
RUN ls -la target/

# Estágio final
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiar o JAR com o nome correto
COPY --from=build /app/target/study-vault-backend-*.jar app.jar

# Expor porta
EXPOSE 8080

# Entrypoint com Java options
ENTRYPOINT ["java", "-jar", "app.jar"]