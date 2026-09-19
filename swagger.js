import { writeFileSync } from 'node:fs';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books & Authors API',
      version: '1.0.0',
      description: 'A simple API for working with books and author references.'
    },
    servers: [
      {
        url: '/',
        description: 'Current server'
      }
    ]
  },
  // We explicitly name the exact file paths here so the tool doesn't miss them
  apis: [
    './app.js',
    './src/router.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated successfully.');
