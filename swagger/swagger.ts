import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PayRunner API",
      version: "1.0.0",
      description: "PayRunner에서 사용되는 API 문서입니다",
    },
    servers: [
      {
        url: "http://localhost:8080", // API 서버 URL
      },
    ],
  },
  apis: ["./server/routes/*.ts", "./server/server.ts"], // Swagger 주석을 읽을 파일 경로
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );
  console.log("📄 Swagger Docs: http://localhost:3000/docs");
}
