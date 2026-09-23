import express from 'express';
import { readFileSync, existsSync } from 'node:fs';
import swaggerUi from 'swagger-ui-express';
//import authorsRouter from './src/router.js'; // 1. Import your new router map
import centralRouter from './src/router.js'; 

const app = express();
app.use(express.json());

let swaggerDocument = {};
if (existsSync('./swagger.json')) {
  swaggerDocument = JSON.parse(readFileSync('./swagger.json', 'utf8'));
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 2. Mount your router under the base paths path layer
// app.use('/', authorsRouter);
app.use('/', centralRouter);

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to the Books API!' });
});

// (Keep your legacy Week 01 GET /books and GET /books/:id logic here for now)

export default app;
