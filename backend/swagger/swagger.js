const SwaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chaptr API',
      version: '1.0.0',
      description: 'Read-first, pay-later book platform API'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};
const swaggerSpec = SwaggerJsDoc(options);
const setupSwagger = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
module.exports = setupSwagger;
