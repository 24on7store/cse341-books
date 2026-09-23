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
  // We only scan the router files from here without importing them directly
  apis: ['./app.js', './src/router.js', './src/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated successfully.');
