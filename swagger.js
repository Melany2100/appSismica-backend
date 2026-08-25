import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentación - Sistema de Vulnerabilidad Sísmica",
    version: "1.0.0",
    description:
      "API para el sistema de evaluación de vulnerabilidad sísmica de edificios",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desarrollo",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Ingrese el token JWT en el formato: Bearer <token>",
      },
    },
  },
  tags: [
    { name: "Autenticación" },
    { name: "Asignaciones" },
    { name: "Usuarios" },
    { name: "Edificios" },
    { name: "Inspecciones" },
    { name: "Catálogos" },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./lib/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiExpress = swaggerUi;
